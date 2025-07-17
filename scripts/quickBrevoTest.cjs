// Quick test to verify Brevo API is working
const https = require('https');

function testBrevoAPI() {
  const BREVO_API_KEY = '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';
  
  const emailData = JSON.stringify({
    sender: { 
      name: "Charmntreats Test", 
      email: "charmntreats@gmail.com" 
    },
    to: [{ 
      email: "charmntreats@gmail.com",
      name: "Test Recipient"
    }],
    subject: "🧪 Quick Brevo Test - " + new Date().toLocaleString(),
    htmlContent: `
      <h2 style="color: #f59e42;">🧪 Brevo API Test</h2>
      <p>This is a quick test to verify Brevo API is working.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Status:</strong> ✅ API Working</p>
    `
  });

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
      'Content-Length': Buffer.byteLength(emailData)
    }
  };

  console.log('🧪 Testing Brevo API...');

  const req = https.request(options, (res) => {
    console.log('📊 Response Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 201) {
        const result = JSON.parse(data);
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', result.messageId);
        console.log('🎉 Brevo API is working correctly!');
      } else {
        console.log('❌ Email failed:', res.statusCode);
        console.log('Error:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.write(emailData);
  req.end();
}

testBrevoAPI();