// Test Brevo SDK for sending transactional emails
var SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure API key
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

async function sendTestOTPEmail() {
  console.log('🧪 Testing Brevo SDK for OTP email...');
  
  try {
    // Create transactional email API instance
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Create email data
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Set sender
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };
    
    // Set recipient
    sendSmtpEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test User"
    }];
    
    // Set subject
    sendSmtpEmail.subject = "OTP Verification - Charmntreats";
    
    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔐 Generated test OTP:', testOTP);
    
    // Set HTML content
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Charmntreats</title>
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
            <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px; font-family: monospace;">${testOTP}</div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </p>
          
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
      Charmntreats - Verify Your Email
      
      Thank you for signing up with Charmntreats!
      
      Your verification code is: ${testOTP}
      
      This code will expire in 10 minutes.
      
      © 2024 Charmntreats. All rights reserved.
    `;
    
    // Send email
    console.log('📧 Sending email via Brevo SDK...');
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Email sent successfully via Brevo SDK!');
    console.log('📧 Message ID:', data.messageId);
    console.log('🔐 OTP Code:', testOTP);
    console.log('📬 Check your email: nileshmaurya59@gmail.com');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending email via Brevo SDK:', error);
    return false;
  }
}

sendTestOTPEmail();