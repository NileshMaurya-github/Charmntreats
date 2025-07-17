import { supabase } from '../src/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

async function syncProducts() {
  try {
    console.log('Node.js version:', process.version);
    console.log('Platform:', process.platform);
    const productsPath = path.resolve(__dirname, '../src/data/products.json');
    console.log('Reading products from:', productsPath);
    const fileContent = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(fileContent);
    console.log('Loaded products:', products);
    for (const product of products) {
      // Map local keys to Supabase schema
      const dbProduct = {
        catalog_number: product.catalog_number,
        category: product.category,
        name: product.name,
        price: product.price
      };
      console.log('Upserting product:', dbProduct);
      try {
        const { data, error } = await supabase
          .from('products')
          .upsert([dbProduct], { onConflict: 'id' });
        if (error) {
          console.error(`Failed to sync product ${product.name}:`, error);
          console.error('Error type:', typeof error);
          console.error('Error keys:', error && Object.keys(error));
          console.error('Error value:', JSON.stringify(error, null, 2));
        } else {
          console.log(`Synced product: ${product.name}`);
          console.log('Supabase response data:', data);
        }
      } catch (upsertErr) {
        console.error('Upsert threw an error:', upsertErr);
        console.error('Upsert error type:', typeof upsertErr);
        console.error('Upsert error keys:', upsertErr && Object.keys(upsertErr));
        console.error('Upsert error value:', JSON.stringify(upsertErr, null, 2));
      }
    }
    console.log('Sync complete.');
  } catch (err) {
    console.error('Sync failed:', err);
    console.error('Error type:', typeof err);
    console.error('Error keys:', err && Object.keys(err));
    console.error('Error value:', JSON.stringify(err, null, 2));
    if (err && err.stack) {
      console.error('Stack trace:', err.stack);
    }
  }
}

syncProducts().catch(e => {
  console.error('Uncaught error in syncProducts:', e);
  console.error('Error type:', typeof e);
  console.error('Error keys:', e && Object.keys(e));
  console.error('Error value:', JSON.stringify(e, null, 2));
  if (e && e.stack) {
    console.error('Stack trace:', e.stack);
  }
});
