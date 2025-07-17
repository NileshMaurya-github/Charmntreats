// Script to create missing database tables for admin dashboard
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createMissingTables() {
  console.log('🔧 Creating Missing Database Tables...\n');

  // Note: Since we can't run DDL statements with the anon key,
  // we'll provide SQL commands that need to be run in the Supabase SQL editor

  const sqlCommands = [
    {
      name: 'testimonials',
      sql: `
-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    rating DECIMAL(3,2) NOT NULL,
    review_text TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view testimonials" ON testimonials
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );
      `
    },
    {
      name: 'homepage_content',
      sql: `
-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view homepage content" ON homepage_content
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage homepage content" ON homepage_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );
      `
    },
    {
      name: 'orders',
      sql: `
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    order_items JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );
      `
    },
    {
      name: 'customer_data',
      sql: `
-- Create customer_data table
CREATE TABLE IF NOT EXISTS customer_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT,
    signup_date TIMESTAMPTZ DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    signup_method TEXT DEFAULT 'email',
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own customer data" ON customer_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer data" ON customer_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data" ON customer_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all customer data" ON customer_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );
      `
    }
  ];

  console.log('📋 SQL Commands to Run in Supabase SQL Editor:');
  console.log('==============================================\n');

  sqlCommands.forEach((command, index) => {
    console.log(`${index + 1}. ${command.name.toUpperCase()} TABLE:`);
    console.log('```sql');
    console.log(command.sql.trim());
    console.log('```\n');
  });

  console.log('🔧 Instructions:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste each SQL command above');
  console.log('4. Run each command one by one');
  console.log('5. Verify tables are created successfully\n');

  console.log('⚠️  Note: These tables need to be created manually in Supabase');
  console.log('   because we cannot run DDL statements with the anon key.\n');

  // Test if we can at least check table existence
  const tables = ['testimonials', 'homepage_content', 'orders', 'customer_data'];
  
  console.log('🧪 Testing Table Accessibility:');
  console.log('===============================');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists and is accessible`);
      }
    } catch (error) {
      console.log(`💥 ${table}: Unexpected error - ${error.message}`);
    }
  }

  console.log('\n🎯 After creating the tables, run this command to test:');
  console.log('   node scripts/testAdminFunctionality.cjs');
}

// Run the script
createMissingTables()
  .then(() => {
    console.log('\n✅ Script completed!');
  })
  .catch(error => {
    console.error('💥 Error:', error);
  });