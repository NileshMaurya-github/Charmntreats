// Test order emails directly without TypeScript imports
const BREVO_API_KEY = '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';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Test order data
const testOrderData = {
  customerInfo: {
    fullName: 'John Doe',
    email: 'nilesh.maurya.developer@gmail.com',
    phone: '9876543210',
    address: '123 Main Street, Apartment 4B, Near Central Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
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
      quantity: 2,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7']
    }
  ],
  totalAmount: 2199,
  paymentMethod: 'cod',
  orderDate: new Date().toISOString(),
  orderId: 'CT' + Date.now().toString().slice(-6) + 'LIVE'
};

async function sendDetailedCustomerEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;
    
    // Calculate subtotal and shipping
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    // Enhanced customer email with complete invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Charmntreats</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e42 0%, #ff8c00 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for shopping with Charmntreats</p>
            <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">Order #${orderId}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Placed on ${new Date(orderData.orderDate).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px;">📋 Order Summary</h2>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold;">Item</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; font-weight: bold;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; font-weight: bold;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; font-weight: bold;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px 12px;">
                      <div>
                        <strong style="color: #333; font-size: 16px;">${item.name}</strong><br>
                        <small style="color: #666;">Category: ${item.category}</small><br>
                        <small style="color: #666;">SKU: ${item.catalogNumber || 'N/A'}</small>
                      </div>
                    </td>
                    <td style="padding: 15px 12px; text-align: center; font-weight: bold; color: #f59e42;">${item.quantity}</td>
                    <td style="padding: 15px 12px; text-align: right; font-weight: bold;">₹${item.price.toLocaleString()}</td>
                    <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #10b981;">₹${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <!-- Pricing Breakdown -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">💰 Pricing Breakdown</h3>
              <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                <span>Subtotal (${items.length} items):</span>
                <span style="font-weight: bold;">₹${subtotal.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                <span>Shipping & Handling:</span>
                <span style="font-weight: bold; color: ${shipping === 0 ? '#10b981' : '#333'};">
                  ${shipping === 0 ? 'FREE' : '₹' + shipping.toLocaleString()}
                </span>
              </div>
              ${shipping === 0 ? '<div style="font-size: 12px; color: #10b981; margin: 5px 0;">🎉 Free shipping on orders over ₹500!</div>' : ''}
              <hr style="margin: 15px 0; border: none; border-top: 2px solid #ddd;">
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #f59e42;">
                <span>Total Amount:</span>
                <span>₹${totalAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <!-- Payment & Delivery Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">💳 Payment Method</h4>
                <p style="margin: 0; font-weight: bold; color: #856404;">
                  ${paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                </p>
                ${paymentMethod === 'cod' ? 
                  '<p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">Pay ₹' + totalAmount.toLocaleString() + ' when your order arrives</p>' : 
                  '<p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">Payment processed successfully</p>'
                }
              </div>
              
              <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                <h4 style="margin: 0 0 10px 0; color: #0c5460;">🚚 Delivery Info</h4>
                <p style="margin: 0; font-weight: bold; color: #0c5460;">5-7 Business Days</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #0c5460;">Standard delivery to your address</p>
              </div>
            </div>
            
            <!-- Delivery Address -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📍 Delivery Address</h3>
              <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                <strong style="color: #333; font-size: 16px;">${customerInfo.fullName}</strong><br>
                <span style="color: #666;">${customerInfo.address}</span><br>
                <span style="color: #666;">${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}</span><br>
                <span style="color: #666;">📞 ${customerInfo.phone}</span>
              </div>
            </div>
            
            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1565c0;">🎯 What Happens Next?</h3>
              <div style="color: #1565c0;">
                <div style="margin: 10px 0; display: flex; align-items: center;">
                  <span style="background: #2196f3; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: bold;">1</span>
                  <span>We'll process and pack your order within 24 hours</span>
                </div>
                <div style="margin: 10px 0; display: flex; align-items: center;">
                  <span style="background: #2196f3; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: bold;">2</span>
                  <span>You'll receive tracking details via email & SMS</span>
                </div>
                <div style="margin: 10px 0; display: flex; align-items: center;">
                  <span style="background: #2196f3; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: bold;">3</span>
                  <span>Your order will be delivered in 5-7 business days</span>
                </div>
                ${paymentMethod === 'cod' ? 
                  '<div style="margin: 10px 0; display: flex; align-items: center;"><span style="background: #ff9800; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: bold;">💰</span><span><strong>Keep ₹' + totalAmount.toLocaleString() + ' ready for cash payment</strong></span></div>' : ''
                }
              </div>
            </div>
            
            <!-- Customer Support -->
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Need Help? 🤝</h3>
              <p style="color: #666; margin: 0 0 15px 0;">Our customer support team is here to help you</p>
              <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <a href="mailto:charmntreats@gmail.com" style="background: #f59e42; color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-weight: bold;">📧 Email Support</a>
                <a href="tel:+917355451081" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-weight: bold;">📞 Call Us</a>
              </div>
            </div>
            
            <!-- Continue Shopping -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://charmntreats.com" style="background: linear-gradient(135deg, #f59e42 0%, #ff8c00 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">🛍️ Continue Shopping</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; color: white; padding: 30px 20px; text-align: center;">
            <h3 style="margin: 0 0 15px 0; color: #f59e42;">Charmntreats</h3>
            <p style="margin: 0 0 10px 0; color: #ccc;">Handcrafted with love, delivered with care</p>
            <p style="margin: 0; font-size: 12px; color: #999;">
              © 2024 Charmntreats. All rights reserved.<br>
              This email was sent to ${customerInfo.email}
            </p>
          </div>
        </div>
      </body>
      </html>
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

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Customer invoice email sent! Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Customer email failed:', response.status, errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Customer email error:', error);
    return false;
  }
}

