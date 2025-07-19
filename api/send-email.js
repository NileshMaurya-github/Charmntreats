// Generic email sending API endpoint
const SibApiV3Sdk = require('sib-api-v3-sdk');

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY || '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';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, htmlContent, textContent } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, htmlContent' });
    }

    console.log('📧 Sending generic email via Brevo API:', { to, subject });

    // Configure API key
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = BREVO_API_KEY;

    // Create API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Prepare email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "Charmntreats",
      email: "charmntreats@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    
    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    // Send email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Generic email sent successfully!', result.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending generic email:', error);
    
    // Handle specific Brevo errors
    let errorMessage = 'Failed to send email';
    if (error.response && error.response.text) {
      try {
        const errorData = JSON.parse(error.response.text);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = error.response.text;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
}