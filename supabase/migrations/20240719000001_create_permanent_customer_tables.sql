-- Create permanent customer tracking tables for marketing and promotional purposes
-- Migration: 20240719000001_create_permanent_customer_tables

-- Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20),
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  signup_method VARCHAR(50) DEFAULT 'email',
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  login_count INTEGER DEFAULT 1,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  preferred_categories TEXT[],
  marketing_consent BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'active',
  source VARCHAR(50) DEFAULT 'website',
  ip_address VARCHAR(45),
  user_agent TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create login_activities table
CREATE TABLE IF NOT EXISTS login_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  login_method VARCHAR(50) DEFAULT 'password',
  success BOOLEAN DEFAULT TRUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info VARCHAR(100),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_status ON customer_profiles(status);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_marketing ON customer_profiles(marketing_consent);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_signup_date ON customer_profiles(signup_date);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_login ON customer_profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_login_activities_email ON login_activities(email);
CREATE INDEX IF NOT EXISTS idx_login_activities_time ON login_activities(login_time);
CREATE INDEX IF NOT EXISTS idx_login_activities_success ON login_activities(success);

-- Set up Row Level Security (RLS)
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_activities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON customer_profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON customer_profiles
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Allow system to insert new profiles
CREATE POLICY IF NOT EXISTS "System can insert profiles" ON customer_profiles
  FOR INSERT WITH CHECK (true);

-- Allow system to insert login activities
CREATE POLICY IF NOT EXISTS "System can insert activities" ON login_activities
  FOR INSERT WITH CHECK (true);

-- Allow admins to view all data
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON customer_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can view all activities" ON login_activities
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON customer_profiles;
CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert comment for documentation
COMMENT ON TABLE customer_profiles IS 'Permanent customer data storage for marketing and promotional purposes';
COMMENT ON TABLE login_activities IS 'Login activity tracking for customer behavior analysis';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON customer_profiles TO authenticated;
GRANT SELECT, INSERT ON login_activities TO authenticated;
GRANT ALL ON customer_profiles TO service_role;
GRANT ALL ON login_activities TO service_role;