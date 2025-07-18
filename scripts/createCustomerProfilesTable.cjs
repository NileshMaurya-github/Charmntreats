// Create customer profiles table for tracking all logged-in users
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

async function createCustomerProfilesTable() {
  console.log('🚀 Creating customer profiles table for user tracking...\n');

  console.log('📋 MANUAL TABLE CREATION REQUIRED:');
  console.log('Please run this SQL in your Supabase dashboard:\n');
  console.log('='.repeat(80));
  console.log(`
-- Create customer_profiles table for tracking all logged-in users
CREATE TABLE IF NOT EXISTS customer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    address TEXT,
    login_count INTEGER DEFAULT 1,
    first_login_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_login ON customer_profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_created_at ON customer_profiles(created_at);

-- Enable RLS
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON customer_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON customer_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public to insert profiles" ON customer_profiles
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Service role can access all profiles" ON customer_profiles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_profiles_updated_at 
    BEFORE UPDATE ON customer_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user login tracking
CREATE OR REPLACE FUNCTION handle_user_login(user_email TEXT, user_name TEXT DEFAULT NULL)
RETURNS void AS $$
BEGIN
    INSERT INTO customer_profiles (email, full_name, user_id)
    VALUES (user_email, user_name, auth.uid())
    ON CONFLICT (email) 
    DO UPDATE SET 
        login_count = customer_profiles.login_count + 1,
        last_login_at = NOW(),
        full_name = COALESCE(EXCLUDED.full_name, customer_profiles.full_name);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Insert some sample customer data
INSERT INTO customer_profiles (email, full_name, phone, city, state, login_count, first_login_at, last_login_at) VALUES
('john.doe@example.com', 'John Doe', '9876543210', 'Mumbai', 'Maharashtra', 5, NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 days'),
('sarah.johnson@example.com', 'Sarah Johnson', '9876543211', 'Delhi', 'Delhi', 3, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
('mike.chen@example.com', 'Mike Chen', '9876543212', 'Bangalore', 'Karnataka', 8, NOW() - INTERVAL '45 days', NOW() - INTERVAL '3 hours'),
('emily.rodriguez@example.com', 'Emily Rodriguez', '9876543213', 'Chennai', 'Tamil Nadu', 2, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 hours'),
('david.wilson@example.com', 'David Wilson', '9876543214', 'Pune', 'Maharashtra', 12, NOW() - INTERVAL '60 days', NOW() - INTERVAL '1 hour')
ON CONFLICT (email) DO NOTHING;
  `);
  console.log('='.repeat(80));
  
  console.log('\n📍 Steps to create customer profiles table:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Paste the SQL above');
  console.log('5. Click "Run"');
  console.log('6. Refresh your admin panel');
  
  console.log('\n🎯 What this creates:');
  console.log('✅ Customer profiles table with login tracking');
  console.log('✅ Automatic login count and timestamp tracking');
  console.log('✅ User profile information storage');
  console.log('✅ Sample customer data for testing');
  console.log('✅ Proper security policies');
  
  console.log('\n📊 Features included:');
  console.log('• Email and name tracking');
  console.log('• Phone and address storage');
  console.log('• Login count and timestamps');
  console.log('• First login and last login tracking');
  console.log('• Active user status');
  console.log('• Automatic profile updates on login');
  
  console.log('\n🔧 Integration with your app:');
  console.log('• Admin dashboard will show total customers');
  console.log('• Customer details with login history');
  console.log('• Permanent storage of all user data');
  console.log('• Real-time customer tracking');
}

// Run the function
createCustomerProfilesTable();