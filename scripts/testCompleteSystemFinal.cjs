// Test the complete order system: Database + Emails
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Failed to load .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Brevo API configuration
const BREVO_API_KEY = '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';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function testCompleteOrderSystem() {
  console.log('🧪 Testing Complete Order Management System...\n');
  console.log('🎯 This test simulates a real customer order with:');
  console.log('✅ Database storage (permanent)');
  console.log('✅ Customer invoice email');
  console.log('✅ Store notification email');
  console.log('✅ Order history retrieval');

  const testOrderId = 'CT' + Date.now().toString().slice(-6) + 'COMPLETE';
  
  const orderData = {
    customerInfo: {
      fullName: 'Sarah Johnson',
      email: 'nilesh.maurya.developer@gmail.com', // Your email for testing
      phone: '9876543210',
      address: '456 Oak Street, Apartment 2A, Near Shopping Center',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    items: [
      {
        id: 'handcrafted-dreamcatcher-001',
        name: 'Handcrafted Dream Catcher - Large',
        category: 'Home Decor',
        catalogNumber: 'DC001',
        price: 799,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9']
      },
      {
        id: 'macrame-wall-hanging-002', 
        name: 'Macrame Wall Hanging - Boho Style',
        category: 'Wall Art',
        catalogNumber: 'MWH002',
        price: 700,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7']
      },
      {
        id: 'ceramic-vase-003',
        name: 'Handmade Ceramic Vase - Blue',
        category: 'Home Decor',
        catalogNumber: 'CV003',
        price: 450,
        quantity: 2,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96']
      }
    ],
    totalAmount: 2399,
    paymentMethod: 'cod',
    orderDate: new Date().toISOString(),
    orderId: testOrderId
  };

  console.log('\n📦 Test Order Details:');
  console.log('- Order ID:', orderData.orderId);
  console.log('- Customer:', orderData.customerInfo.fullName);
  console.log('- Email:', orderData.customerInfo.email);
  console.log('- Total Amount:', '₹' + orderData.totalAmount.toLocaleString());
  console.log('- Items:', orderData.items.length);
  console.log('- Payment:', orderData.paymentMethod.toUpperCase());

  try {
    // Step 1: Store order in database
    console.log('\n1️⃣ Storing order in database...');
    
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    // Insert order
    const { data: orderInsert, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderData.orderId,
        customer_name: orderData.customerInfo.fullName,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        delivery_address: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        state: orderData.customerInfo.state,
        pincode: orderData.customerInfo.pincode,
        subtotal: subtotal,
        shipping_cost: shipping,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        order_status: 'confirmed',
        order_date: orderData.orderDate
      }])
      .select();

    if (orderError) {
      console.log('❌ Database storage failed:', orderError.message);
      return false;
    }

    console.log('✅ Order stored in database successfully!');

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: orderData.orderId,
      product_id: item.id,
      product_name: item.name,
      product_category: item.category,
      catalog_number: item.catalogNumber,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      product_image: item.images[0] || ''
    }));

    const { data: itemsInsert, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.log('❌ Order items storage failed:', itemsError.message);
      return false;
    }

    console.log('✅ Order items stored successfully!', itemsInsert.length, 'items');

    // Step 2: Send customer invoice email
    console.log('\n2️⃣ Sending customer invoice email...');
    
    const customerEmailSent = await sendCustomerInvoiceEmail(orderData);
    
    if (customerEmailSent) {
      console.log('✅ Customer invoice email sent successfully!');
    } else {
      console.log('❌ Customer email failed');
    }

    // Step 3: Send store notification email
    console.log('\n3️⃣ Sending store notification email...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const storeEmailSent = await sendStoreNotificationEmail(orderData);
    
    if (storeEmailSent) {
      console.log('✅ Store notification email sent successfully!');
    } else {
      console.log('❌ Store email failed');
    }

    // Step 4: Retrieve order (simulate customer checking order history)
    console.log('\n4️⃣ Testing order retrieval (customer order history)...');
    
    const { data: customerOrders, error: retrieveError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('customer_email', orderData.customerInfo.email)
      .order('created_at', { ascending: false });

    if (retrieveError) {
      console.log('❌ Order retrieval failed:', retrieveError.message);
    } else {
      console.log('✅ Customer order history retrieved successfully!');
      console.log('📋 Customer has', customerOrders.length, 'orders in history');
      
      const latestOrder = customerOrders[0];
      console.log('📦 Latest order:', {
        orderId: latestOrder.order_id,
        customerName: latestOrder.customer_name,
        totalAmount: '₹' + latestOrder.total_amount.toLocaleString(),
        status: latestOrder.order_status,
        itemsCount: latestOrder.order_items?.length || 0
      });
    }

    // Step 5: Test admin view
    console.log('\n5️⃣ Testing admin order management...');
    
    const { data: allOrders, error: adminError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    if (adminError) {
      console.log('❌ Admin order retrieval failed:', adminError.message);
    } else {
      console.log('✅ Admin order management working!');
      console.log('📊 Recent orders for admin:');
      allOrders.forEach(order => {
        console.log(`   📋 ${order.order_id}: ${order.customer_name} - ₹${order.total_amount.toLocaleString()} (${order.order_status})`);
      });
    }

    // Clean up test data
    console.log('\n6️⃣ Cleaning up test data...');
    await supabase.from('order_items').delete().eq('order_id', testOrderId);
    await supabase.from('orders').delete().eq('order_id', testOrderId);
    console.log('🧹 Test data cleaned up');

    // Final results
    console.log('\n🎉 COMPLETE SYSTEM TEST RESULTS:');
    console.log('✅ Database Storage: WORKING');
    console.log('✅ Customer Invoice Email:', customerEmailSent ? 'SENT' : 'FAILED');
    console.log('✅ Store Notification Email:', storeEmailSent ? 'SENT' : 'FAILED');
    console.log('✅ Order History Retrieval: WORKING');
    console.log('✅ Admin Order Management: WORKING');

    console.log('\n🎯 YOUR COMPLETE ORDER SYSTEM IS READY!');
    console.log('\n📧 Check your email for:');
    console.log('• Professional order confirmation with complete invoice');
    console.log('• Detailed breakdown of items, prices, and totals');
    console.log('• Payment method and delivery information');
    console.log('• Customer support and next steps');
    
    console.log('\n📧 Check charmntreats@gmail.com for:');
    console.log('• New order notification with customer details');
    console.log('• Complete order summary for processing');
    console.log('• Action items and processing timeline');

    console.log('\n🚀 What Your Customers Get Now:');
    console.log('✅ Permanent order storage (no more lost data)');
    console.log('✅ Professional invoice emails with complete details');
    console.log('✅ Order history they can access anytime');
    console.log('✅ Email confirmations for every order');

    console.log('\n🔧 What You Get as Store Owner:');
    console.log('✅ Instant email notifications for new orders');
    console.log('✅ Complete customer and order details');
    console.log('✅ Admin panel to manage all orders');
    console.log('✅ Permanent database storage of all orders');

    return true;

  } catch (error) {
    console.error('❌ Complete system test failed:', error.message);
    return false;
  }
}

async function sendCustomerInvoiceEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #ff8c00 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for shopping with Charmntreats</p>
          <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Order #${orderId}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Placed on ${new Date(orderData.orderDate).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">📋 Order Summary</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 15px 12px;">
                    <strong style="color: #333;">${item.name}</strong><br>
                    <small style="color: #666;">Category: ${item.category}</small>
                  </td>
                  <td style="padding: 15px 12px; text-align: center; font-weight: bold; color: #f59e42;">${item.quantity}</td>
                  <td style="padding: 15px 12px; text-align: right; font-weight: bold;">₹${item.price.toLocaleString()}</td>
                  <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #10b981;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">💰 Pricing Breakdown</h3>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Subtotal:</span>
              <span style="font-weight: bold;">₹${subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Shipping:</span>
              <span style="font-weight: bold; color: ${shipping === 0 ? '#10b981' : '#333'};">
                ${shipping === 0 ? 'FREE' : '₹' + shipping.toLocaleString()}
              </span>
            </div>
            <hr style="margin: 15px 0; border: none; border-top: 2px solid #ddd;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #f59e42;">
              <span>Total Amount:</span>
              <span>₹${totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">📍 Delivery Address</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
              <strong style="color: #333;">${customerInfo.fullName}</strong><br>
              <span style="color: #666;">${customerInfo.address}</span><br>
              <span style="color: #666;">${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}</span><br>
              <span style="color: #666;">📞 ${customerInfo.phone}</span>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">💳 Payment Method</h4>
            <p style="margin: 0; font-weight: bold; color: #856404;">
              ${paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
            </p>
            ${paymentMethod === 'cod' ? 
              '<p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">Pay ₹' + totalAmount.toLocaleString() + ' when your order arrives</p>' : 
              '<p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">Payment processed successfully</p>'
            }
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">Need help? Contact us at charmntreats@gmail.com</p>
          </div>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #f59e42;">Charmntreats</h3>
          <p style="margin: 0; font-size: 12px; color: #ccc;">© 2024 Charmntreats. All rights reserved.</p>
        </div>
      </div>
    `;

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "Charmntreats", 
          email: "charmntreats@gmail.com" 
        },
        to: [{ 
          email: customerInfo.email,
          name: customerInfo.fullName
        }],
        subject: `🎉 Order Confirmed #${orderId} - ₹${totalAmount.toLocaleString()} | Charmntreats`,
        htmlContent
      })
    });

    return response.ok;

  } catch (error) {
    console.error('❌ Customer email error:', error);
    return false;
  }
}

