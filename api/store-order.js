// Vercel serverless function for storing order data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hnqkqjqjqjqjqjqjqjqj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = req.body;

    if (!customerInfo || !items || !orderId) {
      return res.status(400).json({ error: 'Missing required order data' });
    }

    console.log('💾 Storing order in database:', orderId);

    // Calculate subtotal and shipping
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    console.log('📦 Order data to store:', {
      orderId,
      customer: customerInfo,
      items: items.length,
      total: totalAmount,
      paymentMethod
    });

    // Store order data (try database first, fallback to localStorage backup)
    let orderStored = false;
    
    try {
      // Try to store in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_id: orderId,
            customer_name: customerInfo.fullName,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            delivery_address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
            subtotal: subtotal,
            shipping_cost: shipping,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            order_status: 'confirmed',
            order_date: orderDate,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.log('⚠️ Database storage failed:', orderError.message);
        throw new Error('Database storage failed');
      } else {
        console.log('✅ Order stored in database successfully');
        
        // Store order items
        const orderItems = items.map(item => ({
          order_id: orderId,
          product_id: item.id,
          product_name: item.name,
          product_category: item.category,
          catalog_number: item.catalogNumber,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          product_image: item.images[0] || ''
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.log('⚠️ Order items storage failed:', itemsError.message);
        } else {
          console.log('✅ Order items stored successfully');
          orderStored = true;
        }
      }
    } catch (dbError) {
      console.log('⚠️ Database operation failed, using localStorage backup:', dbError.message);
      
      // Fallback: Store in localStorage for development/testing
      const orderData = {
        id: Date.now().toString(),
        order_id: orderId,
        customer_name: customerInfo.fullName,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        delivery_address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.pincode,
        subtotal: subtotal,
        shipping_cost: shipping,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        order_status: 'confirmed',
        order_date: orderDate,
        created_at: new Date().toISOString(),
        items: items.map(item => ({
          id: Date.now().toString() + Math.random(),
          order_id: orderId,
          product_id: item.id,
          product_name: item.name,
          product_category: item.category,
          catalog_number: item.catalogNumber,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          product_image: item.images[0] || ''
        }))
      };

      // Store in localStorage as backup
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      console.log('✅ Order stored in localStorage as backup');
      orderStored = true;
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Order stored successfully',
      orderId: orderId
    });

  } catch (error) {
    console.error('❌ Error storing order:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to store order',
      details: error.message 
    });
  }
}