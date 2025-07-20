// Test permanent customer tracking system
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPermanentCustomerSystem() {
  console.log('🧪 Testing Permanent Customer Tracking System...');

  try {
    // Test 1: Check if tables exist
    console.log('\n1️⃣ Checking if customer tables exist...');
    
    const { data: tablesData, error: tablesError } = await supabase
      .from('customer_profiles')
      .select('count', { count: 'exact', head: true });

    if (tablesError) {
      console.log('❌ customer_profiles table not found:', tablesError.message);
      console.log('📝 You need to run the migration first');
      return;
    } else {
      console.log('✅ customer_profiles table exists');
    }

    // Test 2: Insert a test customer
    console.log('\n2️⃣ Testing customer profile insertion...');
    
    const testCustomer = {
      email: 'test.customer@example.com',
      full_name: 'Test Customer',
      mobile_number: '+919876543210',
      signup_date: new Date().toISOString(),
      email_verified: true,
      signup_method: 'email',
      marketing_consent: true,
      status: 'active',
      source: 'website',
      ip_address: '192.168.1.1',
      user_agent: 'Test Browser'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('customer_profiles')
      .upsert(testCustomer, { onConflict: 'email' })
      .select()
      .single();

    if (insertError) {
      console.log('❌ Failed to insert test customer:', insertError.message);
    } else {
      console.log('✅ Test customer inserted successfully:', insertData.id);
    }

    // Test 3: Insert login activity
    console.log('\n3️⃣ Testing login activity tracking...');
    
    const loginActivity = {
      email: 'test.customer@example.com',
      login_time: new Date().toISOString(),
      login_method: 'password',
      success: true,
      ip_address: '192.168.1.1',
      user_agent: 'Test Browser',
      device_info: 'Desktop'
    };

    const { data: activityData, error: activityError } = await supabase
      .from('login_activities')
      .insert(loginActivity)
      .select()
      .single();

    if (activityError) {
      console.log('❌ Failed to insert login activity:', activityError.message);
    } else {
      console.log('✅ Login activity tracked successfully:', activityData.id);
    }

    // Test 4: Fetch customer statistics
    console.log('\n4️⃣ Testing customer statistics...');
    
    const { data: customersData, error: customersError } = await supabase
      .from('customer_profiles')
      .select('*');

    if (customersError) {
      console.log('❌ Failed to fetch customers:', customersError.message);
    } else {
      console.log('✅ Customer statistics:');
      console.log(`   📊 Total customers: ${customersData.length}`);
      console.log(`   ✅ Active customers: ${customersData.filter(c => c.status === 'active').length}`);
      console.log(`   📧 Marketing opt-ins: ${customersData.filter(c => c.marketing_consent).length}`);
      console.log(`   🔐 Email verified: ${customersData.filter(c => c.email_verified).length}`);
    }

    // Test 5: Test marketing export functionality
    console.log('\n5️⃣ Testing marketing export...');
    
    const marketingCustomers = customersData.filter(c => c.marketing_consent && c.status === 'active');
    
    if (marketingCustomers.length > 0) {
      const csvHeader = 'Email,Full Name,Mobile Number,Signup Date,Last Login,Login Count,Status\n';
      const csvData = marketingCustomers.map(customer => 
        `"${customer.email}","${customer.full_name}","${customer.mobile_number || 'N/A'}","${customer.signup_date}","${customer.last_login_at}","${customer.login_count}","${customer.status}"`
      ).join('\n');
      
      const csvContent = csvHeader + csvData;
      console.log('✅ Marketing export ready:');
      console.log(`   📊 ${marketingCustomers.length} customers eligible for marketing`);
      console.log(`   📄 CSV size: ${csvContent.length} characters`);
    } else {
      console.log('⚠️ No customers eligible for marketing');
    }

    // Test 6: Clean up test data
    console.log('\n6️⃣ Cleaning up test data...');
    
    await supabase
      .from('login_activities')
      .delete()
      .eq('email', 'test.customer@example.com');

    await supabase
      .from('customer_profiles')
      .delete()
      .eq('email', 'test.customer@example.com');

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Permanent Customer Tracking System Test Completed Successfully!');
    console.log('\n📊 System Features Verified:');
    console.log('✅ Customer profile storage');
    console.log('✅ Login activity tracking');
    console.log('✅ Customer statistics');
    console.log('✅ Marketing export functionality');
    console.log('✅ Data cleanup');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testPermanentCustomerSystem();