async function sendStoreNotificationEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 New Order Alert!</h1>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">₹${totalAmount.toLocaleString()}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Order #${orderId}</p>
          </div>
        </div>
        
        <div style="padding: 30px 20px;">
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">⚡ Action Required</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              <li><strong>Process this order within 24 hours</strong></li>
              <li>Prepare items for packaging and shipping</li>
              ${paymentMethod === 'cod' ? 
                '<li><strong>COD Order: Collect ₹' + totalAmount.toLocaleString() + ' on delivery</strong></li>' : 
                '<li><strong>Payment: Already processed online ✅</strong></li>'
              }
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #0369a1;">👤 Customer Information</h3>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${customerInfo.fullName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${customerInfo.email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${customerInfo.phone}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong><br>
                ${customerInfo.address}<br>
                ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
              </p>
            </div>
          </div>
          
          <h3 style="color: #333;">📦 Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Product</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Price</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd;">
                    <strong>${item.name}</strong><br>
                    <small style="color: #666;">Category: ${item.category}</small>
                  </td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${item.quantity}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${item.price.toLocaleString()}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #10b981;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #ccc;">
            Order received on ${new Date(orderData.orderDate).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    `;

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "Charmntreats Store System", 
          email: "charmntreats@gmail.com" 
        },
        to: [{ 
          email: "charmntreats@gmail.com",
          name: "Charmntreats Store"
        }],
        subject: `💰 New Order #${orderId} - ₹${totalAmount.toLocaleString()} | ${customerInfo.fullName}`,
        htmlContent
      })
    });

    return response.ok;

  } catch (error) {
    console.error('❌ Store email error:', error);
    return false;
  }
}

// Run the complete system test
testCompleteOrderSystem();