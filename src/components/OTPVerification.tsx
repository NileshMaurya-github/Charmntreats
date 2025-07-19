import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Clock, RefreshCw } from 'lucide-react';
import otpService from '@/services/otpService';

interface OTPVerificationProps {
  email: string;
  type: 'signup' | 'reset';
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  type,
  onVerificationSuccess,
  onCancel
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Update remaining time every second
    const interval = setInterval(() => {
      const time = otpService.getRemainingTime(email);
      setRemainingTime(time);
      
      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [email]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = otpService.verifyOTP(email, otp);
      
      if (result.success) {
        toast({
          title: "Verification Successful",
          description: result.message,
        });
        onVerificationSuccess();
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
        setOtp(''); // Clear OTP input on failure
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const result = await otpService.resendOTP(email);
      
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: result.message,
        });
        setRemainingTime(600); // Reset to 10 minutes
      } else {
        toast({
          title: "Resend Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      toast({
        title: "Email Issue",
        description: "Failed to resend OTP. Please check your email or contact support at charmntreats@gmail.com if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const title = type === 'signup' ? 'Verify Your Email' : 'Verify Reset Code';
  const description = type === 'signup' 
    ? 'We sent a verification code to your email address.'
    : 'We sent a password reset code to your email address.';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <Mail className="h-6 w-6 text-amber-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">{title}</CardTitle>
        <CardDescription className="text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-sm text-slate-600 mb-1">Code sent to:</p>
          <p className="font-medium text-slate-800">{email}</p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter 6-digit verification code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-center text-lg font-mono tracking-widest"
              maxLength={6}
              disabled={loading}
              required
            />
          </div>

          {remainingTime > 0 && (
            <div className="flex items-center justify-center text-sm text-slate-600">
              <Clock className="h-4 w-4 mr-1" />
              Code expires in {formatTime(remainingTime)}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOTP}
              disabled={resendLoading || remainingTime > 540} // Allow resend after 1 minute
              className="text-amber-600 hover:text-amber-700"
            >
              {resendLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          Didn't receive the code? Check your spam folder or try resending.
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;