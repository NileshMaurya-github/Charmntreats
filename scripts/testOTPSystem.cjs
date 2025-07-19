// Test OTP system end-to-end
const SibApiV3Sdk = require('sib-api-v3-sdk');

async function testOTPSystem() {
  const BREVO_API_KEY = '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';
  
  console.log('🧪 Testing Complete OTP System...');
  
  try {
    // Configure API key
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = BREVO_API_KEY;

    // Create API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Test 1: Signup OTP
    console.log('\n1️⃣ Testing Signup OTP Email...');
    const signupOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const signupEmail = new SibApiV3Sdk.SendSmtpEmail();
    signupEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    signupEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test User"
    }];
    signupEmail.subject = "🔐 Verify Your Email - Charmntreats";
    signupEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Charmntreats</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h2>
          <p style="margin-bottom: 30px;">Thank you for signing up with Charmntreats! Please use the following code to verify your email address:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px; font-family: monospace;">${signupOTP}</div>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This code will expire in 10 minutes.</p>
        </div>
      </div>
    `;

    const signupResult = await apiInstance.sendTransacEmail(signupEmail);
    console.log('✅ Signup OTP email sent successfully!');
    console.log('📧 Message ID:', signupResult.messageId);
    console.log('🔢 OTP Code:', signupOTP);

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Password Reset OTP
    console.log('\n2️⃣ Testing Password Reset Email...');
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const resetEmail = new SibApiV3Sdk.SendSmtpEmail();
    resetEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    resetEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test User"
    }];
    resetEmail.subject = "🔑 Password Reset Code - Charmntreats";
    resetEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Charmntreats</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="margin-bottom: 30px;">You requested to reset your password. Please use the following code to proceed:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your reset code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px; font-family: monospace;">${resetOTP}</div>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This code will expire in 10 minutes.</p>
        </div>
      </div>
    `;

    const resetResult = await apiInstance.sendTransacEmail(resetEmail);
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Message ID:', resetResult.messageId);
    console.log('🔢 Reset Code:', resetOTP);

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Order Confirmation Email
    console.log('\n3️⃣ Testing Order Confirmation Email...');
    const orderId = 'TEST-' + Date.now();
    
    const orderEmail = new SibApiV3Sdk.SendSmtpEmail();
    orderEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    orderEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test Customer"
    }];
    orderEmail.subject = `📦 Order Confirmation #${orderId} - Charmntreats`;
    orderEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for shopping with Charmntreats</p>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0;">Order Details</h2>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> <span style="color: #f59e42; font-size: 18px; font-weight: bold;">₹999</span></p>
          </div>
          <p>This is a test order confirmation email. Your email system is working perfectly!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://charmntreats.com" style="background: #f59e42; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Continue Shopping</a>
          </div>
        </div>
      </div>
    `;

    const orderResult = await apiInstance.sendTransacEmail(orderEmail);
    console.log('✅ Order confirmation email sent successfully!');
    console.log('📧 Message ID:', orderResult.messageId);
    console.log('📦 Order ID:', orderId);

    console.log('\n🎉 ALL EMAIL TESTS COMPLETED SUCCESSFULLY!');
    console.log('\n📊 Summary:');
    console.log('✅ Signup OTP Email: Working');
    console.log('✅ Password Reset Email: Working');
    console.log('✅ Order Confirmation Email: Working');
    console.log('\n💡 Check your email inbox (nileshmaurya59@gmail.com) for all test emails!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.text);
    }
  }
}

testOTPSystem();