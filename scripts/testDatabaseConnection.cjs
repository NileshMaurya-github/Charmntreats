// Test database connection and table existence
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
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
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and tables...\n');

  try {
    // Test 1: Check if orders table exists
    console.log('1️⃣ Testing orders table...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)')
      .limit(1);

    if (ordersError) {
      console.error('❌ Orders table error:', ordersError.message);
      if (ordersError.message.includes('relation "orders" does not exist')) {
        console.log('🔧 Solution: Run the database migration to create tables');
        console.log('   Command: npm run db:migrate');
      }
    } else {
      console.log('✅ Orders table exists and is accessible');
    }

    // Test 2: Check if order_items table exists
    console.log('\n2️⃣ Testing order_items table...');
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('count(*)')
      .limit(1);

    if (itemsError) {
      console.error('❌ Order items table error:', itemsError.message);
    } else {
      console.log('✅ Order items table exists and is accessible');
    }

    // Test 3: Try to insert a test order
    console.log('\n3️⃣ Testing order insertion...');
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
      console.error('❌ Order insertion failed:', insertError.message);
      if (insertError.message.includes('permission denied')) {
        console.log('🔧 Solution: Check RLS policies or use service role key');
      }
    } else {
      console.log('✅ Test order inserted successfully');
      
      // Clean up test order
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', testOrderId);
      console.log('🧹 Test order cleaned up');
    }

    // Test 4: Check existing orders count
    console.log('\n4️⃣ Checking existing orders...');
    const { data: existingOrders, error: countError } = await supabase
      .from('orders')
      .select('order_id, customer_name, total_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (countError) {
      console.error('❌ Failed to fetch existing orders:', countError.message);
    } else {
      console.log(`✅ Found ${existingOrders.length} existing orders`);
      if (existingOrders.length > 0) {
        console.log('Recent orders:');
        existingOrders.forEach(order => {
          console.log(`  - ${order.order_id}: ${order.customer_name} (₹${order.total_amount})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }

  console.log('\n🎯 Database Status Summary:');
  console.log('- If tables don\'t exist: Run migration scripts');
  console.log('- If permission errors: Check RLS policies');
  console.log('- If connection fails: Check .env credentials');
}

testDatabaseConnection();