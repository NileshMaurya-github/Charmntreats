// Enhanced Brevo Email Service with Fallback Support
import fallbackEmailService from './fallbackEmailService';

interface OTPEmailRequest {
  email: string;
  otp: string;
  type: 'signup' | 'reset';
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class BrevoService {
  private serverEndpoint: string;

  constructor() {
    // Use server-side endpoint for production, fallback to direct API for development
    this.serverEndpoint = '/api/send-otp';
  }

  // Send OTP with enhanced fallback support
  async sendOTPEmail(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    console.log('🔐 Starting OTP email send process:', { email, otp: otp.substring(0, 2) + '****', type });

    // Try the fallback email service first (it has multiple methods)
    try {
      console.log('🔄 Using enhanced fallback email service...');
      const fallbackResult = await fallbackEmailService.sendOTPEmail(email, otp, type);
      if (fallbackResult) {
        console.log('✅ OTP email sent successfully via fallback service!');
        return true;
      }
    } catch (error) {
      console.error('❌ Fallback service error:', error);
    }

    // If fallback fails, try the original server endpoint
    try {
      console.log('🔄 Trying original server endpoint...');
      const response = await fetch(this.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          type
        })
      });

      if (response.ok) {
        const result: EmailResponse = await response.json();
        if (result.success) {
          console.log('✅ OTP email sent successfully via server endpoint!');
          console.log('📧 Message ID:', result.messageId);
          return true;
        }
      }
    } catch (error) {
      console.error('❌ Server endpoint error:', error);
    }

    // Final fallback to direct API
    console.log('🔄 Final fallback to direct API...');
    return await this.sendOTPEmailDirect(email, otp, type);
  }

  // Send welcome email
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const response = await fetch('/api/send-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name
        })
      });

      if (!response.ok) {
        console.error('❌ Welcome email failed:', response.status);
        return false;
      }

      const result = await response.json();
      console.log('✅ Welcome email sent successfully!');
      return result.success;

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }
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

  // Fallback: Direct API call (for development/testing only)
  async sendOTPEmailDirect(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    const BREVO_API_KEY = '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';
    
    try {
      console.log('🔐 Sending OTP email via direct API (fallback):', { email, otp, type });

      const subject = type === 'signup' 
        ? 'Verify Your Email - Charmntreats' 
        : 'Password Reset Code - Charmntreats';

      const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
      const message = type === 'signup' 
        ? 'Thank you for signing up with Charmntreats! Please use the following code to verify your email address:'
        : 'You requested to reset your password. Please use the following code to proceed:';

      const htmlContent = this.getOTPEmailTemplate(otp, type, title, message);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { 
            name: "Charmntreats", 
            email: "charmntreats@gmail.com" 
          },
          to: [{ email }],
          subject,
          htmlContent,
          textContent: this.stripHtml(htmlContent)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Brevo API error:', errorText);
        return false;
      }

      const result = await response.json();
      console.log('✅ Direct API email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      return true;

    } catch (error) {
      console.error('❌ Direct API error:', error);
      return false;
    }
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
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">Need Help?</h3>
            <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">Our customer support team is here to help you</p>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
              <a href="mailto:charmntreats@gmail.com" style="background: #f59e42; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                📧 Email Support
              </a>
              <a href="tel:+917355451081" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                📞 Call Us
              </a>
              <a href="https://www.charmntreats.in" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                🛍️ Continue Shopping
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 Charmntreats. All rights reserved.<br>
              Handcrafted treasures for your special moments.<br>
              <a href="mailto:charmntreats@gmail.com" style="color: #f59e42; text-decoration: none;">charmntreats@gmail.com</a> | 
              <a href="tel:+917355451081" style="color: #f59e42; text-decoration: none;">+91 7355451081</a>
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

export const brevoService = new BrevoService();
export default brevoService;