import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, TestTube } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import fallbackEmailService from '@/services/fallbackEmailService';

const EmailTest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('nileshmaurya59@gmail.com');
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testOTPEmail = async () => {
    setLoading(true);
    addResult('🧪 Starting OTP email test...');
    
    try {
      const otp = fallbackEmailService.generateOTP();
      addResult(`📧 Generated OTP: ${otp}`);
      
      const result = await fallbackEmailService.sendOTPEmail(testEmail, otp, 'signup');
      
      if (result) {
        addResult('✅ OTP email sent successfully!');
        toast({
          title: "Success",
          description: "OTP email sent successfully!",
        });
      } else {
        addResult('❌ OTP email failed');
        toast({
          title: "Error",
          description: "Failed to send OTP email",
          variant: "destructive",
        });
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to send OTP email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testResetEmail = async () => {
    setLoading(true);
    addResult('🧪 Starting password reset email test...');
    
    try {
      const otp = fallbackEmailService.generateOTP();
      addResult(`📧 Generated reset code: ${otp}`);
      
      const result = await fallbackEmailService.sendOTPEmail(testEmail, otp, 'reset');
      
      if (result) {
        addResult('✅ Password reset email sent successfully!');
        toast({
          title: "Success",
          description: "Password reset email sent successfully!",
        });
      } else {
        addResult('❌ Password reset email failed');
        toast({
          title: "Error",
          description: "Failed to send password reset email",
          variant: "destructive",
        });
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testGenericEmail = async () => {
    setLoading(true);
    addResult('🧪 Starting generic email test...');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: '🧪 Generic Email Test - Charmntreats',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #f59e42; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                <h1>Generic Email Test</h1>
              </div>
              <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
                <h2>Test Successful!</h2>
                <p>This is a test email to verify that the generic email API is working correctly.</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Test Type:</strong> Generic Email API</p>
              </div>
            </div>
          `
        })
      });

      if (response.ok) {
        const result = await response.json();
        addResult('✅ Generic email sent successfully!');
        addResult(`📧 Message ID: ${result.messageId}`);
        toast({
          title: "Success",
          description: "Generic email sent successfully!",
        });
      } else {
        const errorData = await response.json();
        addResult(`❌ Generic email failed: ${errorData.error}`);
        toast({
          title: "Error",
          description: "Failed to send generic email",
          variant: "destructive",
        });
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to send generic email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <TestTube className="h-8 w-8 text-amber-600" />
            Email System Test - Charmntreats
          </h1>
          <p className="text-gray-600">Test the email functionality to ensure OTP and order confirmation emails are working</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to test"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={testOTPEmail}
                  disabled={loading || !testEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Test OTP Email (Signup)
                </Button>

                <Button
                  onClick={testResetEmail}
                  disabled={loading || !testEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Test Password Reset Email
                </Button>

                <Button
                  onClick={testGenericEmail}
                  disabled={loading || !testEmail}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Test Generic Email API
                </Button>

                <Button
                  onClick={clearResults}
                  variant="outline"
                  className="w-full"
                >
                  Clear Results
                </Button>
              </div>

              {loading && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <span className="ml-2">Sending email...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-gray-500">No tests run yet. Click a test button to start.</div>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">How to use this test page:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Enter your email address in the test field</li>
                  <li>Click any of the test buttons to send different types of emails</li>
                  <li>Check your email inbox for the test messages</li>
                  <li>Monitor the test results panel for detailed logs</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What each test does:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>OTP Email:</strong> Tests the signup verification email with a 6-digit code</li>
                  <li><strong>Password Reset:</strong> Tests the forgot password email with a reset code</li>
                  <li><strong>Generic Email:</strong> Tests the basic email API functionality</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting:</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                  <li>If emails fail, check the test results for error details</li>
                  <li>Emails may take 1-2 minutes to arrive</li>
                  <li>Check your spam/junk folder if emails don't appear</li>
                  <li>The system tries multiple methods automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default EmailTest;