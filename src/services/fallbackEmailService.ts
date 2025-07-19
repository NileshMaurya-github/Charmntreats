// Fallback Email Service - Uses multiple methods to ensure email delivery
interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

class FallbackEmailService {
  private BREVO_API_KEY = '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';

  // Send email with multiple fallback methods
  async sendEmail(emailData: EmailData): Promise<boolean> {
    console.log('📧 Starting email send with fallbacks...');
    
    // Method 1: Try server-side API endpoint
    try {
      console.log('🔄 Trying server-side endpoint...');
      const serverResult = await this.sendViaServerEndpoint(emailData);
      if (serverResult) {
        console.log('✅ Email sent via server endpoint!');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Server endpoint failed:', error.message);
    }

    // Method 2: Try direct Brevo API
    try {
      console.log('🔄 Trying direct Brevo API...');
      const directResult = await this.sendViaDirectAPI(emailData);
      if (directResult) {
        console.log('✅ Email sent via direct API!');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Direct API failed:', error.message);
    }

    // Method 3: Try alternative email service (if configured)
    try {
      console.log('🔄 Trying alternative service...');
      const altResult = await this.sendViaAlternativeService(emailData);
      if (altResult) {
        console.log('✅ Email sent via alternative service!');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Alternative service failed:', error.message);
    }

    console.error('❌ All email methods failed');
    return false;
  }

  // Method 1: Server-side endpoint
  private async sendViaServerEndpoint(emailData: EmailData): Promise<boolean> {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      const result = await response.json();
      return result.success;
    }
    
    throw new Error(`Server endpoint failed: ${response.status}`);
  }

  // Method 2: Direct Brevo API
  private async sendViaDirectAPI(emailData: EmailData): Promise<boolean> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': this.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "Charmntreats", 
          email: "charmntreats@gmail.com" 
        },
        to: [{ email: emailData.to }],
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        textContent: emailData.textContent || this.stripHtml(emailData.htmlContent)
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Direct API Message ID:', result.messageId);
      return true;
    }
    
    const errorText = await response.text();
    throw new Error(`Direct API failed: ${response.status} - ${errorText}`);
  }

  // Method 3: Alternative service (placeholder for future implementation)
  private async sendViaAlternativeService(emailData: EmailData): Promise<boolean> {
    // This could be implemented with services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with Gmail
    
    console.log('⚠️ Alternative service not configured');
    return false;
  }

  // Send OTP email
  async sendOTPEmail(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    const subject = type === 'signup' 
      ? 'Verify Your Email - Charmntreats' 
      : 'Password Reset Code - Charmntreats';

    const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const message = type === 'signup' 
      ? 'Thank you for signing up with Charmntreats! Please use the following code to verify your email address:'
      : 'You requested to reset your password. Please use the following code to proceed:';

    const htmlContent = this.getOTPEmailTemplate(otp, type, title, message);

    return await this.sendEmail({
      to: email,
      subject,
      htmlContent
    });
  }

  // Generate OTP
  generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  // Email template for OTP
  private getOTPEmailTemplate(otp: string, type: 'signup' | 'reset', title: string, message: string): string {
    return `
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
  }

  // Utility function to strip HTML tags
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}

export const fallbackEmailService = new FallbackEmailService();
export default fallbackEmailService;