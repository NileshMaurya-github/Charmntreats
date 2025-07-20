
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  items: any[];
  customer_details: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const orderData: OrderData = await req.json();
    console.log('Processing order confirmation email for:', orderData.order_number);

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(orderData);

    // Send email using a simple email service (this is a placeholder)
    // In production, you would integrate with services like:
    // - SendGrid
    // - Mailgun  
    // - Amazon SES
    // - Postmark
    console.log('Order confirmation email would be sent to:', orderData.customer_email);
    console.log('Invoice HTML generated for order:', orderData.order_number);

    // For now, we'll just log the email content
    console.log('Email content:', {
      to: orderData.customer_email,
      subject: `Order Confirmation - ${orderData.order_number}`,
      html: invoiceHtml
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email processed',
        order_id: orderData.order_id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending order confirmation:', error);
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

function generateInvoiceHtml(orderData: OrderData): string {
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
      <title>Order Confirmation - ${orderData.order_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D97706; margin-bottom: 10px;">Charmntreats</h1>
        <h2 style="color: #374151; margin-bottom: 5px;">Order Confirmation</h2>
        <p style="color: #6B7280;">Thank you for your purchase!</p>
      </div>

      <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #374151;">Order Details</h3>
        <p><strong>Order Number:</strong> ${orderData.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${orderData.customer_name}</p>
        <p><strong>Email:</strong> ${orderData.customer_email}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151;">Shipping Address</h3>
        <p style="margin-bottom: 5px;">${orderData.customer_details.name}</p>
        <p style="margin-bottom: 5px;">${orderData.customer_details.address}</p>
        <p style="margin-bottom: 5px;">${orderData.customer_details.city}, ${orderData.customer_details.state}</p>
        <p style="margin-bottom: 5px;">PIN: ${orderData.customer_details.pincode}</p>
        <p><strong>Phone:</strong> ${orderData.customer_details.phone}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #D1D5DB;">
              Total Amount:
            </td>
            <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #D1D5DB;">
              ₹${orderData.total_amount.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400E;"><strong>Note:</strong> Your order will be processed within 1-2 business days. You will receive a tracking notification once your order is shipped.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; margin-bottom: 10px;">Thank you for choosing Charmntreats!</p>
        <p style="color: #6B7280; font-size: 14px;">For any queries, contact us at charmntreats@gmail.com or +917355451081</p>
      </div>
    </body>
    </html>
  `;
}
