
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  total_amount: number;
  items: any[];
  payment_method: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const orderData: OrderData = await req.json();
    console.log('Processing admin notification for order:', orderData.order_number);

    // Generate admin notification HTML
    const notificationHtml = generateAdminNotificationHtml(orderData);

    // Send email to admin using a simple email service (this is a placeholder)
    // In production, you would integrate with services like:
    // - SendGrid
    // - Mailgun  
    // - Amazon SES
    // - Postmark
    
    const adminEmail = 'charmntreats@gmail.com';
    console.log('Admin notification email would be sent to:', adminEmail);
    console.log('Admin notification generated for order:', orderData.order_number);

    // For now, we'll just log the email content
    console.log('Admin email content:', {
      to: adminEmail,
      subject: `New Order Received - ${orderData.order_number}`,
      html: notificationHtml
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin notification email processed',
        order_id: orderData.order_id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending admin notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateAdminNotificationHtml(orderData: OrderData): string {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - ${orderData.order_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D97706; margin-bottom: 10px;">Charmntreats Admin</h1>
        <h2 style="color: #EF4444; margin-bottom: 5px;">🎉 New Order Received!</h2>
        <p style="color: #6B7280;">Order #${orderData.order_number}</p>
      </div>

      <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #DC2626;">⚡ Action Required</h3>
        <p style="margin-bottom: 0;">A new order has been placed and requires your attention. Please log into the admin dashboard to process this order.</p>
      </div>

      <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #374151;">📋 Order Summary</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <p><strong>Order Number:</strong> ${orderData.order_number}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${orderData.payment_method}</p>
          <p><strong>Total Amount:</strong> ₹${orderData.total_amount.toLocaleString()}</p>
        </div>
      </div>

      <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #0369A1;">👤 Customer Information</h3>
        <p><strong>Name:</strong> ${orderData.customer_name}</p>
        <p><strong>Email:</strong> ${orderData.customer_email}</p>
        <p><strong>Phone:</strong> ${orderData.customer_phone}</p>
        
        <h4 style="color: #0369A1; margin-bottom: 10px;">📍 Shipping Address</h4>
        <p style="margin-bottom: 5px;">${orderData.customer_address}</p>
        <p style="margin-bottom: 5px;">${orderData.customer_city}, ${orderData.customer_state}</p>
        <p>PIN: ${orderData.customer_pincode}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151;">🛍️ Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #F3F4F6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #D1D5DB;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #D1D5DB;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #D1D5DB;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #D1D5DB;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #D1D5DB; background-color: #FEF3C7;">
                Total Amount:
              </td>
              <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #D1D5DB; background-color: #FEF3C7;">
                ₹${orderData.total_amount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #065F46; color: white; border-radius: 8px;">
        <h3 style="margin-top: 0; color: white;">🚀 Next Steps</h3>
        <p style="margin-bottom: 15px;">Log into your admin dashboard to process this order and update the order status.</p>
        <a href="https://charmntreats.lovable.app/admin" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Admin Dashboard
        </a>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">This is an automated notification from your Charmntreats store.</p>
      </div>
    </body>
    </html>
  `;
}
