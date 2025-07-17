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
    if (isReset) {
      toast({
        title: "Password Reset",
        description: "You can now enter your new password.",
      });
    }
  }, [searchParams, toast]);

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
      
      // Regular user login
      const { error } = await signIn(loginData.email, loginData.password);
      if (!error) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/', { replace: true });
      } else {
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
      // Now create the actual user account
      const { error } = await signUp(
        pendingSignupData.email, 
        pendingSignupData.password, 
        pendingSignupData.fullName
      );
      
      if (!error) {
        // Send welcome email
        await brevoService.sendWelcomeEmail(
          pendingSignupData.email, 
          pendingSignupData.fullName
        );
        
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Charmntreats! You can now sign in.",
        });
        
        // Clear form and hide OTP verification
        setSignupData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setPendingSignupData(null);
        setShowOTPVerification(false);
        
        // Auto-fill login form
        setLoginData({
          email: pendingSignupData.email,
          password: ''
        });
      } else {
        toast({
          title: "Account Creation Failed",
          description: "Failed to create account. Please try again.",
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
    <div className="min-h-screen bg-slate-50">
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
                      className="w-full bg-amber-600 hover:bg-amber-700"
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
                      className="w-full bg-amber-600 hover:bg-amber-700"
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
