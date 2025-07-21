const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixmjkqjzqzqzqzqzqzqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bWprcWp6cXpxenF6cXpxenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NTI4NzEsImV4cCI6MjA0NzQyODg3MX0.example';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUserAddressesTable() {
  try {
    console.log('Creating user_addresses table...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create user_addresses table
        CREATE TABLE IF NOT EXISTS user_addresses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL DEFAULT 'Home',
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          pincode VARCHAR(20) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(user_id, is_default);

        -- Enable RLS
        ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view their own addresses" ON user_addresses
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own addresses" ON user_addresses
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own addresses" ON user_addresses
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own addresses" ON user_addresses
          FOR DELETE USING (auth.uid() = user_id);

        -- Create trigger for updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_user_addresses_updated_at 
          BEFORE UPDATE ON user_addresses 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (error) {
      console.error('Error creating user_addresses table:', error);
      return;
    }

    console.log('✅ user_addresses table created successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createUserAddressesTable();