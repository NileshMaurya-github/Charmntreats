// Check products table schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhgfnmcpqtjdcjqvkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhnZm5tY3BxdGpkY2pxdmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI4NzQsImV4cCI6MjA0NzQwODg3NH0.TJmFBqJhZBZDvlQJGKKzKvOLrjqYpOJvOqOJvOqOJvO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsTableSchema() {
  console.log('🔍 Checking Products Table Schema...');

  try {
    // Get one product to see all available columns
    console.log('\n1️⃣ Fetching sample product to check columns...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Failed to fetch products:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found in table');
      return;
    }

    const sampleProduct = products[0];
    console.log('✅ Sample product fetched successfully');
    
    console.log('\n2️⃣ Available columns in products table:');
    const columns = Object.keys(sampleProduct);
    columns.forEach((column, index) => {
      const value = sampleProduct[column];
      const type = typeof value;
      console.log(`   ${index + 1}. ${column} (${type}): ${JSON.stringify(value)}`);
    });

    console.log('\n3️⃣ Column Analysis:');
    console.log(`   📊 Total columns: ${columns.length}`);
    
    // Check for timestamp columns
    const timestampColumns = columns.filter(col => 
      col.includes('_at') || col.includes('date') || col.includes('time')
    );
    
    if (timestampColumns.length > 0) {
      console.log(`   ⏰ Timestamp columns: ${timestampColumns.join(', ')}`);
    } else {
      console.log('   ⏰ No timestamp columns found');
    }

    // Check if updated_at exists
    if (columns.includes('updated_at')) {
      console.log('   ✅ updated_at column exists');
    } else {
      console.log('   ❌ updated_at column does NOT exist');
      console.log('   💡 This explains the update error!');
    }

    // Check if created_at exists
    if (columns.includes('created_at')) {
      console.log('   ✅ created_at column exists');
    } else {
      console.log('   ❌ created_at column does NOT exist');
    }

    console.log('\n4️⃣ Required columns for update:');
    const requiredColumns = [
      'id', 'name', 'description', 'price', 'category', 
      'catalog_number', 'images', 'in_stock', 'featured', 
      'rating', 'reviews', 'stock_quantity'
    ];

    requiredColumns.forEach(col => {
      if (columns.includes(col)) {
        console.log(`   ✅ ${col} - exists`);
      } else {
        console.log(`   ❌ ${col} - missing`);
      }
    });

    console.log('\n🎉 Products Table Schema Check Completed!');
    
    if (!columns.includes('updated_at')) {
      console.log('\n💡 Solution: Remove updated_at from update queries');
      console.log('   The products table uses created_at for timestamps');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

checkProductsTableSchema();