// Plain JavaScript version for Node.js v22+ compatibility
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const SUPABASE_URL = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function syncProducts() {
  try {
    const productsPath = path.resolve(__dirname, '../src/data/products.json');
    console.log('Reading products from:', productsPath);
    const fileContent = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(fileContent);
    console.log('Loaded products:', products);
    for (const product of products) {
      // Ensure UUID for id
      const id = (product.id && /^[0-9a-fA-F-]{36}$/.test(product.id)) ? product.id : randomUUID();
      const dbProduct = {
        id,
        name: product.name,
        description: product.description ?? null,
        price: product.price,
        category: product.category,
        images: Array.isArray(product.images) ? product.images : null,
        catalog_number: product.catalog_number,
        in_stock: typeof product.in_stock === 'boolean' ? product.in_stock : null,
        stock_quantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : null,
        featured: typeof product.featured === 'boolean' ? product.featured : null,
        rating: typeof product.rating === 'number' ? product.rating : null,
        reviews: typeof product.reviews === 'number' ? product.reviews : null
      };
      console.log('Upserting product:', dbProduct);
      const { data, error } = await supabase
        .from('products')
        .upsert([dbProduct], { onConflict: 'id' });
      if (error) {
        console.error(`Failed to sync product ${product.name}:`, error);
      } else {
        console.log(`Synced product: ${product.name}`);
        console.log('Supabase response data:', data);
      }
    }
    console.log('Sync complete.');
  } catch (err) {
    console.error('Sync failed:', err);
    if (err && err.stack) {
      console.error('Stack trace:', err.stack);
    }
  }
}

syncProducts();
