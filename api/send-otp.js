// Vercel serverless function for sending OTP emails via Brevo API
// Using direct fetch instead of SDK for better compatibility

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY || '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';

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
    const { email, otp, type } = req.body;

    if (!email || !otp || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📧 Sending OTP email via Brevo API:', { email, otp, type });

    // Set subject and content
    const subject = type === 'signup' 
      ? 'Verify Your Email - Charmntreats' 
      : 'Password Reset Code - Charmntreats';
    
    const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const message = type === 'signup' 
      ? 'Thank you for signing up with Charmntreats! Please use the following code to verify your email address:'
      : 'You requested to reset your password. Please use the following code to proceed:';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Charmntreats</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${title}</h2>
          <p style="margin-bottom: 30px;">${message}</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px; font-family: monospace;">${otp}</div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </p>
          
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
    
    const textContent = `
      Charmntreats - ${title}
      
      ${message}
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      © 2024 Charmntreats. All rights reserved.
    `;

    // Send email using direct Brevo API call
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
        to: [{ email, name: "User" }],
        subject,
        htmlContent,
        textContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Brevo API error:', errorText);
      throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ OTP email sent successfully!', result.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: result.messageId,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP email',
      details: error.message 
    });
  }
}