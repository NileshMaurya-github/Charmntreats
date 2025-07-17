import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sendOrderEmails } from '@/services/simpleEmailService';
import { orderStorageService } from '@/services/orderStorageService';

interface OrderData {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: any[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  orderDate: string;
  orderId: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!customerInfo[field as keyof typeof customerInfo]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CT${timestamp.slice(-6)}${random}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const orderId = generateOrderId();
      const shippingCost = getTotalPrice() >= 500 ? 0 : 50;
      const totalAmount = getTotalPrice() + shippingCost;
      
      const orderData: OrderData = {
        customerInfo,
        items: cartItems,
        totalAmount,
        paymentMethod,
        orderDate: new Date().toISOString(),
        orderId
      };

      // Send order confirmation emails using the email service
      console.log('📧 Sending order confirmation emails...');
      try {
        const emailsSent = await sendOrderEmails(orderData);
        
        if (emailsSent) {
          console.log('✅ Order confirmation emails sent successfully!');
          toast({
            title: "Emails Sent!",
            description: "Order confirmation emails have been sent to you and our store.",
          });
        } else {
          console.error('❌ Failed to send some confirmation emails');
          toast({
            title: "Email Warning",
            description: "Order placed but some confirmation emails may not have been sent.",
            variant: "destructive",
          });
        }
      } catch (emailError) {
        console.error('❌ Email service error:', emailError);
        toast({
          title: "Email Warning", 
          description: "Order placed but confirmation emails may not have been sent.",
          variant: "destructive",
        });
      }

      // Store order using the order storage service
      console.log('💾 Storing order...');
      try {
        const orderStored = await orderStorageService.storeOrder(orderData);
        
        if (orderStored) {
          console.log('✅ Order stored successfully!');
        } else {
          console.error('❌ Failed to store order');
          toast({
            title: "Storage Warning",
            description: "Order placed but may not be saved. Please contact support if needed.",
            variant: "destructive",
          });
        }
      } catch (storeError) {
        console.error('❌ Storage service error:', storeError);
        toast({
          title: "Storage Warning",
          description: "Order placed but may not be saved. Please contact support if needed.",
          variant: "destructive",
        });
      }

      // Clear cart
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been confirmed. Check your email for details.`,
      });

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`, { 
        state: { orderData } 
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = getTotalPrice() >= 500 ? 0 : 50;
  const totalAmount = getTotalPrice() + shippingCost;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-slate-600 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
          <span className="text-slate-400">•</span>
          <span className="text-amber-600 font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={customerInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={customerInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: 'cod' | 'online') => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-5 w-5 text-amber-600" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-slate-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
                >
                  {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount.toLocaleString()}`}
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  By placing this order, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;