// Test Brevo API connection
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BREVO_API_KEY = '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'; // Your correct API key
const BREVO_API_URL = 'https://api.brevo.com/v3';

async function testBrevoConnection() {
  console.log('Testing Brevo API connection...');
  console.log('API Key:', BREVO_API_KEY);
  
  try {
    // Test API connection by getting account info
    const response = await fetch(`${BREVO_API_URL}/account`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('✓ Brevo API connection successful!');
    console.log('Account info:', result);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

async function testSendEmail() {
  console.log('\nTesting email sending...');
  
  try {
    const emailData = {
      sender: { email: '9258ee001@smtp-brevo.com', name: 'Charmntreats' },
      to: [{ email: 'test@example.com', name: 'Test User' }],
      subject: 'Test Email from Charmntreats',
      htmlContent: '<h1>Test Email</h1><p>This is a test email from Charmntreats.</p>',
      textContent: 'Test Email - This is a test email from Charmntreats.'
    };

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    console.log('Email response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email sending error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('✓ Email sending test successful!');
    console.log('Email result:', result);
    return true;
  } catch (error) {
    console.error('Email test failed:', error);
    return false;
  }
}

async function runTests() {
  const connectionOk = await testBrevoConnection();
  
  if (connectionOk) {
    await testSendEmail();
  } else {
    console.log('❌ Cannot test email sending - API connection failed');
    console.log('\nPossible issues:');
    console.log('1. API key is incorrect or incomplete');
    console.log('2. API key doesn\'t have email sending permissions');
    console.log('3. Network connectivity issues');
    console.log('4. Brevo account is not properly configured');
  }
}

runTests();