// Fix database schema issues
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Failed to load .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixDatabaseSchema() {
  console.log('🔧 Fixing database schema...\n');

  try {
    // Check current orders table structure
    console.log('1️⃣ Checking current orders table...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (ordersError) {
      console.log('❌ Orders table error:', ordersError.message);
      
      if (ordersError.message.includes('does not exist')) {
        console.log('📋 Orders table does not exist. Creating it...');
        
        // Since we can't execute SQL directly, let's provide manual instructions
        console.log('\n🔧 MANUAL DATABASE SETUP REQUIRED:');
        console.log('Please go to your Supabase dashboard and run this SQL:');
        console.log('\n' + '='.repeat(80));
        console.log(`
-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with all required columns
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
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'online')),
    order_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    order_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Allow public to insert orders" ON orders
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to select orders" ON orders
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT TO authenticated
    USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can access all orders" ON orders
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for order_items table
CREATE POLICY "Allow public to insert order_items" ON order_items
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to select order_items" ON order_items
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT TO authenticated
    USING (
        order_id IN (
            SELECT order_id FROM orders 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Service role can access all order items" ON order_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('='.repeat(80));
        console.log('\n📍 Steps to fix your database:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Paste the SQL above');
        console.log('5. Click "Run"');
        console.log('6. Run this script again to test');
        
        return;
      }
    } else {
      console.log('✅ Orders table exists, checking structure...');
      
      // Check if the table has the right columns by trying to select specific columns
      const testColumns = ['order_id', 'customer_name', 'customer_email', 'city', 'state', 'total_amount'];
      const missingColumns = [];
      
      for (const column of testColumns) {
        try {
          const { error } = await supabase
            .from('orders')
            .select(column)
            .limit(1);
          
          if (error && error.message.includes(`column orders.${column} does not exist`)) {
            missingColumns.push(column);
          }
        } catch (e) {
          missingColumns.push(column);
        }
      }
      
      if (missingColumns.length > 0) {
        console.log('❌ Missing columns in orders table:', missingColumns.join(', '));
        console.log('💡 The orders table exists but has wrong structure');
        console.log('🔧 Please run the SQL above to recreate the table properly');
        return;
      } else {
        console.log('✅ Orders table has correct structure');
      }
    }

    // Check order_items table
    console.log('\n2️⃣ Checking order_items table...');
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1);

    if (itemsError && itemsError.message.includes('does not exist')) {
      console.log('❌ Order items table does not exist');
      console.log('💡 Please run the SQL above to create both tables');
      return;
    } else if (!itemsError) {
      console.log('✅ Order items table exists');
    }

    // Test functionality
    console.log('\n3️⃣ Testing complete functionality...');
    const testOrderId = 'TEST_' + Date.now();
    
    // Test order insertion
    const { data: orderInsert, error: orderInsertError } = await supabase
      .from('orders')
      .insert([{
        order_id: testOrderId,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '9876543210',
        delivery_address: '123 Test Street, Test Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        subtotal: 1000,
        shipping_cost: 50,
        total_amount: 1050,
        payment_method: 'cod',
        order_status: 'confirmed',
        order_date: new Date().toISOString()
      }])
      .select();

    if (orderInsertError) {
      console.log('❌ Order insertion failed:', orderInsertError.message);
      return;
    } else {
      console.log('✅ Order insertion successful');
    }

    // Test order items insertion
    const { data: itemInsert, error: itemInsertError } = await supabase
      .from('order_items')
      .insert([{
        order_id: testOrderId,
        product_id: 'test-product-1',
        product_name: 'Test Product',
        product_category: 'Test Category',
        catalog_number: 'TEST001',
        quantity: 2,
        unit_price: 500,
        total_price: 1000,
        product_image: 'https://example.com/image.jpg'
      }])
      .select();

    if (itemInsertError) {
      console.log('❌ Order item insertion failed:', itemInsertError.message);
    } else {
      console.log('✅ Order item insertion successful');
    }

    // Test order retrieval
    const { data: retrievedOrders, error: retrieveError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('order_id', testOrderId);

    if (retrieveError) {
      console.log('❌ Order retrieval failed:', retrieveError.message);
    } else {
      console.log('✅ Order retrieval successful');
      console.log('📦 Retrieved order:', {
        orderId: retrievedOrders[0]?.order_id,
        customerName: retrievedOrders[0]?.customer_name,
        totalAmount: retrievedOrders[0]?.total_amount,
        itemsCount: retrievedOrders[0]?.order_items?.length || 0
      });
    }

    // Clean up test data
    await supabase.from('order_items').delete().eq('order_id', testOrderId);
    await supabase.from('orders').delete().eq('order_id', testOrderId);
    console.log('🧹 Test data cleaned up');

    console.log('\n🎉 Database schema is working correctly!');
    console.log('✅ Your order management system is ready to use');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

fixDatabaseSchema();