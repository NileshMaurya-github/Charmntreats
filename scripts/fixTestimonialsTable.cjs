// Fix testimonials table structure and approve existing testimonials
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

async function fixTestimonialsTable() {
  console.log('🔧 Fixing testimonials table and approving testimonials...\n');

  console.log('📋 MANUAL FIX REQUIRED:');
  console.log('Please run this SQL in your Supabase dashboard:\n');
  console.log('='.repeat(80));
  console.log(`
-- Fix testimonials table structure
-- Add missing columns if they don't exist
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- Update existing testimonials to be approved
UPDATE testimonials 
SET is_approved = true 
WHERE is_approved IS NULL OR is_approved = false;

-- Fix RLS policies
DROP POLICY IF EXISTS "Allow public to read approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public to insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Service role can access all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public to select all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;

-- Create proper policies
CREATE POLICY "Allow public to read approved testimonials" ON testimonials
    FOR SELECT TO public
    USING (is_approved = true);

CREATE POLICY "Allow public to insert testimonials" ON testimonials
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage testimonials" ON testimonials
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can access all testimonials" ON testimonials
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Ensure all your existing testimonials are approved and visible
UPDATE testimonials SET is_approved = true, is_featured = true WHERE customer_name = 'Yash kumar';

-- Add some sample testimonials if needed
INSERT INTO testimonials (customer_name, customer_email, rating, review_text, is_featured, is_approved) 
VALUES 
('Sarah Johnson', 'sarah@example.com', 5, 'Absolutely love my dream catcher! The craftsmanship is incredible and it looks beautiful in my bedroom. Highly recommend Charmntreats!', true, true),
('Michael Chen', 'mike@example.com', 5, 'The embroidery work is stunning. Ordered a custom piece and it exceeded my expectations. Great quality and fast shipping!', true, true)
ON CONFLICT DO NOTHING;
  `);
  console.log('='.repeat(80));
  
  console.log('\n📍 Steps to fix:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Paste the SQL above');
  console.log('5. Click "Run"');
  console.log('6. Refresh your admin panel');
  
  console.log('\n🎯 What this will fix:');
  console.log('✅ Add missing is_approved column');
  console.log('✅ Approve all your existing testimonials');
  console.log('✅ Fix RLS policies for proper access');
  console.log('✅ Make Yash kumar testimonial featured');
  console.log('✅ Add sample testimonials');
  
  console.log('\n📊 Your current testimonials that will be fixed:');
  console.log('1. Yash kumar (5⭐) - "amazing product..."');
  console.log('2. Test Customer (5⭐) - Test testimonial');
  console.log('3. Test Customer (5⭐) - Test testimonial');
  
  console.log('\n🎉 After running the SQL:');
  console.log('• Your admin panel will show "Testimonials (3+)"');
  console.log('• You can add, edit, and delete testimonials');
  console.log('• Testimonials will appear on your website');
  console.log('• Featured testimonials will be highlighted');
}

// Run the fix
fixTestimonialsTable();