// Test admin dashboard performance
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminPerformance() {
  console.log('🚀 Testing Admin Dashboard Performance...');
  
  const startTime = Date.now();
  
  try {
    console.log('📊 Starting parallel data fetch...');
    
    // Simulate the new parallel fetching approach
    const [
      productsResult,
      ordersResult,
      customersResult,
      testimonialsResult
    ] = await Promise.allSettled([
      // Fetch products
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),
      
      // Fetch orders (last 3 months)
      (() => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .gte('created_at', threeMonthsAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(50);
      })(),
      
      // Fetch customer profiles
      supabase
        .from('customer_profiles')
        .select('*')
        .order('last_login_at', { ascending: false })
        .limit(100),
      
      // Fetch testimonials
      supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log('\n📊 Performance Results:');
    console.log(`⏱️  Total fetch time: ${totalTime}ms`);
    
    // Handle products
    if (productsResult.status === 'fulfilled' && !productsResult.value.error) {
      console.log(`✅ Products loaded: ${productsResult.value.data?.length || 0} items`);
    } else {
      console.log('❌ Products failed to load');
    }

    // Handle orders
    if (ordersResult.status === 'fulfilled' && !ordersResult.value.error) {
      console.log(`✅ Orders loaded: ${ordersResult.value.data?.length || 0} items`);
    } else {
      console.log('❌ Orders failed to load');
    }

    // Handle customers
    if (customersResult.status === 'fulfilled' && !customersResult.value.error) {
      console.log(`✅ Customers loaded: ${customersResult.value.data?.length || 0} items`);
    } else {
      console.log('⚠️ Customer profiles not available (table may not exist)');
    }

    // Handle testimonials
    if (testimonialsResult.status === 'fulfilled' && !testimonialsResult.value.error) {
      console.log(`✅ Testimonials loaded: ${testimonialsResult.value.data?.length || 0} items`);
    } else {
      console.log('❌ Testimonials failed to load');
    }

    console.log('\n🎯 Performance Analysis:');
    if (totalTime < 3000) {
      console.log('🚀 EXCELLENT: Dashboard loads in under 3 seconds');
    } else if (totalTime < 5000) {
      console.log('✅ GOOD: Dashboard loads in under 5 seconds');
    } else if (totalTime < 10000) {
      console.log('⚠️ MODERATE: Dashboard takes 5-10 seconds');
    } else {
      console.log('❌ SLOW: Dashboard takes over 10 seconds');
    }

    console.log('\n🎉 Admin dashboard performance test completed!');

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }
}

testAdminPerformance();