// Complete test of Brevo integration - both OTP and Welcome emails
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Correct API key format
const API_KEY = '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';

async function testOTPEmail() {
  try {
    console.log('🧪 Testing OTP Email...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Create an instance of the TransactionalEmailsApi
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure OTP email
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };

    sendSmtpEmail.to = [{
      email: "charmntreats@gmail.com",
      name: "Test User"
    }];

    sendSmtpEmail.subject = "OTP Verification - Charmntreats";

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

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

    // Send OTP email
    const otpResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ OTP Email sent successfully!');
    console.log('📧 OTP Message ID:', otpResult.messageId);
    console.log('🔐 Generated OTP:', otp);
    
    return { success: true, messageId: otpResult.messageId, otp };

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
}

async function testWelcomeEmail() {
  try {
    console.log('\n🧪 Testing Welcome Email...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Create an instance of the TransactionalEmailsApi
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure welcome email
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };

    sendSmtpEmail.to = [{
      email: "charmntreats@gmail.com",
      name: "Test User"
    }];

    sendSmtpEmail.subject = "Welcome to Charmntreats! 🎉";

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
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello Test User!</h2>
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

    // Send welcome email
    const welcomeResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome Email sent successfully!');
    console.log('📧 Welcome Message ID:', welcomeResult.messageId);
    
    return { success: true, messageId: welcomeResult.messageId };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting Complete Brevo Integration Test...\n');
  
  // Test OTP Email
  const otpResult = await testOTPEmail();
  
  // Wait a moment between emails
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test Welcome Email
  const welcomeResult = await testWelcomeEmail();
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`OTP Email: ${otpResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (otpResult.success) {
    console.log(`  - Message ID: ${otpResult.messageId}`);
    console.log(`  - Generated OTP: ${otpResult.otp}`);
  }
  
  console.log(`Welcome Email: ${welcomeResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (welcomeResult.success) {
    console.log(`  - Message ID: ${welcomeResult.messageId}`);
  }
  
  const allSuccess = otpResult.success && welcomeResult.success;
  
  if (allSuccess) {
    console.log('\n🎉 All tests passed! Brevo integration is working correctly.');
    console.log('📧 Check your email inbox for both messages.');
  } else {
    console.log('\n💥 Some tests failed. Check the errors above.');
  }
  
  return allSuccess;
}

// Run the complete test
runCompleteTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });