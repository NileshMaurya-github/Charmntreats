const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testCategoryData() {
  console.log('🧪 Testing category data fetch...\n');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category, images, name')
      .eq('in_stock', true);

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    console.log(`✅ Found ${products?.length || 0} products in stock\n`);

    // Group products by category
    const categoryMap = new Map();

    products?.forEach((product) => {
      const category = product.category;
      const productImages = product.images || [];
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, images: [], products: [] });
      }
      
      const categoryData = categoryMap.get(category);
      categoryData.count += 1;
      categoryData.products.push(product.name);
      
      // Add product images to category images (avoid duplicates)
      productImages.forEach((image) => {
        if (!categoryData.images.includes(image)) {
          categoryData.images.push(image);
        }
      });
    });

    console.log('📊 Category breakdown:');
    console.log('='.repeat(50));
    
    for (const [categoryName, data] of categoryMap.entries()) {
      console.log(`\n🏷️  ${categoryName}`);
      console.log(`   📦 Products: ${data.count}`);
      console.log(`   🖼️  Images: ${data.images.length}`);
      console.log(`   📝 Product names: ${data.products.join(', ')}`);
      if (data.images.length > 0) {
        console.log(`   🔗 First image: ${data.images[0].substring(0, 60)}...`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Total categories with products: ${categoryMap.size}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCategoryData();