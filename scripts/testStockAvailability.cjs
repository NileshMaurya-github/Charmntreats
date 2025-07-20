// Test stock availability logic
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if product is actually in stock (same logic as frontend)
function isProductInStock(product) {
  if (!product) return false;
  // Check both in_stock flag and stock_quantity
  return product.in_stock && (product.stock_quantity === null || product.stock_quantity === undefined || product.stock_quantity > 0);
}

async function testStockAvailability() {
  console.log('🧪 Testing Stock Availability Logic...');

  try {
    // Test 1: Fetch all products and check stock logic
    console.log('\n1️⃣ Fetching all products to test stock logic...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch products:', error.message);
      return;
    }

    console.log(`📊 Total products found: ${products.length}`);

    // Analyze stock status
    let inStockCount = 0;
    let outOfStockCount = 0;
    let zeroStockCount = 0;
    let nullStockCount = 0;

    console.log('\n📦 Product Stock Analysis:');
    products.forEach((product, index) => {
      const actuallyInStock = isProductInStock(product);
      const stockInfo = product.stock_quantity !== null && product.stock_quantity !== undefined 
        ? `${product.stock_quantity} units` 
        : 'unlimited';
      
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      - in_stock flag: ${product.in_stock}`);
      console.log(`      - stock_quantity: ${stockInfo}`);
      console.log(`      - Actually in stock: ${actuallyInStock ? '✅ YES' : '❌ NO'}`);
      
      if (actuallyInStock) {
        inStockCount++;
      } else {
        outOfStockCount++;
      }
      
      if (product.stock_quantity === 0) {
        zeroStockCount++;
      }
      
      if (product.stock_quantity === null || product.stock_quantity === undefined) {
        nullStockCount++;
      }
      
      console.log(''); // Empty line for readability
    });

    // Test 2: Summary statistics
    console.log('\n2️⃣ Stock Summary Statistics:');
    console.log(`   ✅ Actually in stock: ${inStockCount}`);
    console.log(`   ❌ Actually out of stock: ${outOfStockCount}`);
    console.log(`   🔢 Products with 0 stock: ${zeroStockCount}`);
    console.log(`   ∞ Products with unlimited stock: ${nullStockCount}`);

    // Test 3: Check for problematic products (in_stock=true but stock_quantity=0)
    console.log('\n3️⃣ Checking for problematic products...');
    const problematicProducts = products.filter(p => 
      p.in_stock === true && p.stock_quantity === 0
    );

    if (problematicProducts.length > 0) {
      console.log(`⚠️ Found ${problematicProducts.length} problematic products:`);
      problematicProducts.forEach(product => {
        console.log(`   - ${product.name} (ID: ${product.id})`);
        console.log(`     in_stock: ${product.in_stock}, stock_quantity: ${product.stock_quantity}`);
      });
      console.log('\n💡 These products show "In Stock" but have 0 quantity!');
    } else {
      console.log('✅ No problematic products found');
    }

    // Test 4: Test the featured products query logic
    console.log('\n4️⃣ Testing featured products query...');
    
    const { data: featuredData, error: featuredError } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(6);

    if (featuredError) {
      console.error('❌ Featured products query failed:', featuredError.message);
    } else {
      // Filter out products with 0 stock quantity (same as frontend logic)
      const actuallyAvailableFeatured = featuredData.filter(product => 
        product.stock_quantity === null || 
        product.stock_quantity === undefined || 
        product.stock_quantity > 0
      );

      console.log(`📊 Featured products query results:`);
      console.log(`   - Raw featured products: ${featuredData.length}`);
      console.log(`   - Actually available featured: ${actuallyAvailableFeatured.length}`);
      
      if (featuredData.length !== actuallyAvailableFeatured.length) {
        console.log(`⚠️ ${featuredData.length - actuallyAvailableFeatured.length} featured products are out of stock`);
      }
    }

    console.log('\n🎉 Stock Availability Test Completed!');
    console.log('\n📋 Test Results Summary:');
    console.log(`✅ Total products: ${products.length}`);
    console.log(`✅ Actually in stock: ${inStockCount}`);
    console.log(`❌ Actually out of stock: ${outOfStockCount}`);
    console.log(`⚠️ Problematic products: ${problematicProducts.length}`);

    if (problematicProducts.length === 0) {
      console.log('\n🎯 Stock logic is working correctly!');
    } else {
      console.log('\n⚠️ Some products need attention - they show as in stock but have 0 quantity');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testStockAvailability();