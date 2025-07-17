// Final test of Brevo SDK with correct API key format
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Correct API key format (with hyphen)
const API_KEY = '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';

async function testOTPEmail() {
  try {
    console.log('🧪 Testing OTP email with corrected Brevo SDK...');
    console.log('📧 API Key format: CORRECT (with hyphen)');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    
    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Create an instance of the TransactionalEmailsApi
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Create SendSmtpEmail object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure email for OTP
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };

    sendSmtpEmail.to = [{
      email: "charmntreats@gmail.com", // Using your account email for testing
      name: "Test User"
    }];

    sendSmtpEmail.subject = "OTP Verification - Charmntreats";

    const otp = "123456";
    const type = "signup";
    const title = "Verify Your Email";
    const message = "Thank you for signing up with Charmntreats! Please use the following code to verify your email address:";

    sendSmtpEmail.htmlContent = `
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

    sendSmtpEmail.textContent = `
      Charmntreats - ${title}
      
      ${message}
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      © 2024 Charmntreats. All rights reserved.
    `;

    console.log('📧 Sending OTP email...');
    
    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ OTP Email sent successfully!');
    console.log('📧 Message ID:', data.messageId);
    console.log('📧 Full response:', JSON.stringify(data, null, 2));
    
    return true;

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    
    return false;
  }
}

// Run the test
testOTPEmail()
  .then(success => {
    if (success) {
      console.log('🎉 Brevo OTP email test completed successfully!');
      console.log('📧 Check your email inbox for the OTP message.');
    } else {
      console.log('💥 Brevo OTP email test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });