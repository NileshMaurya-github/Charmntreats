// Quick test of direct Brevo API call
const SibApiV3Sdk = require('sib-api-v3-sdk');

const API_KEY = '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';

async function testDirectAPI() {
  try {
    console.log('🧪 Testing direct Brevo API call...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Create an instance of the TransactionalEmailsApi
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure email
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };

    sendSmtpEmail.to = [{
      email: "nileshmaurya3344@gmail.com", // Using the email from your signup form
      name: "Nilesh"
    }];

    sendSmtpEmail.subject = "OTP Verification - Charmntreats (Direct API Test)";

    const otp = "879147"; // Using the OTP from your error message

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
          
          <div style="background: #e7f5e7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2d5a2d; font-weight: bold;">✅ Direct API Test:</p>
            <p style="margin: 5px 0 0 0; color: #2d5a2d;">This email was sent using the direct Brevo API fallback method.</p>
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

    console.log('📧 Sending test OTP email...');
    console.log('📧 From: charmntreats@gmail.com');
    console.log('📧 To: nileshmaurya3344@gmail.com');
    console.log('🔐 OTP:', otp);
    
    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Direct API test successful!');
    console.log('📧 Message ID:', data.messageId);
    console.log('\n🎉 The fallback direct API method is working!');
    console.log('📧 Check your email inbox for the OTP message.');
    
    return true;

  } catch (error) {
    console.error('❌ Direct API test failed:', error);
    
    if (error.response && error.response.body) {
      console.error('❌ Response body:', error.response.body);
    }
    
    return false;
  }
}

// Run the test
testDirectAPI()
  .then(success => {
    if (success) {
      console.log('\n✅ Direct API fallback is working correctly!');
      console.log('🔧 Your app should now be able to send OTP emails.');
    } else {
      console.log('\n❌ Direct API test failed - there may still be issues.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });