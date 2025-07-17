// Send a test OTP email to verify Brevo is working
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BREVO_API_KEY = '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';
const BREVO_API_URL = 'https://api.brevo.com/v3';

async function sendTestOTP() {
  const testEmail = 'nileshmaurya59@gmail.com'; // Your email
  const testOTP = '123456';
  
  console.log('🧪 Sending test OTP email to:', testEmail);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test OTP - Charmntreats</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f59e42; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Charmntreats - Test OTP</h1>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2>Test OTP Email</h2>
        <p>This is a test email to verify Brevo integration is working.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <p style="margin: 0 0 10px 0;">Your test OTP code is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #f59e42; letter-spacing: 8px;">${testOTP}</div>
        </div>
        
        <p>If you received this email, Brevo integration is working correctly!</p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { email: '9258ee001@smtp-brevo.com', name: 'Charmntreats' },
        to: [{ email: testEmail, name: 'Test User' }],
        subject: 'Test OTP - Charmntreats Integration',
        htmlContent: htmlContent,
        textContent: `Test OTP from Charmntreats: ${testOTP}`
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Email sending failed:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('📧 Check your email (including spam folder) for the test OTP!');
    return true;
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return false;
  }
}

sendTestOTP();