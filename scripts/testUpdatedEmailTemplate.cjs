// Test updated email template with correct contact info
const SibApiV3Sdk = require('sib-api-v3-sdk');

async function testUpdatedEmailTemplate() {
  const BREVO_API_KEY = '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';
  
  console.log('🧪 Testing Updated Email Template with Correct Contact Info...');
  
  try {
    // Configure API key
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = BREVO_API_KEY;

    // Create API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Test updated OTP email template
    console.log('📧 Testing updated OTP email template...');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    sendSmtpEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test User"
    }];
    sendSmtpEmail.subject = "🔐 Updated Template Test - Charmntreats";
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Charmntreats</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h2>
          <p style="margin-bottom: 30px;">Thank you for signing up with Charmntreats! Please use the following code to verify your email address:</p>
          
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

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Updated email template sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('🔢 OTP Code:', otp);
    console.log('\n📊 Updated Contact Information:');
    console.log('📧 Email Support: charmntreats@gmail.com');
    console.log('📞 Call Us: +91 7355451081');
    console.log('🛍️ Continue Shopping: www.charmntreats.in');
    console.log('\n💡 Check your email to see the updated template with correct contact info!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.text);
    }
  }
}

testUpdatedEmailTemplate();