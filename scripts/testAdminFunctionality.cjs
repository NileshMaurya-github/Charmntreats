// Test admin functionality and testimonials display
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

async function testAdminFunctionality() {
  console.log('🧪 Testing Admin Dashboard Functionality...\n');

  try {
    // Test all the data that admin dashboard fetches
    console.log('1️⃣ Testing products fetch...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) {
      console.log('❌ Products error:', productsError.message);
    } else {
      console.log(`✅ Products: ${productsData.length} found`);
    }

    console.log('\n2️⃣ Testing orders fetch...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.log('❌ Orders error:', ordersError.message);
    } else {
      console.log(`✅ Orders: ${ordersData.length} found`);
    }

    console.log('\n3️⃣ Testing users fetch...');
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.log('❌ Users error:', usersError.message);
    } else {
      console.log(`✅ Users: ${usersData.length} found`);
    }

    console.log('\n4️⃣ Testing testimonials fetch (EXACT SAME QUERY AS ADMIN)...');
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (testimonialsError) {
      console.log('❌ Testimonials error:', testimonialsError.message);
      console.log('This is why your admin shows 0 testimonials!');
    } else {
      console.log(`✅ Testimonials: ${testimonialsData.length} found`);
      console.log('\n📋 Testimonials details:');
      testimonialsData.forEach((testimonial, index) => {
        console.log(`   ${index + 1}. ${testimonial.customer_name} (${testimonial.rating}⭐)`);
        console.log(`      Featured: ${testimonial.is_featured ? 'Yes' : 'No'}`);
        console.log(`      Approved: ${testimonial.is_approved ? 'Yes' : 'No'}`);
      });
    }

    console.log('\n5️⃣ Testing homepage content fetch...');
    const { data: homepageData, error: homepageError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (homepageError && homepageError.code !== 'PGRST116') {
      console.log('❌ Homepage error:', homepageError.message);
    } else {
      console.log(`✅ Homepage content: ${homepageData ? 'Found' : 'Not found'}`);
    }

    console.log('\n📊 ADMIN DASHBOARD DATA SUMMARY:');
    console.log(`📦 Products: ${productsData?.length || 0}`);
    console.log(`🛒 Orders: ${ordersData?.length || 0}`);
    console.log(`👥 Users: ${usersData?.length || 0}`);
    console.log(`💬 Testimonials: ${testimonialsData?.length || 0}`);

    if (testimonialsData && testimonialsData.length > 0) {
      console.log('\n🎉 TESTIMONIALS ARE WORKING!');
      console.log('If your admin still shows 0, try:');
      console.log('1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)');
      console.log('2. Clear browser cache');
      console.log('3. Open admin in incognito/private window');
      console.log('4. Check browser console for JavaScript errors');
    } else {
      console.log('\n❌ NO TESTIMONIALS FOUND - This explains the 0 count');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminFunctionality();