const { createClient } = require('@supabase/supabase-js');

// Use actual Supabase values
const supabaseUrl = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testOrdersSystem() {
  try {
    console.log('🚀 Testing orders system...');

    // Test by inserting a sample order directly
    console.log('Testing orders table...');
    const testOrderId = 'TEST' + Date.now();
    
    const { data, error: insertError } = await supabase
      .from('orders')
      .insert([
        {
          order_id: testOrderId,
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '9876543210',
          delivery_address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          subtotal: 500,
          shipping_cost: 0,
          total_amount: 500,
          payment_method: 'cod',
          order_date: new Date().toISOString()
        }
      ])
      .select();

    if (insertError) {
      console.log('❌ Orders table test failed:', insertError.message);
      console.log('This means the orders table doesn\'t exist yet.');
      
      // Let's check what tables exist
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (!tablesError) {
        console.log('📋 Existing tables:', tables.map(t => t.table_name));
      }
      
    } else {
      console.log('✅ Orders table works! Sample order created:', data);
      
      // Test order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: testOrderId,
            product_id: 'test-product',
            product_name: 'Test Product',
            product_category: 'Test Category',
            catalog_number: 'TEST001',
            quantity: 1,
            unit_price: 500,
            total_price: 500,
            product_image: 'test-image.jpg'
          }
        ]);

      if (itemsError) {
        console.log('❌ Order items table test failed:', itemsError.message);
      } else {
        console.log('✅ Order items table works!');
      }
      
      // Clean up test data
      await supabase.from('order_items').delete().eq('order_id', testOrderId);
      await supabase.from('orders').delete().eq('order_id', testOrderId);
      console.log('🧹 Test data cleaned up');
    }

    console.log('🎉 Orders system test complete!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testOrdersSystem();