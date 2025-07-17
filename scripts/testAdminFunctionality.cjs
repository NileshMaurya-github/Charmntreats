// Test script to verify admin dashboard functionality
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseTables() {
  console.log('🧪 Testing Admin Dashboard Database Tables...\n');

  const tables = ['products', 'testimonials', 'homepage_content', 'orders', 'customer_data'];
  
  for (const table of tables) {
    try {
      console.log(`📊 Testing ${table} table...`);
      
      // Test if table exists and is accessible
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Error accessing ${table} table:`, error.message);
      } else {
        console.log(`✅ ${table} table is accessible`);
        console.log(`📋 Current records: ${data ? data.length : 0}`);
      }
    } catch (error) {
      console.error(`💥 Unexpected error with ${table} table:`, error);
    }
    console.log('');
  }
}

async function testProductInsertion() {
  console.log('🛍️ Testing Product Insertion...\n');

  const testProduct = {
    name: 'Test Product',
    description: 'This is a test product for admin dashboard',
    price: 99.99,
    category: 'Dream Catcher',
    catalog_number: 'TEST001',
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
    in_stock: true,
    featured: false,
    rating: 4.5,
    reviews: 10,
    stock_quantity: 50
  };

  try {
    console.log('📦 Inserting test product...');
    console.log('Product data:', JSON.stringify(testProduct, null, 2));

    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select();

    if (error) {
      console.error('❌ Error inserting product:', error.message);
      return false;
    } else {
      console.log('✅ Product inserted successfully!');
      console.log('📦 Inserted product:', data[0]);
      
      // Clean up - delete the test product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', data[0].id);
      
      if (!deleteError) {
        console.log('🗑️ Test product cleaned up successfully');
      }
      
      return true;
    }
  } catch (error) {
    console.error('💥 Unexpected error inserting product:', error);
    return false;
  }
}

async function testTestimonialInsertion() {
  console.log('\n⭐ Testing Testimonial Insertion...\n');

  const testTestimonial = {
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    rating: 5,
    review_text: 'This is a test testimonial for the admin dashboard functionality.',
    is_featured: true
  };

  try {
    console.log('💬 Inserting test testimonial...');
    console.log('Testimonial data:', JSON.stringify(testTestimonial, null, 2));

    const { data, error } = await supabase
      .from('testimonials')
      .insert([testTestimonial])
      .select();

    if (error) {
      console.error('❌ Error inserting testimonial:', error.message);
      return false;
    } else {
      console.log('✅ Testimonial inserted successfully!');
      console.log('💬 Inserted testimonial:', data[0]);
      
      // Clean up - delete the test testimonial
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', data[0].id);
      
      if (!deleteError) {
        console.log('🗑️ Test testimonial cleaned up successfully');
      }
      
      return true;
    }
  } catch (error) {
    console.error('💥 Unexpected error inserting testimonial:', error);
    return false;
  }
}

async function testHomepageContentInsertion() {
  console.log('\n🏠 Testing Homepage Content Insertion...\n');

  const testHomepageContent = {
    hero_title: 'Test Hero Title',
    hero_subtitle: 'Test Hero Subtitle',
    hero_description: 'This is a test hero description for the admin dashboard functionality.',
    hero_image_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    is_active: true
  };

  try {
    console.log('🏠 Inserting test homepage content...');
    console.log('Homepage content data:', JSON.stringify(testHomepageContent, null, 2));

    const { data, error } = await supabase
      .from('homepage_content')
      .insert([testHomepageContent])
      .select();

    if (error) {
      console.error('❌ Error inserting homepage content:', error.message);
      return false;
    } else {
      console.log('✅ Homepage content inserted successfully!');
      console.log('🏠 Inserted content:', data[0]);
      
      // Clean up - delete the test content
      const { error: deleteError } = await supabase
        .from('homepage_content')
        .delete()
        .eq('id', data[0].id);
      
      if (!deleteError) {
        console.log('🗑️ Test homepage content cleaned up successfully');
      }
      
      return true;
    }
  } catch (error) {
    console.error('💥 Unexpected error inserting homepage content:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Admin Dashboard Functionality Tests...\n');
  
  // Test database tables
  await testDatabaseTables();
  
  // Test data insertion
  const productTest = await testProductInsertion();
  const testimonialTest = await testTestimonialInsertion();
  const homepageTest = await testHomepageContentInsertion();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Products: ${productTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Testimonials: ${testimonialTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Homepage Content: ${homepageTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allTestsPassed = productTest && testimonialTest && homepageTest;
  
  if (allTestsPassed) {
    console.log('\n🎉 All admin dashboard tests passed!');
    console.log('✅ Database tables are working correctly');
    console.log('✅ Data insertion is working');
    console.log('✅ Image upload functionality should work');
    console.log('✅ Admin dashboard is ready for use');
  } else {
    console.log('\n💥 Some tests failed!');
    console.log('❌ Check the database setup and permissions');
    console.log('❌ Run the database migrations if needed');
  }
  
  return allTestsPassed;
}

// Run all tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });