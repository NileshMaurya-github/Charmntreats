// Test script using official Brevo Node.js SDK
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Your correct API key
const API_KEY = 'xkeysiba5b517f8682c0e26fb1a0ac4d165c32745a7baf5306eeb07878664facea48017-mOG7Qt6XsUFaXnKU';

async function testBrevoSDK() {
  try {
    console.log('🧪 Testing Brevo SDK with official implementation...');
    console.log('📧 API Key (first 20 chars):', API_KEY.substring(0, 20) + '...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    
    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Create an instance of the TransactionalEmailsApi
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Create SendSmtpEmail object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure email
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "9258ee001@smtp-brevo.com"
    };

    sendSmtpEmail.to = [{
      email: "test@example.com", // Replace with a real email for testing
      name: "Test User"
    }];

    sendSmtpEmail.subject = "Test Email from Charmntreats - Brevo SDK";

    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Test Email</h1>
          <p>This is a test email sent using the official Brevo Node.js SDK.</p>
          <p>If you receive this, the integration is working correctly!</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Test OTP Code:</p>
            <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px; font-family: monospace;">123456</div>
          </div>
        </body>
      </html>
    `;

    sendSmtpEmail.textContent = `
      Test Email from Charmntreats
      
      This is a test email sent using the official Brevo Node.js SDK.
      If you receive this, the integration is working correctly!
      
      Test OTP Code: 123456
    `;

    console.log('📧 Sending test email...');
    
    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', data.messageId);
    console.log('📧 Full response:', JSON.stringify(data, null, 2));
    
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    
    return false;
  }
}

// Run the test
testBrevoSDK()
  .then(success => {
    if (success) {
      console.log('🎉 Brevo SDK test completed successfully!');
    } else {
      console.log('💥 Brevo SDK test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });