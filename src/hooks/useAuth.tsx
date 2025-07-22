import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import permanentCustomerService from '@/services/permanentCustomerService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for localStorage admin login on mount
    if (localStorage.getItem('isAdmin') === 'true') {
      const adminUserData = localStorage.getItem('adminUser');
      let adminUser;
      
      try {
        adminUser = adminUserData ? JSON.parse(adminUserData) : null;
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminUser');
        setLoading(false);
        return;
      }
      
      setUser({
        id: 'admin-local',
        email: 'nileshmaurya2020@gmail.com',
        user_metadata: { role: 'admin', full_name: 'Admin User' },
        app_metadata: { provider: 'local' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Check for temporary user session (from OTP-verified password reset)
    const tempSession = localStorage.getItem('temp_user_session');
    if (tempSession) {
      try {
        const sessionData = JSON.parse(tempSession);
        
        // Check if session is still valid
        if (Date.now() < sessionData.expiresAt && sessionData.otpVerified) {
          console.log('🔐 Loading temporary OTP-verified user session');
          
          setUser({
            id: sessionData.user.id,
            email: sessionData.user.email,
            user_metadata: sessionData.user.user_metadata,
            app_metadata: { provider: 'otp_verified' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as any);
          setLoading(false);
          return;
        } else {
          // Session expired, clean up
          localStorage.removeItem('temp_user_session');
        }
      } catch (error) {
        console.error('Error parsing temp user session:', error);
        localStorage.removeItem('temp_user_session');
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Check for localStorage admin flag
        if (localStorage.getItem('isAdmin') === 'true') {
          setIsAdmin(true);
        } else if (session?.user) {
          // Check if user is admin in Supabase
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('role', 'admin')
                .single();
              setIsAdmin(!!data);
            } catch (error) {
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      // Ensure loading is set to false even if there's an error
      setLoading(false);
    });

    // Fallback to ensure loading is never stuck
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Track failed login attempt
        await permanentCustomerService.trackLoginActivity({
          email,
          login_method: 'password',
          success: false,
          failure_reason: error.message
        });
        
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Track successful login
        await permanentCustomerService.trackLoginActivity({
          email,
          login_method: 'password',
          success: true
        });

        // Update customer profile with login info
        await permanentCustomerService.updateCustomerProfile(email, {
          last_login_at: new Date().toISOString(),
          email_verified: data.user.email_confirmed_at ? true : false
        });

        toast.success('Welcome back!');
        window.location.href = '/';
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Track system error
      await permanentCustomerService.trackLoginActivity({
        email,
        login_method: 'password',
        success: false,
        failure_reason: 'System error'
      });
      
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Store new customer profile permanently
        await permanentCustomerService.storeCustomerProfile({
          user_id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          signup_date: new Date().toISOString(),
          email_verified: false,
          signup_method: 'email',
          marketing_consent: true,
          status: 'active',
          source: 'website'
        });

        // Track signup as first login activity
        await permanentCustomerService.trackLoginActivity({
          email: data.user.email!,
          login_method: 'password',
          success: true
        });

        toast.success('Account created successfully! Please check your email to verify your account.');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Remove admin local login if present
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminUser');
      
      // Remove temporary user session if present
      localStorage.removeItem('temp_user_session');
      
      // Clean up any password overrides
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('password_override_') || key === 'current_password_override') {
          localStorage.removeItem(key);
        }
      });
      
      setUser(null);
      setIsAdmin(false);
      setSession(null);
      
      // Also sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
      
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
