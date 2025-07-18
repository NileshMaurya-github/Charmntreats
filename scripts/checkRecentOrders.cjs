// Check recent orders in the database
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
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentOrders() {
  console.log('🔍 Checking recent orders in database...\n');

  try {
    // Get all orders from the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    console.log('📅 Checking orders from:', threeMonthsAgo.toLocaleDateString('en-IN'));
    console.log('📅 To today:', new Date().toLocaleDateString('en-IN'));

    // Fetch all orders (no date filter first to see what we have)
    console.log('\n1️⃣ Fetching all orders...');
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (allOrdersError) {
      console.log('❌ Error fetching orders:', allOrdersError.message);
      return;
    }

    console.log(`✅ Total orders in database: ${allOrders.length}`);

    if (allOrders.length === 0) {
      console.log('\n📝 No orders found in database!');
      console.log('This explains why your admin dashboard shows no orders.');
      console.log('\n🔧 Possible reasons:');
      console.log('• Orders are being stored in localStorage instead of database');
      console.log('• Database connection issues during checkout');
      console.log('• RLS policies preventing order storage');
      return;
    }

    // Show recent orders
    console.log('\n📋 Recent orders:');
    allOrders.slice(0, 10).forEach((order, index) => {
      const orderDate = new Date(order.created_at);
      const isRecent = orderDate >= threeMonthsAgo;
      
      console.log(`${index + 1}. ${order.order_id} - ${order.customer_name}`);
      console.log(`   💰 ₹${order.total_amount.toLocaleString()} (${order.payment_method.toUpperCase()})`);
      console.log(`   📅 ${orderDate.toLocaleDateString('en-IN')} ${orderDate.toLocaleTimeString('en-IN')}`);
      console.log(`   📍 ${order.city}, ${order.state}`);
      console.log(`   ${isRecent ? '✅ Within 3 months' : '⚠️ Older than 3 months'}`);
      console.log('');
    });

    // Filter orders from last 3 months
    const recentOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= threeMonthsAgo;
    });

    console.log(`\n📊 Orders from last 3 months: ${recentOrders.length}`);

    // Check for yesterday's orders specifically
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterdayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= yesterday && orderDate < today;
    });

    console.log(`📅 Yesterday's orders: ${yesterdayOrders.length}`);
    
    if (yesterdayOrders.length > 0) {
      console.log('📋 Yesterday\'s orders:');
      yesterdayOrders.forEach(order => {
        console.log(`   • ${order.order_id}: ${order.customer_name} - ₹${order.total_amount.toLocaleString()}`);
      });
    }

    // Check for today's orders
    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= today;
    });

    console.log(`📅 Today's orders: ${todayOrders.length}`);

    if (todayOrders.length > 0) {
      console.log('📋 Today\'s orders:');
      todayOrders.forEach(order => {
        console.log(`   • ${order.order_id}: ${order.customer_name} - ₹${order.total_amount.toLocaleString()}`);
      });
    }

    // Test the exact same query as Admin component
    console.log('\n2️⃣ Testing Admin component query...');
    const { data: adminOrders, error: adminError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.log('❌ Admin query error:', adminError.message);
    } else {
      console.log(`✅ Admin query returns: ${adminOrders.length} orders`);
    }

    console.log('\n🎯 SUMMARY:');
    console.log(`📦 Total orders: ${allOrders.length}`);
    console.log(`📅 Last 3 months: ${recentOrders.length}`);
    console.log(`📅 Yesterday: ${yesterdayOrders.length}`);
    console.log(`📅 Today: ${todayOrders.length}`);

    if (allOrders.length > 0 && recentOrders.length === 0) {
      console.log('\n⚠️ All orders are older than 3 months');
      console.log('This might explain why you don\'t see recent orders in admin');
    }

    if (allOrders.length > 0) {
      console.log('\n✅ Orders are being stored in database correctly');
      console.log('If admin dashboard shows 0 orders, it\'s a frontend display issue');
    }

  } catch (error) {
    console.error('❌ Error checking orders:', error.message);
  }
}

// Run the check
checkRecentOrders();