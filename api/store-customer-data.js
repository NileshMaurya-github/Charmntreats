// Vercel serverless function for storing customer data permanently in Supabase
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, email, full_name, mobile, signup_date, email_verified, signup_method } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ error: 'Email and full name are required' });
    }

    console.log('📊 Storing customer data permanently:', { email, full_name, mobile });

    // Insert customer data into Supabase
    const { data, error } = await supabase
      .from('customer_data')
      .upsert({
        user_id: user_id,
        email: email,
        full_name: full_name,
        mobile: mobile,
        signup_date: signup_date || new Date().toISOString(),
        email_verified: email_verified || false,
        signup_method: signup_method || 'email_otp',
        login_count: 1
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error storing customer data:', error);
      return res.status(500).json({ error: 'Failed to store customer data' });
    }

    console.log('✅ Customer data stored successfully in Supabase');

    return res.status(200).json({ 
      success: true, 
      message: 'Customer data stored successfully',
      data: data
    });

  } catch (error) {
    console.error('❌ Error in store-customer-data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}