// Create database tables manually using service role
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Required in .env:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Creating database tables...\n');

  try {
    // First, let's check what tables already exist
    console.log('1️⃣ Checking existing tables...');
    
    // Try to query information_schema to see what tables exist
    const { data: existingTables, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (schemaError) {
      console.log('⚠️ Cannot check existing tables:', schemaError.message);
    } else {
      console.log('📋 Existing tables:', existingTables?.map(t => t.table_name).join(', ') || 'None');
    }

    // Method 1: Try using SQL execution via REST API
    console.log('\n2️⃣ Creating tables via SQL...');
    
    const createTablesSQL = `
      -- Create orders table
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
          payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'online')),
          order_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
          order_date TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Create order_items table
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

      -- Enable RLS
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DROP POLICY IF EXISTS "Allow public to insert orders" ON orders;
      CREATE POLICY "Allow public to insert orders" ON orders
          FOR INSERT TO public
          WITH CHECK (true);

      DROP POLICY IF EXISTS "Allow public to insert order_items" ON order_items;
      CREATE POLICY "Allow public to insert order_items" ON order_items
          FOR INSERT TO public
          WITH CHECK (true);

      DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
      CREATE POLICY "Users can view their own orders" ON orders
          FOR SELECT TO authenticated
          USING (customer_email = auth.jwt() ->> 'email');

      DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
      CREATE POLICY "Users can view their own order items" ON order_items
          FOR SELECT TO authenticated
          USING (
              order_id IN (
                  SELECT order_id FROM orders 
                  WHERE customer_email = auth.jwt() ->> 'email'
              )
          );

      DROP POLICY IF EXISTS "Service role can access all orders" ON orders;
      CREATE POLICY "Service role can access all orders" ON orders
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role can access all order items" ON order_items;
      CREATE POLICY "Service role can access all order items" ON order_items
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true);
    `;

    // Try to execute SQL using the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: createTablesSQL })
    });

    if (!response.ok) {
      console.log('⚠️ SQL execution via REST API failed');
      
      // Method 2: Try creating tables by attempting to insert and catching errors
      console.log('\n3️⃣ Testing table creation by attempting operations...');
      
      // Test if orders table exists by trying to select from it
      const { data: ordersTest, error: ordersTestError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

      if (ordersTestError && ordersTestError.message.includes('does not exist')) {
        console.log('❌ Orders table does not exist');
        console.log('\n🔧 MANUAL SETUP REQUIRED:');
        console.log('Please go to your Supabase dashboard and run this SQL in the SQL Editor:');
        console.log('\n' + '='.repeat(80));
        console.log(createTablesSQL);
        console.log('='.repeat(80));
        console.log('\n📍 Steps:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Paste the SQL above');
        console.log('5. Click "Run"');
        console.log('6. Come back and test your order system');
        
        return;
      } else if (!ordersTestError) {
        console.log('✅ Orders table already exists');
      }

      // Test order_items table
      const { data: itemsTest, error: itemsTestError } = await supabase
        .from('order_items')
        .select('id')
        .limit(1);

      if (itemsTestError && itemsTestError.message.includes('does not exist')) {
        console.log('❌ Order items table does not exist');
      } else if (!itemsTestError) {
        console.log('✅ Order items table already exists');
      }

    } else {
      console.log('✅ Tables created successfully via SQL execution');
    }

    // Final test: Try to insert a test order
    console.log('\n4️⃣ Testing table functionality...');
    const testOrderId = 'TEST_' + Date.now();
    
    const { data: insertData, error: insertError } = await supabase
      .from('orders')
      .insert([{
        order_id: testOrderId,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '9876543210',
        delivery_address: '123 Test Street',
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

    if (insertError) {
      console.log('❌ Test order insertion failed:', insertError.message);
      console.log('💡 Tables may need manual creation in Supabase dashboard');
    } else {
      console.log('✅ Test order inserted successfully!');
      console.log('📦 Order data:', insertData[0]);
      
      // Clean up test order
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', testOrderId);
      console.log('🧹 Test order cleaned up');
    }

    console.log('\n🎉 Database setup process complete!');
    console.log('✅ Your order management system should now work properly');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createTables();