import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // Success handled in signIn
    } catch (error: any) {
      // Error handled in signIn
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      // Success handled in signUp
    } catch (error: any) {
      // Error handled in signUp
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden font-sans selection:bg-pink-100">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-pink-100 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-100 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl relative z-10 animate-fade-in hover:border-pink-200 transition-all duration-500 shadow-slate-200/50">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-200 transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-700 text-lg">
            Your destination for handcrafted art & gifts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-700 font-bold transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-700 font-bold transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6 animate-slide-up">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-900 font-bold ml-1">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-hover:text-pink-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      className="pl-12 bg-slate-50 border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-900 font-bold ml-1">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs text-pink-600 hover:text-pink-700 font-bold">
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-hover:text-pink-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 bg-slate-50 border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6 animate-slide-up">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-900 font-bold ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-hover:text-pink-500 transition-colors" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="pl-12 bg-slate-50 border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl transition-all duration-200"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-900 font-bold ml-1">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-hover:text-pink-500 transition-colors" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="hello@example.com"
                      className="pl-12 bg-slate-50 border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-900 font-bold ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-hover:text-pink-500 transition-colors" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-12 bg-slate-50 border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-700 pl-1">Must be at least 6 characters long</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
