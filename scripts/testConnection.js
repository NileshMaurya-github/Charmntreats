const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by fetching existing products
    const { data, error } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      return false;
    }
    
    console.log('✓ Connection successful!');
    console.log('Current products count:', data);
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

testConnection();