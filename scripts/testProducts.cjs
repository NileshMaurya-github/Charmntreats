const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testProducts() {
  console.log('Testing product database connection...');
  
  try {
    // Test basic connection
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (allError) {
      console.error('Error fetching all products:', allError);
      return;
    }
    
    console.log(`✓ Found ${allProducts?.length || 0} products in database`);
    
    if (allProducts && allProducts.length > 0) {
      console.log('Sample product:', allProducts[0]);
    }
    
    // Test featured products
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(5);
    
    if (featuredError) {
      console.error('Error fetching featured products:', featuredError);
      return;
    }
    
    console.log(`✓ Found ${featuredProducts?.length || 0} featured products`);
    
    // Test in-stock products
    const { data: inStockProducts, error: stockError } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .limit(5);
    
    if (stockError) {
      console.error('Error fetching in-stock products:', stockError);
      return;
    }
    
    console.log(`✓ Found ${inStockProducts?.length || 0} in-stock products`);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testProducts();