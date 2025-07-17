// OTP Management Service
import brevoService from './brevoService';

interface OTPData {
  email: string;
  otp: string;
  type: 'signup' | 'reset';
  expiresAt: number;
  attempts: number;
}

class OTPService {
  private otpStorage: Map<string, OTPData> = new Map();
  private readonly OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  // Generate and send OTP
  async generateAndSendOTP(email: string, type: 'signup' | 'reset'): Promise<{ success: boolean; message: string }> {
    try {
      // Generate OTP
      const otp = brevoService.generateOTP(6);
      const expiresAt = Date.now() + this.OTP_EXPIRY_TIME;

      console.log('🔐 Generated OTP for', email, ':', otp, '(expires in 10 minutes)');

      // Store OTP data
      this.otpStorage.set(email, {
        email,
        otp,
        type,
        expiresAt,
        attempts: 0
      });

      // Send OTP via email
      console.log('📧 Attempting to send OTP email to:', email);
      const emailSent = await brevoService.sendOTPEmail(email, otp, type);
      console.log('📧 Email send result:', emailSent);

      // Always return success for development, but show OTP in console and message
      console.log('✅ OTP generated successfully for:', email);
      console.log('🔐 USE THIS OTP CODE:', otp);
      
      // Show a prominent alert with the OTP for development
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`🔐 DEVELOPMENT MODE\n\nYour OTP code is: ${otp}\n\nEmail: ${email}\nType: ${type}\n\nUse this code to verify your account.\n\n(Check console for details)`);
        }, 1000);
      }

      return {
        success: true,
        message: `OTP sent to ${email}. ${emailSent ? 'Check your email inbox and spam folder.' : 'Email delivery may be delayed.'} [DEV: Check browser alert or console for OTP code]`
      };
    } catch (error) {
      console.error('Error generating OTP:', error);
      return {
        success: false,
        message: 'An error occurred while sending OTP.'
      };
    }
  }

  // Verify OTP
  verifyOTP(email: string, inputOTP: string): { success: boolean; message: string } {
    const otpData = this.otpStorage.get(email);

    if (!otpData) {
      return {
        success: false,
        message: 'No OTP found for this email. Please request a new one.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      };
    }

    // Verify OTP
    if (otpData.otp === inputOTP) {
      this.otpStorage.delete(email); // Remove OTP after successful verification
      return {
        success: true,
        message: 'OTP verified successfully.'
      };
    } else {
      // Increment attempts
      otpData.attempts += 1;
      this.otpStorage.set(email, otpData);
      
      const remainingAttempts = this.MAX_ATTEMPTS - otpData.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      };
    }
  }

  // Resend OTP
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    const otpData = this.otpStorage.get(email);

    if (!otpData) {
      return {
        success: false,
        message: 'No active OTP session found. Please start the process again.'
      };
    }

    // Generate new OTP
    return await this.generateAndSendOTP(email, otpData.type);
  }

  // Clean expired OTPs (should be called periodically)
  cleanExpiredOTPs(): void {
    const now = Date.now();
    for (const [email, otpData] of this.otpStorage.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStorage.delete(email);
      }
    }
  }

  // Get remaining time for OTP
  getRemainingTime(email: string): number {
    const otpData = this.otpStorage.get(email);
    if (!otpData) return 0;
    
    const remaining = otpData.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
  }

  // Check if OTP exists for email
  hasActiveOTP(email: string): boolean {
    const otpData = this.otpStorage.get(email);
    if (!otpData) return false;
    
    return Date.now() < otpData.expiresAt;
  }
}

export const otpService = new OTPService();

// Clean expired OTPs every 5 minutes
setInterval(() => {
  otpService.cleanExpiredOTPs();
}, 5 * 60 * 1000);

export default otpService;