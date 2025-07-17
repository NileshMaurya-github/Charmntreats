import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sendOrderEmails } from '@/services/simpleEmailService';

const TestEmails = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleTestEmails = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to test",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Sample order data for testing
      const testOrderData = {
        customerInfo: {
          fullName: 'Test Customer',
          email: testEmail,
          phone: '9876543210',
          address: '123 Test Street, Test Area, Near Test Mall',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: 'test-product-1',
            name: 'Handcrafted Dream Catcher',
            price: 599,
            quantity: 2,
            category: 'Home Decor',
            catalogNumber: 'DC001',
            images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']
          },
          {
            id: 'test-product-2',
            name: 'Embroidered Wall Hanging',
            price: 799,
            quantity: 1,
            category: 'Wall Art',
            catalogNumber: 'WH002',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']
          }
        ],
        totalAmount: 1997,
        paymentMethod: 'cod' as const,
        orderDate: new Date().toISOString(),
        orderId: 'CT' + Date.now().toString().slice(-6) + 'TEST'
      };

      console.log('🧪 Testing email system with order:', testOrderData.orderId);
      
      const emailsSent = await sendOrderEmails(testOrderData);
      
      if (emailsSent) {
        toast({
          title: "Test Successful! 🎉",
          description: `Test emails sent to ${testEmail} and charmntreats@gmail.com`,
        });
        console.log('✅ Test emails sent successfully!');
      } else {
        toast({
          title: "Test Failed",
          description: "Some emails may not have been sent. Check console for details.",
          variant: "destructive",
        });
        console.error('❌ Test emails failed');
      }

    } catch (error) {
      console.error('❌ Test error:', error);
      toast({
        title: "Test Error",
        description: "An error occurred while testing emails. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🧪 Email System Test</CardTitle>
              <p className="text-center text-slate-600">
                Test the order confirmation email system
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="testEmail">Your Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter your email to receive test confirmation"
                />
                <p className="text-sm text-slate-500 mt-2">
                  You'll receive a test order confirmation email, and charmntreats@gmail.com will receive a store notification.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Test Order Details:</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 2x Handcrafted Dream Catcher (₹599 each)</li>
                  <li>• 1x Embroidered Wall Hanging (₹799)</li>
                  <li>• Payment Method: Cash on Delivery</li>
                  <li>• Total Amount: ₹1,997</li>
                  <li>• Customer: Test Customer, Mumbai</li>
                </ul>
              </div>

              <Button 
                onClick={handleTestEmails}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
              >
                {loading ? 'Sending Test Emails...' : 'Send Test Emails 📧'}
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">What This Test Does:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Sends a customer confirmation email to your address</li>
                  <li>✅ Sends a store notification to charmntreats@gmail.com</li>
                  <li>✅ Tests the complete email system</li>
                  <li>✅ Uses the same system as real orders</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Check your email and charmntreats@gmail.com after clicking the button above.
                  <br />
                  Open browser console (F12) to see detailed logs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TestEmails;