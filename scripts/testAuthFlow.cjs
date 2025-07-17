// Test the complete authentication flow with Brevo integration
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Correct API key format
const API_KEY = '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';

// Simulate OTP Service
class TestOTPService {
  constructor() {
    this.otpStorage = new Map();
    this.OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
  }

  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  async sendOTPEmail(email, otp, type) {
    try {
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
        email: "9258ee001@smtp-brevo.com"
      };

      sendSmtpEmail.to = [{ email, name: "User" }];

      const subject = type === 'signup' 
        ? 'Verify Your Email - Charmntreats' 
        : 'Password Reset Code - Charmntreats';

      sendSmtpEmail.subject = subject;

      const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
      const message = type === 'signup' 
        ? 'Thank you for signing up with Charmntreats! Please use the following code to verify your email address:'
        : 'You requested to reset your password. Please use the following code to proceed:';

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

      // Send email
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ OTP email sent successfully!', data.messageId);
      return true;

    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return false;
    }
  }

  async generateAndSendOTP(email, type) {
    try {
      const otp = this.generateOTP(6);
      const expiresAt = Date.now() + this.OTP_EXPIRY_TIME;

      console.log('🔐 Generated OTP for', email, ':', otp);

      // Store OTP
      this.otpStorage.set(email, {
        email,
        otp,
        type,
        expiresAt,
        attempts: 0
      });

      // Send OTP via email
      const emailSent = await this.sendOTPEmail(email, otp, type);

      if (emailSent) {
        return {
          success: true,
          message: 'OTP sent successfully',
          otp: otp // For testing purposes
        };
      } else {
        return {
          success: false,
          message: 'Failed to send OTP email',
          otp: otp // For testing purposes
        };
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      return {
        success: false,
        message: 'An error occurred while sending OTP.'
      };
    }
  }

  verifyOTP(email, inputOTP) {
    const otpData = this.otpStorage.get(email);

    if (!otpData) {
      return {
        success: false,
        message: 'No OTP found for this email.'
      };
    }

    if (Date.now() > otpData.expiresAt) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: 'OTP has expired.'
      };
    }

    if (otpData.otp === inputOTP) {
      this.otpStorage.delete(email);
      return {
        success: true,
        message: 'OTP verified successfully.'
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP.'
      };
    }
  }
}

async function testCompleteAuthFlow() {
  console.log('🚀 Testing Complete Authentication Flow with Brevo...\n');

  const otpService = new TestOTPService();
  const testEmail = 'charmntreats@gmail.com';

  // Step 1: User signs up and requests OTP
  console.log('📝 Step 1: User signup - Generating and sending OTP...');
  const otpResult = await otpService.generateAndSendOTP(testEmail, 'signup');
  
  if (!otpResult.success) {
    console.error('❌ Failed to send OTP:', otpResult.message);
    return false;
  }

  console.log('✅ OTP sent successfully!');
  console.log('🔐 Generated OTP:', otpResult.otp);

  // Step 2: Simulate user entering OTP
  console.log('\n🔐 Step 2: User enters OTP for verification...');
  
  // Test with correct OTP
  const verifyResult = otpService.verifyOTP(testEmail, otpResult.otp);
  
  if (verifyResult.success) {
    console.log('✅ OTP verification successful!');
    console.log('📧 Message:', verifyResult.message);
  } else {
    console.error('❌ OTP verification failed:', verifyResult.message);
    return false;
  }

  // Step 3: Send welcome email after successful verification
  console.log('\n🎉 Step 3: Sending welcome email after successful signup...');
  
  try {
    // Configure the API client for welcome email
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };

    sendSmtpEmail.to = [{
      email: testEmail,
      name: "New User"
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
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello New User!</h2>
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

    const welcomeData = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent successfully!');
    console.log('📧 Welcome Message ID:', welcomeData.messageId);

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }

  console.log('\n🎉 Complete authentication flow test successful!');
  console.log('📧 Check your email for both OTP and welcome messages.');
  
  return true;
}

// Run the complete authentication flow test
testCompleteAuthFlow()
  .then(success => {
    if (success) {
      console.log('\n✅ All authentication flow tests passed!');
      console.log('🔧 Brevo integration is working correctly for:');
      console.log('   - OTP email sending');
      console.log('   - OTP verification');
      console.log('   - Welcome email sending');
    } else {
      console.log('\n❌ Authentication flow test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });