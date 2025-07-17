// Simple Email Service - Direct Brevo API calls for order confirmations
interface OrderData {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: any[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  orderDate: string;
  orderId: string;
}

export async function sendOrderEmails(orderData: OrderData): Promise<boolean> {
  const BREVO_API_KEY = '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';
  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

  console.log('🚀 Sending order emails for order:', orderData.orderId);

  try {
    // Send customer email
    const customerEmailSent = await sendCustomerEmail(orderData, BREVO_API_KEY, BREVO_API_URL);
    
    // Wait 1 second between emails
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send store email
    const storeEmailSent = await sendStoreEmail(orderData, BREVO_API_KEY, BREVO_API_URL);

    console.log('📊 Email Results:', {
      customer: customerEmailSent ? '✅' : '❌',
      store: storeEmailSent ? '✅' : '❌'
    });

    return customerEmailSent && storeEmailSent;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

async function sendCustomerEmail(orderData: OrderData, apiKey: string, apiUrl: string): Promise<boolean> {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;

    // Simple customer email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f59e42; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Order Confirmed! 🎉</h1>
          <p style="margin: 10px 0 0 0;">Thank you for shopping with Charmntreats</p>
        </div>
        
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Order Details</h2>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Customer:</strong> ${customerInfo.fullName}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
          
          <h3 style="color: #333;">Delivery Address</h3>
          <p>
            ${customerInfo.fullName}<br>
            ${customerInfo.address}<br>
            ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
          </p>
          
          <h3 style="color: #333;">Order Items</h3>
          ${items.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <strong>${item.name}</strong><br>
              Category: ${item.category} | Qty: ${item.quantity} | Price: ₹${(item.price * item.quantity).toLocaleString()}
            </div>
          `).join('')}
          
          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive tracking details via email</li>
              <li>Estimated delivery: 5-7 business days</li>
              ${paymentMethod === 'cod' ? '<li>Pay cash when your order arrives</li>' : '<li>Payment processed successfully</li>'}
            </ul>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://charmntreats.com" style="background: #f59e42; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #666; font-size: 12px;">
            Need help? Contact us at charmntreats@gmail.com<br>
            © 2024 Charmntreats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
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
      console.log('✅ Customer email sent! ID:', result.messageId);
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

async function sendStoreEmail(orderData: OrderData, apiKey: string, apiUrl: string): Promise<boolean> {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, orderId } = orderData;

    // Simple store notification template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">🎉 New Order Received!</h1>
          <p style="margin: 10px 0 0 0;">Congratulations on your new order</p>
        </div>
        
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Order Summary</h2>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString('en-IN')}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Total Amount:</strong> <span style="color: #10b981; font-size: 18px; font-weight: bold;">₹${totalAmount.toLocaleString()}</span></p>
          
          <h3 style="color: #333;">Customer Details</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>Name:</strong> ${customerInfo.fullName}</p>
            <p><strong>Email:</strong> ${customerInfo.email}</p>
            <p><strong>Phone:</strong> ${customerInfo.phone}</p>
            <p><strong>Address:</strong><br>
              ${customerInfo.address}<br>
              ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}
            </p>
          </div>
          
          <h3 style="color: #333;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">
                    <strong>${item.name}</strong><br>
                    <small>${item.category} • #${item.catalogNumber}</small>
                  </td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${item.price.toLocaleString()}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">Action Required</h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              <li>Process this order within 24 hours</li>
              <li>Prepare items for packaging and shipping</li>
              <li>Update customer with tracking information</li>
              ${paymentMethod === 'cod' ? `<li><strong>COD Order:</strong> Collect ₹${totalAmount.toLocaleString()} on delivery</li>` : '<li><strong>Payment:</strong> Already processed online</li>'}
            </ul>
          </div>
          
          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #666; font-size: 12px;">
            This is an automated notification from your Charmntreats store system.<br>
            Order received on ${new Date(orderData.orderDate).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    `;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
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
      console.log('✅ Store email sent! ID:', result.messageId);
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

export default { sendOrderEmails };