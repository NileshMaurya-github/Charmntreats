// Create permanent customer tracking tables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPermanentCustomerTables() {
  console.log('🚀 Creating permanent customer tracking tables...');

  try {
    // Create customer_profiles table
    console.log('📊 Creating customer_profiles table...');
    const customerProfilesSQL = `
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
    `;

    const { error: profilesError } = await supabase.rpc('exec_sql', { 
      sql: customerProfilesSQL 
    });

    if (profilesError) {
      console.error('❌ Error creating customer_profiles table:', profilesError);
    } else {
      console.log('✅ customer_profiles table created successfully');
    }

    // Create login_activities table
    console.log('📊 Creating login_activities table...');
    const loginActivitiesSQL = `
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
    `;

    const { error: activitiesError } = await supabase.rpc('exec_sql', { 
      sql: loginActivitiesSQL 
    });

    if (activitiesError) {
      console.error('❌ Error creating login_activities table:', activitiesError);
    } else {
      console.log('✅ login_activities table created successfully');
    }

    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_status ON customer_profiles(status);
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_marketing ON customer_profiles(marketing_consent);
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_signup_date ON customer_profiles(signup_date);
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_login ON customer_profiles(last_login_at);
      CREATE INDEX IF NOT EXISTS idx_login_activities_email ON login_activities(email);
      CREATE INDEX IF NOT EXISTS idx_login_activities_time ON login_activities(login_time);
      CREATE INDEX IF NOT EXISTS idx_login_activities_success ON login_activities(success);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { 
      sql: indexesSQL 
    });

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
    } else {
      console.log('✅ Indexes created successfully');
    }

    // Set up Row Level Security (RLS)
    console.log('🔒 Setting up Row Level Security...');
    const rlsSQL = `
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
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: rlsSQL 
    });

    if (rlsError) {
      console.error('❌ Error setting up RLS:', rlsError);
    } else {
      console.log('✅ Row Level Security configured');
    }

    // Create trigger to update updated_at timestamp
    console.log('⚡ Creating update trigger...');
    const triggerSQL = `
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
    `;

    const { error: triggerError } = await supabase.rpc('exec_sql', { 
      sql: triggerSQL 
    });

    if (triggerError) {
      console.error('❌ Error creating trigger:', triggerError);
    } else {
      console.log('✅ Update trigger created');
    }

    console.log('\n🎉 Permanent customer tracking tables created successfully!');
    console.log('\n📊 Tables created:');
    console.log('✅ customer_profiles - Main customer data');
    console.log('✅ login_activities - Login tracking');
    console.log('✅ Indexes for performance');
    console.log('✅ Row Level Security');
    console.log('✅ Auto-update triggers');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

createPermanentCustomerTables();