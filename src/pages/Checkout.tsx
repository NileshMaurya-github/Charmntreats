import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Razorpay script loader
  function loadRazorpayScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value
    });
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field}.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    const orderId = 'CHT' + Date.now();
    const totalAmount = getTotalPrice() + (getTotalPrice() >= 599 ? 0 : 50);
    const orderItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images ? item.images[0] : '',
      category: item.category,
      catalogNumber: item.catalogNumber
    }));
    // COD logic (as before)
    if (formData.paymentMethod === 'COD') {
      try {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderId,
            customer_details: formData,
            items: orderItems,
            total_amount: totalAmount,
            payment_method: formData.paymentMethod,
            order_status: 'pending',
            payment_status: 'pending'
          });
        if (orderError) {
          toast({ title: 'Order Failed', description: 'Failed to place order. Please try again.', variant: 'destructive' });
          return;
        }
        clearCart();
        toast({ title: 'Order Placed Successfully!', description: `Your order ${orderId} has been placed. You'll receive a confirmation email shortly.` });
        navigate('/', { replace: true });
      } catch (error) {
        toast({ title: 'Order Failed', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
      } finally {
        setIsProcessing(false);
      }
      return;
    }
    // Razorpay logic
    if (formData.paymentMethod === 'RAZORPAY') {
      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast({ title: 'Payment Error', description: 'Failed to load Razorpay. Please try again.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Charmntreats',
        description: 'Order Payment',
        handler: async function (response: any) {
          // Save order as paid
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              order_number: orderId,
              customer_details: formData,
              items: orderItems,
              total_amount: totalAmount,
              payment_method: 'RAZORPAY',
              order_status: 'pending',
              payment_status: 'paid',
              razorpay_payment_id: response.razorpay_payment_id
            });
          if (orderError) {
            toast({ title: 'Order Failed', description: 'Failed to save order after payment.', variant: 'destructive' });
            setIsProcessing(false);
            return;
          }
          clearCart();
          toast({ title: 'Payment Successful!', description: `Your order ${orderId} has been placed.` });
          navigate('/', { replace: true });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#f59e42' }
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsProcessing(false);
      return;
    }
  };

  useEffect(() => {
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  // Debug panel for cart troubleshooting
  const debugCart = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('cart') ?? '' : '';

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart before proceeding to checkout.</p>
          <Button onClick={() => navigate('/products')} className="bg-amber-600 hover:bg-amber-700">
            Go to Products
          </Button>
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-left max-w-xl w-full">
            <div className="mb-2 font-bold">Debug Info:</div>
            <div><b>cartItems:</b> {JSON.stringify(cartItems)}</div>
            <div><b>localStorage["cart"]:</b> {debugCart}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalAmount = getTotalPrice() + (getTotalPrice() >= 599 ? 0 : 50);

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
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit phone number"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Banknote className="h-4 w-4" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="RAZORPAY" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Pay Online (Razorpay)
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-slate-500 mt-3">
                  Choose Cash on Delivery or pay securely online with Razorpay.
                </p>
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
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className={getTotalPrice() >= 599 ? 'text-green-600' : ''}>
                      {getTotalPrice() >= 599 ? 'Free' : '₹50'}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ₹${totalAmount.toLocaleString()}`}
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  By placing this order, you agree to our Terms & Conditions
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