async function sendDetailedStoreEmail(orderData) {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Alert - Charmntreats</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 New Order Alert!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ka-ching! Money is coming your way</p>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 24px; font-weight: bold;">₹${totalAmount.toLocaleString()}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Order #${orderId}</p>
            </div>
          </div>
          
          <!-- Order Details -->
          <div style="padding: 30px 20px;">
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e42; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">⚡ Action Required</h3>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li><strong>Process this order within 24 hours</strong></li>
                <li>Prepare items for packaging and shipping</li>
                <li>Update customer with tracking information</li>
                ${paymentMethod === 'cod' ? 
                  '<li style="background: #fed7aa; padding: 5px; border-radius: 3px; margin: 5px 0;"><strong>COD Order: Collect ₹' + totalAmount.toLocaleString() + ' on delivery</strong></li>' : 
                  '<li style="color: #10b981;"><strong>Payment: Already processed online ✅</strong></li>'
                }
              </ul>
            </div>
            
            <!-- Customer Info -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0369a1;">👤 Customer Information</h3>
              <div style="background: white; padding: 15px; border-radius: 5px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${customerInfo.fullName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerInfo.email}" style="color: #0369a1;">${customerInfo.email}</a></p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${customerInfo.phone}" style="color: #0369a1;">${customerInfo.phone}</a></p>
                <p style="margin: 5px 0;"><strong>Address:</strong><br>
                  ${customerInfo.address}<br>
                  ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
                </p>
              </div>
            </div>
            
            <!-- Order Items -->
            <h3 style="color: #333; margin: 25px 0 15px 0;">📦 Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Product</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td style="padding: 12px; border: 1px solid #ddd;">
                      <strong>${item.name}</strong><br>
                      <small style="color: #666;">Category: ${item.category}</small><br>
                      <small style="color: #666;">SKU: ${item.catalogNumber || 'N/A'}</small>
                    </td>
                    <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${item.price.toLocaleString()}</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #10b981;">₹${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8f9fa;">
                  <td colspan="3" style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">₹${subtotal.toLocaleString()}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td colspan="3" style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Shipping:</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">${shipping === 0 ? 'FREE' : '₹' + shipping.toLocaleString()}</td>
                </tr>
                <tr style="background-color: #10b981; color: white;">
                  <td colspan="3" style="padding: 15px; text-align: right; border: 1px solid #10b981; font-weight: bold; font-size: 16px;">TOTAL AMOUNT:</td>
                  <td style="padding: 15px; text-align: right; border: 1px solid #10b981; font-weight: bold; font-size: 18px;">₹${totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            
            <!-- Order Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📊 Order Summary</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString('en-IN')}</p>
                  <p style="margin: 5px 0;"><strong>Order Time:</strong> ${new Date(orderData.orderDate).toLocaleTimeString('en-IN')}</p>
                  <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
                <div>
                  <p style="margin: 5px 0;"><strong>Total Items:</strong> ${items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p style="margin: 5px 0;"><strong>Order Status:</strong> <span style="background: #fbbf24; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">CONFIRMED</span></p>
                  <p style="margin: 5px 0;"><strong>Expected Delivery:</strong> ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #ccc;">
              This is an automated notification from your Charmntreats store system.<br>
              Order received on ${new Date(orderData.orderDate).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </body>
      </html>
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

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Store notification email sent! Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Store email failed:', response.status, errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Store email error:', error);
    return false;
  }
}

