// Test Brevo API directly to ensure it's working
const fetch = require('node-fetch');

async function testBrevoAPI() {
  const BREVO_API_KEY = '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';
  
  console.log('🧪 Testing Brevo API connection...');
  
  try {
    // Test 1: Check API key validity
    console.log('\n1️⃣ Testing API key validity...');
    const accountResponse = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });

    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('✅ API key is valid!');
      console.log('📊 Account info:', {
        email: accountData.email,
        firstName: accountData.firstName,
        lastName: accountData.lastName
      });
    } else {
      console.log('❌ API key validation failed:', accountResponse.status);
      const errorText = await accountResponse.text();
      console.log('Error details:', errorText);
      return;
    }

    // Test 2: Send a simple test email
    console.log('\n2️⃣ Sending test email...');
    const testEmailData = {
      sender: { 
        name: "Charmntreats Test", 
        email: "charmntreats@gmail.com" 
      },
      to: [{ 
        email: "charmntreats@gmail.com", // Send to store email for testing
        name: "Test Recipient"
      }],
      subject: "🧪 Brevo API Test - " + new Date().toLocaleString(),
      htmlContent: `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f59e42;">🧪 Brevo API Test</h2>
          <p>This is a test email to verify that the Brevo API is working correctly.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Test Details:</strong><br>
            Time: ${new Date().toLocaleString()}<br>
            API Key: ${BREVO_API_KEY.substring(0, 20)}...<br>
            Status: ✅ Working
          </div>
          <p>If you received this email, the Brevo API integration is working correctly!</p>
          <hr>
          <small style="color: #666;">This is an automated test from Charmntreats order system.</small>
        </body>
        </html>
      `
    };

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(testEmailData)
    });

    if (emailResponse.ok) {
      const result = await emailResponse.json();
      console.log('✅ Test email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('🎉 Brevo API is working correctly!');
    } else {
      console.log('❌ Test email failed:', emailResponse.status);
      const errorText = await emailResponse.text();
      console.log('Error details:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testBrevoAPI();