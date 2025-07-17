// Test the order email service directly
const fetch = require('node-fetch');

async function testOrderEmails() {
  try {
    console.log('📧 Testing order email service...');

    // Sample order data
    const orderData = {
      customerInfo: {
        fullName: 'Test Customer',
        email: 'test@example.com', // Replace with your email for testing
        phone: '9876543210',
        address: '123 Test Street, Test Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      items: [
        {
          id: 'test-product-1',
          name: 'Handcrafted Dream Catcher',
          price: 599,
          quantity: 2,
          category: 'Home Decor',
          catalogNumber: 'DC001',
          images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']
        },
        {
          id: 'test-product-2',
          name: 'Embroidered Wall Hanging',
          price: 799,
          quantity: 1,
          category: 'Wall Art',
          catalogNumber: 'WH002',
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']
        }
      ],
      totalAmount: 1997,
      paymentMethod: 'cod',
      orderDate: new Date().toISOString(),
      orderId: 'CT' + Date.now().toString().slice(-6) + 'TEST'
    };

    console.log('🔍 Testing with order ID:', orderData.orderId);
    console.log('📊 Order total:', '₹' + orderData.totalAmount.toLocaleString());
    console.log('💳 Payment method:', orderData.paymentMethod.toUpperCase());

    // Test customer confirmation email
    console.log('\n📧 Testing customer confirmation email...');
    const customerEmailResult = await sendCustomerEmail(orderData);
    
    // Test store notification email
    console.log('\n📧 Testing store notification email...');
    const storeEmailResult = await sendStoreEmail(orderData);

    if (customerEmailResult && storeEmailResult) {
      console.log('\n✅ Both emails sent successfully!');
      console.log('🎉 Order email system is working correctly!');
    } else {
      console.log('\n⚠️ Some emails may have failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function sendCustomerEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = orderData;
    
    // Calculate shipping
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;
    
    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${item.images[0]}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div>
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${item.name}</div>
              <div style="font-size: 14px; color: #6b7280;">${item.category} • #${item.catalogNumber}</div>
              <div style="font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</div>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
          ₹${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for shopping with Charmntreats</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0;">Order Details</h2>
            <div>
              <strong>Order ID:</strong> #${orderId}<br>
              <strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN')}<br>
              <strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
              <strong>Total Amount:</strong> <span style="color: #f59e42; font-size: 18px; font-weight: bold;">₹${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <h3 style="color: #1f2937; margin-bottom: 20px;">Delivery Address</h3>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <strong>${customerInfo.fullName}</strong><br>
            ${customerInfo.address}<br>
            ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}<br>
            📞 ${customerInfo.phone} | ✉️ ${customerInfo.email}
          </div>

          <h3 style="color: #1f2937; margin-bottom: 20px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            ${itemsHtml}
          </table>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin-top: 0;">What's Next?</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive tracking details via email</li>
              <li>Estimated delivery: 5-7 business days</li>
              ${paymentMethod === 'cod' ? '<li>Pay cash when your order arrives at your doorstep</li>' : '<li>Your payment has been processed successfully</li>'}
            </ul>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Need help? Contact us at charmntreats@gmail.com<br>
              © 2024 Charmntreats. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
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
        subject: `Order Confirmation #${orderId} - Charmntreats`,
        htmlContent
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Customer email sent successfully! Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Customer email failed:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Customer email error:', error);
    return false;
  }
}

async function sendStoreEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = orderData;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <small>${item.category} • #${item.catalogNumber}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You've received a new order</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #10b981;">
            <h2 style="color: #065f46; margin: 0 0 15px 0;">Order Summary</h2>
            <div>
              <strong>Order ID:</strong> #${orderId}<br>
              <strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN')}<br>
              <strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
              <strong>Total Amount:</strong> <span style="color: #10b981; font-size: 20px; font-weight: bold;">₹${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <h3 style="color: #1f2937; margin-bottom: 20px;">Customer Details</h3>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <strong>Name:</strong> ${customerInfo.fullName}<br>
            <strong>Email:</strong> ${customerInfo.email}<br>
            <strong>Phone:</strong> ${customerInfo.phone}<br><br>
            <strong>Delivery Address:</strong><br>
            ${customerInfo.address}<br>
            ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
          </div>

          <h3 style="color: #1f2937; margin-bottom: 20px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 15px; text-align: left; border-bottom: 1px solid #e5e7eb;">Product</th>
                <th style="padding: 15px; text-align: center; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">Price</th>
                <th style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin-top: 0;">Action Required</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Process this order within 24 hours</li>
              <li>Prepare items for packaging and shipping</li>
              <li>Update customer with tracking information</li>
              ${paymentMethod === 'cod' ? '<li><strong>COD Order:</strong> Collect ₹' + totalAmount.toLocaleString() + ' on delivery</li>' : '<li><strong>Payment:</strong> Already processed online</li>'}
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
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
        subject: `🎉 New Order Received #${orderId} - ₹${totalAmount.toLocaleString()}`,
        htmlContent
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Store email sent successfully! Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Store email failed:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Store email error:', error);
    return false;
  }
}

testOrderEmails();