async function testCompleteOrderEmails() {
  console.log('🧪 Testing Complete Order Email System with Invoice Details...\n');
  
  console.log('📧 Test Order Details:');
  console.log('- Order ID:', testOrderData.orderId);
  console.log('- Customer:', testOrderData.customerInfo.fullName);
  console.log('- Email:', testOrderData.customerInfo.email);
  console.log('- Total Amount:', '₹' + testOrderData.totalAmount.toLocaleString());
  console.log('- Items:', testOrderData.items.length);
  console.log('- Payment:', testOrderData.paymentMethod.toUpperCase());

  try {
    console.log('\n1️⃣ Sending detailed customer invoice email...');
    const customerEmailSent = await sendDetailedCustomerEmail(testOrderData);
    
    console.log('\n⏳ Waiting 3 seconds before sending store email...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n2️⃣ Sending detailed store notification email...');
    const storeEmailSent = await sendDetailedStoreEmail(testOrderData);

    console.log('\n📊 Complete Email Test Results:');
    console.log('✅ Customer Invoice Email:', customerEmailSent ? '✅ SENT' : '❌ FAILED');
    console.log('✅ Store Notification Email:', storeEmailSent ? '✅ SENT' : '❌ FAILED');

    if (customerEmailSent && storeEmailSent) {
      console.log('\n🎉 SUCCESS! Both detailed emails sent successfully!');
      console.log('\n📧 Check your email inbox for:');
      console.log('✅ Professional order confirmation with complete invoice');
      console.log('✅ Itemized breakdown with prices and totals');
      console.log('✅ Payment method and delivery information');
      console.log('✅ Customer support and next steps');
      
      console.log('\n📧 Check charmntreats@gmail.com for:');
      console.log('✅ New order notification with customer details');
      console.log('✅ Complete order summary for processing');
      console.log('✅ Action items and delivery timeline');
      
      console.log('\n🎯 Your Enhanced Email System Features:');
      console.log('• Complete order invoice with professional design');
      console.log('• Detailed customer and delivery information');
      console.log('• Payment method clearly displayed');
      console.log('• Next steps and customer support links');
      console.log('• Store notifications with processing instructions');
      console.log('• COD vs Online payment handling');
      console.log('• Mobile-responsive HTML email templates');
      
      return true;
    } else {
      console.log('\n⚠️ Some emails failed - check logs above for details');
      return false;
    }

  } catch (error) {
    console.error('❌ Complete email test failed:', error);
    return false;
  }
}

// Run the complete test
testCompleteOrderEmails();