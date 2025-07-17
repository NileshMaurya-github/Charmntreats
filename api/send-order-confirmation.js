// Vercel serverless function for sending order confirmation emails
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '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';

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

    console.log('📧 Sending order confirmation emails for order:', orderId);

    // Create transactional email API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Send customer confirmation email
    await sendCustomerConfirmation(apiInstance, {
      customerInfo,
      items,
      totalAmount,
      paymentMethod,
      orderDate,
      orderId
    });

    // Send store notification email
    await sendStoreNotification(apiInstance, {
      customerInfo,
      items,
      totalAmount,
      paymentMethod,
      orderDate,
      orderId
    });

    console.log('✅ Order confirmation emails sent successfully!');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order confirmation emails sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending order confirmation emails:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send order confirmation emails',
      details: error.message 
    });
  }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(apiInstance, orderData) {
  const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = orderData;
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  // Set sender
  sendSmtpEmail.sender = {
    name: "Charmntreats",
    email: "charmntreats@gmail.com"
  };
  
  // Set recipient
  sendSmtpEmail.to = [{
    email: customerInfo.email,
    name: customerInfo.fullName
  }];
  
  // Set subject
  sendSmtpEmail.subject = `Order Confirmation #${orderId} - Charmntreats`;
  
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
  
  // Set HTML content
  sendSmtpEmail.htmlContent = `
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
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong>Order ID:</strong> #${orderId}<br>
              <strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
              <strong>Total Amount:</strong> <span style="color: #f59e42; font-size: 18px; font-weight: bold;">₹${totalAmount.toLocaleString()}</span>
            </div>
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

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1f2937; margin-top: 0;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>₹${subtotal.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Shipping:</span>
            <span style="color: ${shipping === 0 ? '#10b981' : '#1f2937'};">${shipping === 0 ? 'Free' : '₹' + shipping}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #d1d5db; padding-top: 10px;">
            <span>Total:</span>
            <span style="color: #f59e42;">₹${totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #92400e; margin-top: 0;">What's Next?</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            <li>We'll process your order within 24 hours</li>
            <li>You'll receive tracking details via email</li>
            <li>Estimated delivery: 5-7 business days</li>
            ${paymentMethod === 'cod' ? '<li>Pay cash when your order arrives at your doorstep</li>' : '<li>Your payment has been processed successfully</li>'}
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://charmntreats.com" style="background: #f59e42; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Continue Shopping</a>
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
  
  // Send email
  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log('✅ Customer confirmation email sent:', data.messageId);
}

// Send notification email to store
async function sendStoreNotification(apiInstance, orderData) {
  const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = orderData;
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  // Set sender
  sendSmtpEmail.sender = {
    name: "Charmntreats Store System",
    email: "charmntreats@gmail.com"
  };
  
  // Set recipient (store email)
  sendSmtpEmail.to = [{
    email: "charmntreats@gmail.com",
    name: "Charmntreats Store"
  }];
  
  // Set subject
  sendSmtpEmail.subject = `🎉 New Order Received #${orderId} - ₹${totalAmount.toLocaleString()}`;
  
  // Generate items HTML for store
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
  
  // Set HTML content for store
  sendSmtpEmail.htmlContent = `
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
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong>Order ID:</strong> #${orderId}<br>
              <strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
              <strong>Total Amount:</strong> <span style="color: #10b981; font-size: 20px; font-weight: bold;">₹${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <h3 style="color: #1f2937; margin-bottom: 20px;">Customer Details</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <strong>Name:</strong> ${customerInfo.fullName}<br>
              <strong>Email:</strong> ${customerInfo.email}<br>
              <strong>Phone:</strong> ${customerInfo.phone}
            </div>
            <div>
              <strong>Delivery Address:</strong><br>
              ${customerInfo.address}<br>
              ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
            </div>
          </div>
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
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            This is an automated notification from your Charmntreats store system.<br>
            Order received on ${new Date(orderDate).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Send email
  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log('✅ Store notification email sent:', data.messageId);
}