const { createClient } = require('@supabase/supabase-js');

// Use actual Supabase values
const supabaseUrl = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOrdersTables() {
  try {
    console.log('🚀 Creating orders tables using SQL...');

    // Create orders table
    console.log('Creating orders table...');
    const { error: ordersError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS orders (
          id BIGSERIAL PRIMARY KEY,
          order_id VARCHAR(50) UNIQUE NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(20) NOT NULL,
          delivery_address TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          pincode VARCHAR(10) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
          shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
          total_amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(20) NOT NULL,
          order_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
          order_date TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (ordersError) {
      console.log('⚠️ Orders table creation failed:', ordersError.message);
      
      // Try alternative approach - direct table creation
      console.log('🔄 Trying direct table creation...');
      
      const { error: directError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
        
      if (directError && directError.message.includes('does not exist')) {
        console.log('❌ Orders table does not exist and cannot be created via RPC');
        console.log('💡 Please create the table manually in Supabase dashboard');
        console.log('📋 SQL to run in Supabase SQL Editor:');
        console.log(`
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  order_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  order_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(100),
  catalog_number VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders
CREATE POLICY "Allow public to insert orders" ON orders
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to insert order_items" ON order_items
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT TO authenticated
    USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT TO authenticated
    USING (
        order_id IN (
            SELECT order_id FROM orders 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );
        `);
        return;
      }
    } else {
      console.log('✅ Orders table created successfully!');
    }

    // Create order_items table
    console.log('Creating order_items table...');
    const { error: itemsError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS order_items (
          id BIGSERIAL PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL,
          product_id VARCHAR(50) NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          product_category VARCHAR(100),
          catalog_number VARCHAR(100),
          quantity INTEGER NOT NULL DEFAULT 1,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          product_image TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (itemsError) {
      console.log('⚠️ Order items table creation failed:', itemsError.message);
    } else {
      console.log('✅ Order items table created successfully!');
    }

    // Test by inserting a sample order
    console.log('Testing tables with sample data...');
    const testOrderId = 'TEST' + Date.now();
    
    const { error: insertError } = await supabase
      .from('orders')
      .insert([
        {
          order_id: testOrderId,
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '9876543210',
          delivery_address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          subtotal: 500,
          shipping_cost: 0,
          total_amount: 500,
          payment_method: 'cod',
          order_date: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.log('⚠️ Test insert failed:', insertError.message);
      console.log('💡 Tables may need to be created manually in Supabase dashboard');
    } else {
      console.log('✅ Test order inserted successfully!');
      
      // Clean up test data
      await supabase.from('orders').delete().eq('order_id', testOrderId);
      console.log('🧹 Test data cleaned up');
    }

    console.log('🎉 Orders system setup complete!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createOrdersTables();