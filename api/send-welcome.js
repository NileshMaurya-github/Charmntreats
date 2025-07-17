// Vercel serverless function for sending welcome emails via Brevo SDK
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
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📧 Sending welcome email via Brevo SDK:', { email, name });

    // Create transactional email API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Create email data
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Set sender
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    
    // Set recipient
    sendSmtpEmail.to = [{
      email: email,
      name: name
    }];
    
    // Set subject
    sendSmtpEmail.subject = 'Welcome to Charmntreats! 🎉';
    
    // Set HTML content
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Charmntreats</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Charmntreats! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="margin-bottom: 20px;">
            Thank you for joining the Charmntreats family! We're excited to have you discover our collection of handcrafted treasures.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #f59e42; margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Explore our unique handcrafted products</li>
              <li>Follow your orders and track deliveries</li>
              <li>Get exclusive offers and early access to new collections</li>
              <li>Join our community of craft lovers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://charmntreats.com" style="background: #f59e42; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 Charmntreats. All rights reserved.<br>
              Handcrafted treasures for your special moments.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Set text content
    sendSmtpEmail.textContent = `
      Welcome to Charmntreats! 🎉
      
      Hello ${name}!
      
      Thank you for joining the Charmntreats family! We're excited to have you discover our collection of handcrafted treasures.
      
      What's Next?
      - Explore our unique handcrafted products
      - Follow your orders and track deliveries
      - Get exclusive offers and early access to new collections
      - Join our community of craft lovers
      
      Start Shopping: https://charmntreats.com
      
      © 2024 Charmntreats. All rights reserved.
      Handcrafted treasures for your special moments.
    `;
    
    // Send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Welcome email sent successfully!', data.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: data.messageId,
      message: 'Welcome email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send welcome email',
      details: error.message 
    });
  }
}