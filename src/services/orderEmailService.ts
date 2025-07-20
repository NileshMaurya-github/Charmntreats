// Order Email Service - Sends order confirmation emails using Brevo API
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

class OrderEmailService {
  private BREVO_API_KEY = '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';
  private BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

  // Send order confirmation emails (both customer and store)
  async sendOrderConfirmationEmails(orderData: OrderData): Promise<boolean> {
    console.log('🚀 Starting email sending process for order:', orderData.orderId);
    
    let customerEmailSent = false;
    let storeEmailSent = false;

    try {
      // Send customer confirmation email
      console.log('📧 Sending customer confirmation email...');
      customerEmailSent = await this.sendCustomerConfirmation(orderData);
      
      // Wait a bit between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send store notification email
      console.log('📧 Sending store notification email...');
      storeEmailSent = await this.sendStoreNotification(orderData);

      console.log('📊 Email Results:', {
        customerEmail: customerEmailSent ? '✅ Sent' : '❌ Failed',
        storeEmail: storeEmailSent ? '✅ Sent' : '❌ Failed'
      });

      return customerEmailSent && storeEmailSent;

    } catch (error) {
      console.error('❌ Error in email sending process:', error);
      return false;
    }
  }

  // Send confirmation email to customer
  private async sendCustomerConfirmation(orderData: OrderData): Promise<boolean> {
    try {
      console.log('👤 Preparing customer confirmation email...');
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

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">Need Help?</h3>
              <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">Our customer support team is here to help you</p>
              
              <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                <a href="mailto:charmntreats@gmail.com" style="background: #f59e42; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                  📧 Email Support
                </a>
                <a href="tel:+917355451081" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                  📞 Call Us
                </a>
                <a href="https://www.charmntreats.in" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                  🛍️ Continue Shopping
                </a>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Charmntreats. All rights reserved.<br>
                Handcrafted treasures for your special moments.<br>
                <a href="mailto:charmntreats@gmail.com" style="color: #f59e42; text-decoration: none;">charmntreats@gmail.com</a> | 
                <a href="tel:+917355451081" style="color: #f59e42; text-decoration: none;">+91 7355451081</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log('📤 Sending customer email to:', customerInfo.email);
      
      const emailPayload = {
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
      };

      console.log('📋 Email payload prepared for customer');

      const response = await fetch(this.BREVO_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.BREVO_API_KEY
        },
        body: JSON.stringify(emailPayload)
      });

      console.log('📊 Customer email response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Customer confirmation email sent successfully!');
        console.log('📧 Message ID:', result.messageId);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Customer email failed with status:', response.status);
        console.error('❌ Error details:', errorText);
        return false;
      }

    } catch (error) {
      console.error('❌ Customer email error:', error);
      return false;
    }
  }

  // Send notification email to store
  private async sendStoreNotification(orderData: OrderData): Promise<boolean> {
    try {
      console.log('🏪 Preparing store notification email...');
      const { customerInfo, items, totalAmount, paymentMethod, orderDate, orderId } = orderData;
      
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

      console.log('📤 Sending store notification email to: charmntreats@gmail.com');
      
      const storeEmailPayload = {
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
      };

      console.log('📋 Store email payload prepared');

      const response = await fetch(this.BREVO_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.BREVO_API_KEY
        },
        body: JSON.stringify(storeEmailPayload)
      });

      console.log('📊 Store email response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Store notification email sent successfully!');
        console.log('📧 Message ID:', result.messageId);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Store email failed with status:', response.status);
        console.error('❌ Error details:', errorText);
        return false;
      }

    } catch (error) {
      console.error('❌ Store email error:', error);
      return false;
    }
  }
}

export const orderEmailService = new OrderEmailService();
export default orderEmailService;