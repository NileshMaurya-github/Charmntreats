// Test product update functionality
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductUpdate() {
  console.log('🧪 Testing Product Update Functionality...');

  try {
    // Step 1: Get the most recent product
    console.log('\n1️⃣ Fetching most recent product...');
    
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Failed to fetch products:', fetchError.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found to test update');
      return;
    }

    const testProduct = products[0];
    console.log('📦 Found product to test:');
    console.log(`   - ID: ${testProduct.id}`);
    console.log(`   - Name: ${testProduct.name}`);
    console.log(`   - Price: ₹${testProduct.price}`);
    console.log(`   - Stock: ${testProduct.stock_quantity}`);

    // Step 2: Test update with small change
    console.log('\n2️⃣ Testing product update...');
    
    const originalName = testProduct.name;
    const testName = `${originalName} [TEST UPDATE]`;
    const originalPrice = testProduct.price;
    const testPrice = originalPrice + 1;

    console.log(`🔄 Updating product name: "${originalName}" → "${testName}"`);
    console.log(`🔄 Updating product price: ₹${originalPrice} → ₹${testPrice}`);

    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({
        name: testName,
        price: testPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProduct.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update failed:', updateError.message);
      console.error('❌ Error details:', updateError);
      return;
    }

    console.log('✅ Update successful!');
    console.log(`   - New name: ${updateData.name}`);
    console.log(`   - New price: ₹${updateData.price}`);
    console.log(`   - Updated at: ${updateData.updated_at}`);

    // Step 3: Verify the update
    console.log('\n3️⃣ Verifying update...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('*')
      .eq('id', testProduct.id)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Verification successful:');
      console.log(`   - Current name: ${verifyData.name}`);
      console.log(`   - Current price: ₹${verifyData.price}`);
      
      if (verifyData.name === testName && verifyData.price === testPrice) {
        console.log('🎉 Update was successful and persisted!');
      } else {
        console.log('⚠️ Update may not have been saved properly');
      }
    }

    // Step 4: Restore original values
    console.log('\n4️⃣ Restoring original values...');
    
    const { error: restoreError } = await supabase
      .from('products')
      .update({
        name: originalName,
        price: originalPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProduct.id);

    if (restoreError) {
      console.error('❌ Failed to restore original values:', restoreError.message);
    } else {
      console.log('✅ Original values restored successfully');
    }

    // Step 5: Test permissions
    console.log('\n5️⃣ Testing update permissions...');
    
    const { data: permissionTest, error: permissionError } = await supabase
      .from('products')
      .update({
        description: 'Permission test - ' + new Date().toISOString()
      })
      .eq('id', testProduct.id)
      .select();

    if (permissionError) {
      console.error('❌ Permission error:', permissionError.message);
      console.log('💡 This might be a Row Level Security (RLS) issue');
    } else {
      console.log('✅ Update permissions are working');
    }

    console.log('\n🎉 Product Update Test Completed!');
    console.log('\n📊 Test Results:');
    console.log(`✅ Product fetch: Working`);
    console.log(`${updateError ? '❌' : '✅'} Product update: ${updateError ? 'Failed' : 'Working'}`);
    console.log(`${verifyError ? '❌' : '✅'} Update verification: ${verifyError ? 'Failed' : 'Working'}`);
    console.log(`${restoreError ? '❌' : '✅'} Value restoration: ${restoreError ? 'Failed' : 'Working'}`);
    console.log(`${permissionError ? '❌' : '✅'} Update permissions: ${permissionError ? 'Failed' : 'Working'}`);

    if (updateError || verifyError || permissionError) {
      console.log('\n⚠️ Issues found with product update functionality');
      console.log('💡 Check database permissions and RLS policies');
    } else {
      console.log('\n🎯 Product update functionality is working correctly!');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testProductUpdate();