// Create testimonials table in Supabase
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

async function createTestimonialsTable() {
  console.log('🚀 Creating testimonials table...\n');

  try {
    // First, let's check if the table exists
    console.log('1️⃣ Checking if testimonials table exists...');
    
    const { data: existingData, error: checkError } = await supabase
      .from('testimonials')
      .select('count(*)')
      .limit(1);

    if (checkError && checkError.message.includes('does not exist')) {
      console.log('❌ Testimonials table does not exist');
      console.log('\n🔧 MANUAL TABLE CREATION REQUIRED:');
      console.log('Please go to your Supabase dashboard and run this SQL:');
      console.log('\n' + '='.repeat(80));
      console.log(`
-- Create testimonials table
CREATE TABLE testimonials (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to read approved testimonials" ON testimonials
    FOR SELECT TO public
    USING (is_approved = true);

CREATE POLICY "Allow public to insert testimonials" ON testimonials
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Service role can access all testimonials" ON testimonials
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

CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_email, rating, review_text, is_featured, is_approved) VALUES
('Sarah Johnson', 'sarah.j@example.com', 5, 'Absolutely love my dream catcher! The craftsmanship is incredible and it looks beautiful in my bedroom. Highly recommend Charmntreats!', true, true),
('Michael Chen', 'mike.chen@example.com', 5, 'The embroidery work is stunning. Ordered a custom piece and it exceeded my expectations. Great quality and fast shipping!', true, true),
('Emily Rodriguez', 'emily.r@example.com', 4, 'Beautiful handcrafted items. The attention to detail is amazing. Will definitely order again!', false, true);
      `);
      console.log('='.repeat(80));
      console.log('\n📍 Steps to create testimonials table:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Paste the SQL above');
      console.log('5. Click "Run"');
      console.log('6. Refresh your admin panel');
      
      return false;
    } else if (!checkError) {
      console.log('✅ Testimonials table already exists');
      
      // Check how many testimonials we have
      const { data: testimonialsData, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.log('❌ Error fetching testimonials:', fetchError.message);
        return false;
      }

      console.log(`📊 Found ${testimonialsData.length} testimonials in database:`);
      testimonialsData.forEach((testimonial, index) => {
        console.log(`   ${index + 1}. ${testimonial.customer_name} - ${testimonial.rating}⭐ - ${testimonial.is_featured ? 'Featured' : 'Regular'}`);
        console.log(`      "${testimonial.review_text.substring(0, 60)}..."`);
      });

      return true;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run the function
createTestimonialsTable().then((success) => {
  if (success) {
    console.log('\n🎉 Testimonials system is working!');
    console.log('✅ Your admin panel should now show the testimonials');
  } else {
    console.log('\n⚠️ Please create the testimonials table manually using the SQL above');
  }
}).catch((error) => {
  console.error('❌ Script failed:', error);
});