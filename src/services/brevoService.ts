// Brevo (formerly Sendinblue) Email Service
// Using fetch API instead of deprecated SDK

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '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';
const BREVO_API_URL = 'https://api.brevo.com/v3';

interface EmailData {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: { email: string; name: string };
}

interface SMSData {
  recipient: string;
  content: string;
  sender?: string;
}

class BrevoService {
  private apiKey: string;
  private defaultSender: { email: string; name: string };

  constructor() {
    this.apiKey = BREVO_API_KEY;
    this.defaultSender = {
      email: import.meta.env.VITE_BREVO_SMTP_EMAIL || '9258ee001@smtp-brevo.com',
      name: 'Charmntreats'
    };
  }

  // Send transactional email
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Sending email via Brevo API to:', emailData.to[0].email);
      console.log('📧 Subject:', emailData.subject);

      const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          sender: emailData.sender || this.defaultSender,
          to: emailData.to,
          subject: emailData.subject,
          htmlContent: emailData.htmlContent,
          textContent: emailData.textContent || this.stripHtml(emailData.htmlContent)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo email error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via Brevo!', result);
      return true;
    } catch (error) {
      console.error('❌ Error sending email via Brevo:', error);
      return false;
    }
  }

  // Send SMS (if SMS credits available)
  async sendSMS(smsData: SMSData): Promise<boolean> {
    try {
      const response = await fetch(`${BREVO_API_URL}/transactionalSMS/sms`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          type: 'transactional',
          content: smsData.content,
          recipient: smsData.recipient,
          sender: smsData.sender || 'Charmntreats'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo SMS error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('SMS sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  // Send OTP via email - Enhanced with better error handling
  async sendOTPEmail(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    console.log('🔐 Sending OTP email:', { email, otp, type });
    
    // Use direct API call with enhanced error handling
    return await this.sendOTPEmailDirect(email, otp, type);
  }

  // Fallback direct API call method
  private async sendOTPEmailDirect(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    const subject = type === 'signup' 
      ? 'Verify Your Email - Charmntreats' 
      : 'Password Reset Code - Charmntreats';

    const htmlContent = this.getOTPEmailTemplate(otp, type);

    console.log('🔐 Sending OTP email via direct API:', { email, otp, type, subject });

    const result = await this.sendEmail({
      to: [{ email }],
      subject,
      htmlContent
    });

    console.log('🔐 Direct API email send result:', result);
    return result;
  }

  // Send welcome email after successful signup
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = 'Welcome to Charmntreats! 🎉';
    const htmlContent = this.getWelcomeEmailTemplate(name);

    return await this.sendEmail({
      to: [{ email, name }],
      subject,
      htmlContent
    });
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(
    email: string, 
    name: string, 
    orderNumber: string, 
    orderDetails: any
  ): Promise<boolean> {
    const subject = `Order Confirmation #${orderNumber} - Charmntreats`;
    const htmlContent = this.getOrderConfirmationTemplate(name, orderNumber, orderDetails);

    return await this.sendEmail({
      to: [{ email, name }],
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

  // Utility function to strip HTML tags
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Email templates
  private getOTPEmailTemplate(otp: string, type: 'signup' | 'reset'): string {
    const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const message = type === 'signup' 
      ? 'Thank you for signing up with Charmntreats! Please use the following code to verify your email address:'
      : 'You requested to reset your password. Please use the following code to proceed:';

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

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Charmntreats</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Charmntreats! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="margin-bottom: 20px;">
            Thank you for joining the Charmntreats family! We're excited to have you discover our collection of handcrafted treasures.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #f59e42; margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Explore our unique handcrafted products</li>
              <li>Follow your orders and track deliveries</li>
              <li>Get exclusive offers and early access to new collections</li>
              <li>Join our community of craft lovers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}" style="background: #f59e42; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping</a>
          </div>
          
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

  private getOrderConfirmationTemplate(name: string, orderNumber: string, orderDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e42 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 📦</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Charmntreats</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank you, ${name}!</h2>
          <p style="margin-bottom: 20px;">
            Your order has been confirmed and is being prepared with care.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #f59e42; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            We'll send you another email when your order ships. Thank you for choosing Charmntreats!
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
}

export const brevoService = new BrevoService();
export default brevoService;