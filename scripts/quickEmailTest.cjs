// Quick email test using Brevo SDK
const SibApiV3Sdk = require('sib-api-v3-sdk');

async function quickEmailTest() {
  const BREVO_API_KEY = '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';
  
  console.log('🧪 Quick Email Test Starting...');
  
  try {
    // Configure API key
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = BREVO_API_KEY;

    // Create API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Test OTP email
    console.log('📧 Testing OTP email...');
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    sendSmtpEmail.to = [{
      email: "nileshmaurya59@gmail.com",
      name: "Test User"
    }];
    sendSmtpEmail.subject = "🧪 OTP Test - Charmntreats";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f59e42; color: white; padding: 20px; text-align: center; border-radius: 8px;">
          <h1>OTP Test Email</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
          <h2>Your OTP Code</h2>
          <div style="font-size: 32px; font-weight: bold; color: #f59e42; text-align: center; padding: 20px; background: white; border-radius: 8px;">
            123456
          </div>
          <p>This is a test email to verify OTP functionality.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ OTP email sent successfully!');
    console.log('📧 Message ID:', result.messageId);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.text);
    }
  }
}

quickEmailTest();