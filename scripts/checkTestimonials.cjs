// Check testimonials table and data
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

async function checkTestimonials() {
  console.log('🔍 Checking testimonials table and data...\n');

  try {
    // Check if we can access the testimonials table
    console.log('1️⃣ Testing table access...');
    
    const { data: testimonialsData, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.log('❌ Error accessing testimonials:', fetchError.message);
      
      if (fetchError.message.includes('permission denied')) {
        console.log('\n🔧 PERMISSION ISSUE DETECTED');
        console.log('The table exists but there are permission issues.');
        console.log('\nPlease run this SQL in Supabase to fix permissions:');
        console.log('\n' + '='.repeat(60));
        console.log(`
-- Fix testimonials table permissions
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to read approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public to insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Service role can access all testimonials" ON testimonials;

-- Create new policies
CREATE POLICY "Allow public to read approved testimonials" ON testimonials
    FOR SELECT TO public
    USING (is_approved = true);

CREATE POLICY "Allow public to insert testimonials" ON testimonials
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to select all testimonials" ON testimonials
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Service role can access all testimonials" ON testimonials
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to manage testimonials
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);
        `);
        console.log('='.repeat(60));
        return false;
      }
      
      return false;
    }

    console.log('✅ Successfully accessed testimonials table');
    console.log(`📊 Found ${testimonialsData.length} testimonials:`);

    if (testimonialsData.length === 0) {
      console.log('\n📝 No testimonials found. Adding sample data...');
      console.log('Run this SQL to add sample testimonials:');
      console.log('\n' + '='.repeat(60));
      console.log(`
INSERT INTO testimonials (customer_name, customer_email, rating, review_text, is_featured, is_approved) VALUES
('Sarah Johnson', 'sarah.j@example.com', 5, 'Absolutely love my dream catcher! The craftsmanship is incredible and it looks beautiful in my bedroom. Highly recommend Charmntreats!', true, true),
('Michael Chen', 'mike.chen@example.com', 5, 'The embroidery work is stunning. Ordered a custom piece and it exceeded my expectations. Great quality and fast shipping!', true, true),
('Emily Rodriguez', 'emily.r@example.com', 4, 'Beautiful handcrafted items. The attention to detail is amazing. Will definitely order again!', false, true),
('David Wilson', 'david.w@example.com', 5, 'Amazing quality and beautiful designs. The customer service was excellent too!', true, true),
('Lisa Thompson', 'lisa.t@example.com', 4, 'Love the unique handcrafted pieces. Each item tells a story. Great work!', false, true);
      `);
      console.log('='.repeat(60));
    } else {
      console.log('\n📋 Current testimonials:');
      testimonialsData.forEach((testimonial, index) => {
        console.log(`\n${index + 1}. ${testimonial.customer_name} (${testimonial.rating}⭐)`);
        console.log(`   Email: ${testimonial.customer_email || 'Not provided'}`);
        console.log(`   Review: "${testimonial.review_text.substring(0, 80)}..."`);
        console.log(`   Featured: ${testimonial.is_featured ? 'Yes' : 'No'}`);
        console.log(`   Approved: ${testimonial.is_approved ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(testimonial.created_at).toLocaleDateString()}`);
      });
    }

    // Test inserting a new testimonial
    console.log('\n2️⃣ Testing testimonial insertion...');
    
    const testTestimonial = {
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      rating: 5,
      review_text: 'This is a test testimonial to check if insertion works properly.',
      is_featured: false,
      is_approved: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('testimonials')
      .insert([testTestimonial])
      .select();

    if (insertError) {
      console.log('❌ Test insertion failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Test testimonial inserted successfully!');
      
      // Clean up test data
      await supabase
        .from('testimonials')
        .delete()
        .eq('customer_name', 'Test Customer');
      console.log('🧹 Test data cleaned up');
    }

    console.log('\n🎉 TESTIMONIALS SYSTEM STATUS:');
    console.log('✅ Table exists and is accessible');
    console.log('✅ Data can be read successfully');
    console.log('✅ Data can be inserted successfully');
    console.log(`✅ ${testimonialsData.length} testimonials in database`);
    
    console.log('\n🔄 Next steps:');
    console.log('1. Refresh your admin panel');
    console.log('2. The testimonials should now be visible');
    console.log('3. You can add, edit, and manage testimonials');

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the check
checkTestimonials().then((success) => {
  if (success) {
    console.log('\n✨ Your testimonials system is working correctly!');
  } else {
    console.log('\n⚠️ Please fix the issues above and try again');
  }
}).catch((error) => {
  console.error('❌ Check failed:', error);
});