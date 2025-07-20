import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ForgotPasswordDialog from '@/components/ForgotPasswordDialog';
import OTPVerification from '@/components/OTPVerification';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import otpService from '@/services/otpService';
import brevoService from '@/services/brevoService';
import customerDataService from '@/services/customerDataService';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState<'signup' | 'reset'>('signup');
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Check for password reset flow
  useEffect(() => {
    const isReset = searchParams.get('reset');
    const isVerified = searchParams.get('verified');
    
    if (isReset && isVerified) {
      // Handle OTP-verified password reset with a delay to ensure session is established
      setTimeout(() => {
        handlePasswordResetCompletion();
      }, 1000);
    } else if (isReset) {
      toast({
        title: "Password Reset",
        description: "You can now enter your new password.",
      });
    }
  }, [searchParams, toast]);

  const handlePasswordResetCompletion = async () => {
    try {
      // Get the stored password reset data
      const currentReset = sessionStorage.getItem('current_password_reset');
      
      if (!currentReset) {
        // Check localStorage as fallback
        const allKeys = Object.keys(localStorage);
        const resetKey = allKeys.find(key => key.startsWith('verified_password_reset_'));
        
        if (!resetKey) {
          toast({
            title: "Password Reset Error",
            description: "No verified password reset found. Please try the reset process again.",
            variant: "destructive",
          });
          return;
        }
        
        const resetData = JSON.parse(localStorage.getItem(resetKey) || '{}');
        
        if (!resetData.newPassword || !resetData.otpVerified) {
          toast({
            title: "Password Reset Error",
            description: "Invalid reset data. Please try the reset process again.",
            variant: "destructive",
          });
          return;
        }
        
        // Check if we have an active session from the reset link
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated via the reset link, we can update the password
          const { error } = await supabase.auth.updateUser({
            password: resetData.newPassword
          });
          
          if (error) {
            console.error('Password update error:', error);
            toast({
              title: "Password Update Failed",
              description: "Failed to update password. Please try again.",
              variant: "destructive",
            });
            return;
          }
        } else {
          // No active session, the reset link might have expired or not been clicked
          toast({
            title: "Session Required",
            description: "Please click the reset link in your email first, then return here.",
            variant: "destructive",
          });
          return;
        }
        
        // Clean up stored data
        localStorage.removeItem(resetKey);
        sessionStorage.removeItem('current_password_reset');
        
        // Auto-fill login form with the email and new password
        setLoginData({
          email: resetData.email,
          password: resetData.newPassword
        });
        
        toast({
          title: "🎉 Password Reset Successful!",
          description: "Your password has been updated successfully. You can now sign in with your new password.",
        });
        
        // Show additional success message
        setTimeout(() => {
          toast({
            title: "✅ Ready to Sign In",
            description: "Your login credentials are filled in below. Just click 'Sign In'!",
            duration: 8000,
          });
        }, 2000);
        
        return;
      }
      
      const resetData = JSON.parse(currentReset);
      
      if (!resetData.newPassword || !resetData.otpVerified) {
        toast({
          title: "Password Reset Error",
          description: "Invalid reset data. Please try the reset process again.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if we have an active session from the reset link
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is authenticated via the reset link, we can update the password
        const { error } = await supabase.auth.updateUser({
          password: resetData.newPassword
        });
        
        if (error) {
          console.error('Password update error:', error);
          toast({
            title: "Password Update Failed",
            description: "Failed to update password. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // No active session, the reset link might have expired or not been clicked
        toast({
          title: "Session Required",
          description: "Please click the reset link in your email first, then return here.",
          variant: "destructive",
        });
        return;
      }
      
      // Clean up stored data
      sessionStorage.removeItem('current_password_reset');
      const resetKey = `verified_password_reset_${resetData.email}`;
      localStorage.removeItem(resetKey);
      
      // Auto-fill login form with the email and new password
      setLoginData({
        email: resetData.email,
        password: resetData.newPassword
      });
      
      toast({
        title: "🎉 Password Reset Successful!",
        description: "Your password has been updated successfully. You can now sign in with your new password.",
      });
      
      // Show additional success message
      setTimeout(() => {
        toast({
          title: "✅ Ready to Sign In",
          description: "Your login credentials are filled in below. Just click 'Sign In'!",
          duration: 8000,
        });
      }, 2000);
      
    } catch (error) {
      console.error('Password reset completion error:', error);
      toast({
        title: "Password Reset Error",
        description: "An error occurred while completing the password reset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Hardcoded admin login
      if (
        loginData.email === 'nileshmaurya2020@gmail.com' &&
        loginData.password === 'Dn@#112233'
      ) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUser', JSON.stringify({
          id: 'admin-local',
          email: 'nileshmaurya2020@gmail.com',
          role: 'admin'
        }));
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        
        // Small delay to show the toast
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 1000);
        
        setLoading(false);
        return;
      }
      
      // Check if there's an active password override for this email (from OTP-verified reset)
      const passwordOverride = localStorage.getItem(`password_override_${loginData.email}`);
      const currentOverride = localStorage.getItem('current_password_override');
      
      if (passwordOverride || currentOverride) {
        const overrideData = passwordOverride ? JSON.parse(passwordOverride) : JSON.parse(currentOverride);
        
        // Check if the override is still valid and matches the login attempt
        if (overrideData.email === loginData.email && 
            overrideData.newPassword === loginData.password && 
            overrideData.otpVerified && 
            overrideData.status === 'immediate_use' &&
            Date.now() < overrideData.expiresAt) {
          
          console.log('🔐 User attempting login with OTP-verified password override');
          
          // Since we've verified their identity via OTP, we'll allow immediate login
          // This bypasses Supabase's password check for OTP-verified users
          try {
            // First, try to login with the new password (in case Supabase was updated)
            const { data: signInData, error: signInError } = await signIn(loginData.email, loginData.password);
            
            if (!signInError && signInData?.user) {
              // Success! Login worked with the new password in Supabase
              console.log('✅ Login successful - password was updated in Supabase');
              
              // Clean up the password override
              localStorage.removeItem(`password_override_${loginData.email}`);
              localStorage.removeItem('current_password_override');
              
              await customerDataService.trackLogin({
                user_id: signInData.user.id,
                email: loginData.email,
                login_method: 'email_password_after_otp_reset',
                success: true
              });

              toast({
                title: "🎉 Login Successful!",
                description: "Welcome back! Your password reset was successful.",
              });
              navigate('/', { replace: true });
              setLoading(false);
              return;
            }
            
            // If Supabase login failed, we'll create a temporary session since OTP was verified
            console.log('🔄 Supabase login failed, but OTP was verified - allowing temporary access');
            
            // Create a temporary user session for OTP-verified users
            const tempUser = {
              id: `temp_${Date.now()}`,
              email: loginData.email,
              user_metadata: {
                full_name: 'User',
                email_verified: true,
                otp_verified: true
              }
            };
            
            // Store temporary session
            localStorage.setItem('temp_user_session', JSON.stringify({
              user: tempUser,
              email: loginData.email,
              timestamp: Date.now(),
              otpVerified: true,
              expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));
            
            // Clean up the password override
            localStorage.removeItem(`password_override_${loginData.email}`);
            localStorage.removeItem('current_password_override');
            
            await customerDataService.trackLogin({
              user_id: tempUser.id,
              email: loginData.email,
              login_method: 'otp_verified_temporary_session',
              success: true
            });

            toast({
              title: "🎉 Login Successful!",
              description: "Welcome! You're logged in with your OTP-verified credentials.",
            });
            
            // Navigate to home page
            navigate('/', { replace: true });
            setLoading(false);
            return;
            
          } catch (error) {
            console.error('Password override login failed:', error);
            
            toast({
              title: "⚠️ Login Issue",
              description: "Your password was verified via OTP, but there's a technical issue. Please try again.",
              variant: "destructive",
              duration: 10000,
            });
            
            setLoading(false);
            return;
          }
        } else if (Date.now() >= overrideData.expiresAt) {
          // Override has expired
          localStorage.removeItem(`password_override_${loginData.email}`);
          localStorage.removeItem('current_password_override');
          
          toast({
            title: "Password Override Expired",
            description: "Your password reset has expired. Please use 'Forgot Password?' again.",
            variant: "destructive",
          });
          
          setLoading(false);
          return;
        }
      }
      
      // Regular user login
      const { data, error } = await signIn(loginData.email, loginData.password);
      if (!error && data?.user) {
        // Track successful login for admin dashboard
        await customerDataService.trackLogin({
          user_id: data.user.id,
          email: loginData.email,
          login_method: 'email_password',
          success: true
        });

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/', { replace: true });
      } else {
        // Track failed login attempt
        await customerDataService.trackLogin({
          email: loginData.email,
          login_method: 'email_password',
          success: false
        });

        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Validate mobile number
    if (!signupData.mobile || signupData.mobile.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid mobile number (at least 10 digits).",
        variant: "destructive",
      });
      return;
    }

    // Clean mobile number (remove spaces, dashes, etc.)
    const cleanMobile = signupData.mobile.replace(/[^\d]/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number should be between 10-15 digits.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Send OTP for email verification
      const otpResult = await otpService.generateAndSendOTP(signupData.email, 'signup');
      
      if (otpResult.success) {
        // Store signup data for later use after OTP verification
        setPendingSignupData(signupData);
        setOtpEmail(signupData.email);
        setOtpType('signup');
        setShowOTPVerification(true);
        
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
      } else {
        toast({
          title: "Failed to Send Code",
          description: otpResult.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Signup Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = async () => {
    if (!pendingSignupData) return;
    
    setLoading(true);
    
    try {
      // Since we've already verified the email via OTP, we'll create the account
      // and then immediately sign them in to bypass the email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: pendingSignupData.email,
        password: pendingSignupData.password,
        options: {
          data: {
            full_name: pendingSignupData.fullName,
            email_verified: true
          }
        }
      });
      
      if (!error && data.user) {
        // Store customer data for admin dashboard using our service
        await customerDataService.storeCustomerData({
          user_id: data.user.id,
          email: pendingSignupData.email,
          full_name: pendingSignupData.fullName,
          mobile: pendingSignupData.mobile,
          signup_date: new Date().toISOString(),
          email_verified: true,
          signup_method: 'email_otp'
        });
        
        // Send welcome email via Brevo
        await brevoService.sendWelcomeEmail(
          pendingSignupData.email, 
          pendingSignupData.fullName
        );
        
        toast({
          title: "🎉 Account Created Successfully!",
          description: "Your email has been verified and account is ready! You can now sign in immediately.",
        });
        
        // Clear form and hide OTP verification
        setSignupData({
          fullName: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: ''
        });
        setPendingSignupData(null);
        setShowOTPVerification(false);
        
        // Auto-fill login form with the email and password for convenience
        setLoginData({
          email: pendingSignupData.email,
          password: pendingSignupData.password
        });
        
        // Show helpful message
        setTimeout(() => {
          toast({
            title: "✅ Ready to Sign In!",
            description: "Your credentials are filled in below. Just click 'Sign In' to access your account!",
            duration: 8000,
          });
        }, 2000);
        
      } else {
        toast({
          title: "Account Creation Failed",
          description: error?.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Account creation error:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPCancel = () => {
    setShowOTPVerification(false);
    setPendingSignupData(null);
    setOtpEmail('');
  };

  return (
    <div className="min-h-screen bg-floral-gradient page-transition">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Welcome to <span className="text-amber-600">Charmntreats</span>
              </CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            
            <CardContent>


              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Enter your email"
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          disabled={loading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-amber-600"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full btn-dark-pink"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="Enter your email"
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-mobile">Mobile Number</Label>
                      <Input
                        id="signup-mobile"
                        type="tel"
                        value={signupData.mobile}
                        onChange={(e) => {
                          // Allow only numbers, spaces, dashes, and plus sign
                          const value = e.target.value.replace(/[^\d\s\-\+]/g, '');
                          setSignupData({ ...signupData, mobile: value });
                        }}
                        placeholder="Enter your mobile number (e.g., +91 9876543210)"
                        disabled={loading}
                        required
                        maxLength={15}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code if international (e.g., +91 for India)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Create a password"
                          disabled={loading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                          disabled={loading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full btn-dark-pink"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ForgotPasswordDialog 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <OTPVerification
            email={otpEmail}
            type={otpType}
            onVerificationSuccess={handleOTPVerificationSuccess}
            onCancel={handleOTPCancel}
          />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Auth;
