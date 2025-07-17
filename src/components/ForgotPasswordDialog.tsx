
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import otpService from '@/services/otpService';
import OTPVerification from './OTPVerification';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Send OTP for password reset
      const otpResult = await otpService.generateAndSendOTP(email, 'reset');
      
      if (otpResult.success) {
        setStep('otp');
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the password reset code.",
        });
      } else {
        toast({
          title: "Failed to Send Code",
          description: otpResult.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = () => {
    setStep('newPassword');
    toast({
      title: "Code Verified",
      description: "Please enter your new password.",
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // For demo purposes, we'll just show success
      // In a real app, you'd update the password in your database
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      });
      
      // Reset form and close dialog
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('email');
      onClose();
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('email');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'otp' && 'Verify Reset Code'}
            {step === 'newPassword' && 'Set New Password'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'email' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <OTPVerification
              email={email}
              type="reset"
              onVerificationSuccess={handleOTPVerificationSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
