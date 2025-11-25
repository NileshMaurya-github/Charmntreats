import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Gift,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { orderStorageService } from '@/services/orderStorageService';
import { orderEmailService } from '@/services/orderEmailService';

import { useRazorpay } from '@/hooks/useRazorpay';

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface OrderData {
  id: string;
  items: any[];
  customerDetails: CustomerDetails;
  paymentMethod: 'UPI' | 'COD';
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isLoaded, displayRazorpay } = useRazorpay();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('COD');
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  useEffect(() => {
    if (cartItems.length === 0 && step !== 'confirmation') {
      navigate('/products');
    }
  }, [cartItems, step, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = subtotal >= 1500 ? 0 : 99;
    const discount = subtotal > 2000 ? subtotal * 0.1 : subtotal > 1000 ? subtotal * 0.05 : 0;
    return subtotal + shipping - discount;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};

    if (!customerDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerDetails.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) newErrors.email = 'Email is invalid';
    if (!customerDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(customerDetails.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!customerDetails.address.trim()) newErrors.address = 'Address is required';
    if (!customerDetails.city.trim()) newErrors.city = 'City is required';
    if (!customerDetails.state.trim()) newErrors.state = 'State is required';
    if (!customerDetails.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(customerDetails.pincode)) newErrors.pincode = 'PIN code must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDetails = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  const processOrder = async (paymentType: 'cod' | 'online', paymentId?: string) => {
    const order: OrderData = {
      id: `CHM-${Date.now()}`,
      items: cartItems,
      customerDetails,
      paymentMethod: paymentType === 'cod' ? 'COD' : 'UPI',
      totalAmount: calculateTotal(),
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    setOrderData(order);

    // Store order in Supabase (with localStorage fallback)
    const stored = await orderStorageService.storeOrder({
      customerInfo: {
        fullName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode
      },
      items: cartItems,
      totalAmount: order.totalAmount,
      paymentMethod: paymentType === 'cod' ? 'cod' : 'online',
      orderDate: order.orderDate,
      orderId: order.id
    });

    if (stored) {
      // Send confirmation emails
      await orderEmailService.sendOrderConfirmationEmails({
        customerInfo: {
          fullName: `${customerDetails.firstName} ${customerDetails.lastName}`,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          pincode: customerDetails.pincode
        },
        items: cartItems,
        totalAmount: order.totalAmount,
        paymentMethod: paymentType === 'cod' ? 'cod' : 'online',
        orderDate: order.orderDate,
        orderId: order.id
      });
    }

    clearCart();
    setStep('confirmation');
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      if (paymentMethod === 'UPI') {
        if (!isLoaded) {
          alert('Razorpay SDK failed to load. Please check your internet connection.');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
          amount: calculateTotal() * 100, // Amount in paise
          currency: 'INR',
          name: 'Charmntreats',
          description: 'Handcrafted with love',
          image: '/logo.png', // Add your logo path
          handler: async function (response: any) {
            // Payment successful
            console.log('Payment successful:', response);
            await processOrder('online', response.razorpay_payment_id);
          },
          prefill: {
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            contact: customerDetails.phone,
          },
          theme: {
            color: '#e11d48', // Rose-600
          },
        };

        displayRazorpay(options);
        setLoading(false); // Stop loading as modal opens
        return;
      }

      // COD flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      await processOrder('cod');

    } catch (error) {
      console.error('Error placing order:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (step === 'confirmation' && orderData) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
        <Header />

        <div className="container mx-auto px-4 py-20 pt-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Success Animation */}
            <div className="relative mb-10">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200 animate-bounce-soft">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-0 right-1/3 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-0 left-1/3 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <Sparkles className="absolute top-4 right-1/4 w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              🎉 Order Confirmed!
            </h1>

            <p className="text-xl text-slate-800 mb-12 max-w-xl mx-auto">
              Thank you for your order! We're preparing your beautiful handcrafted items with love.
            </p>

            {/* Order Details Card */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-10 text-left shadow-xl shadow-slate-200/50">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-100 p-6">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-green-700 font-bold text-xl">Order #{orderData.id}</span>
                  <Badge className="bg-green-500 text-white border-0 font-bold px-3 py-1">Confirmed</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-600" /> Delivery Address
                    </h4>
                    <p className="text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-900 block mb-1">{customerDetails.firstName} {customerDetails.lastName}</span>
                      {customerDetails.address}<br />
                      {customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}<br />
                      <span className="text-slate-800 mt-2 block flex items-center gap-2"><Phone className="w-3 h-3" /> {customerDetails.phone}</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink-600" /> Payment Info
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <div>
                        <p className="text-sm text-slate-800 mb-1">Method</p>
                        <p className="font-bold text-slate-900">
                          {paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 mb-1">Total Amount</p>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                          {formatPrice(orderData.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Items Ordered</h4>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-pink-200 transition-colors">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-lg">{item.name}</p>
                          <p className="text-sm text-slate-800">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-pink-600 text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
              >
                Continue Shopping
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-slate-200 text-slate-900 hover:bg-slate-50 font-bold h-14 px-8 rounded-xl"
              >
                Back to Home
              </Button>
            </div>

            {/* Expected Delivery */}
            <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-blue-600">
                <Truck className="w-6 h-6" />
                <span className="font-bold text-lg">Expected Delivery: 5-7 business days</span>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-800 mb-10">
          <button onClick={() => navigate('/')} className="hover:text-pink-600 transition-colors font-bold">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/cart')} className="hover:text-pink-600 transition-colors font-bold">
            Cart
          </button>
          <span>/</span>
          <span className="text-pink-600 font-bold">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className={`flex items-center gap-3 ${step === 'details' ? 'text-pink-600' : 'text-slate-700'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step === 'details' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                  1
                </div>
                <span className="font-bold text-lg">Details</span>
              </div>

              <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-pink-600 transition-all duration-500 ${step === 'payment' ? 'w-full' : 'w-0'}`}></div>
              </div>

              <div className={`flex items-center gap-3 ${step === 'payment' ? 'text-pink-600' : 'text-slate-700'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step === 'payment' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                  2
                </div>
                <span className="font-bold text-lg">Payment</span>
              </div>
            </div>

            {step === 'details' && (
              <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 animate-slide-up">
                <CardHeader className="border-b border-slate-100 p-6">
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900">
                    <MapPin className="w-6 h-6 text-pink-600" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-900 font-bold ml-1">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerDetails.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-900 font-bold ml-1">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerDetails.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-900 font-bold ml-1">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-900 font-bold ml-1">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-900 font-bold ml-1">Full Address *</Label>
                    <Input
                      id="address"
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="House no, Street, Area"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landmark" className="text-slate-900 font-bold ml-1">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={customerDetails.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl"
                      placeholder="Near any famous location"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-900 font-bold ml-1">City *</Label>
                      <Input
                        id="city"
                        value={customerDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="City name"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-slate-900 font-bold ml-1">State *</Label>
                      <Input
                        id="state"
                        value={customerDetails.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="State name"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.state}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-slate-900 font-bold ml-1">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={customerDetails.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`bg-slate-50 border-slate-200 focus:border-pink-300 text-slate-900 h-12 rounded-xl ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/cart')}
                      className="border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 h-12 px-6 rounded-xl font-bold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Cart
                    </Button>

                    <Button
                      onClick={handleSubmitDetails}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 animate-slide-up">
                <CardHeader className="border-b border-slate-100 p-6">
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900">
                    <CreditCard className="w-6 h-6 text-pink-600" />
                    Payment Method
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                  {/* Payment Options */}
                  <div className="space-y-4">
                    <div
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'COD'
                        ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-pink-500' : 'border-slate-400'}`}>
                          {paymentMethod === 'COD' && <div className="w-3 h-3 bg-pink-500 rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-900">Cash on Delivery</h4>
                          <p className="text-sm text-slate-800">Pay when your order arrives at your doorstep</p>
                        </div>
                        <div className="text-3xl">💵</div>
                      </div>
                    </div>

                    <div
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'UPI'
                        ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-pink-500' : 'border-slate-400'}`}>
                          {paymentMethod === 'UPI' && <div className="w-3 h-3 bg-pink-500 rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-900">Online Payment</h4>
                          <p className="text-sm text-slate-800">UPI, Credit/Debit Cards, Netbanking, Wallets</p>
                        </div>
                        <div className="text-3xl">💳</div>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <span className="text-green-700 font-bold">100% Secure & Encrypted Payment</span>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <Button
                      variant="outline"
                      onClick={() => setStep('details')}
                      className="border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 h-12 px-6 rounded-xl font-bold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Details
                    </Button>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 sticky top-24 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="text-xl font-black text-slate-900">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-pink-200 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-800 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-pink-600 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-slate-100" />

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-900">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className="flex justify-between text-slate-900">
                    <span>Shipping</span>
                    <span className={`font-bold ${getTotalPrice() >= 1500 ? 'text-green-600' : 'text-slate-900'}`}>
                      {getTotalPrice() >= 1500 ? 'FREE' : formatPrice(99)}
                    </span>
                  </div>

                  {(getTotalPrice() > 1000) && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-bold">-{formatPrice(getTotalPrice() > 2000 ? getTotalPrice() * 0.1 : getTotalPrice() * 0.05)}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                {/* Free Shipping Badge */}
                {getTotalPrice() >= 1500 && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl animate-pulse">
                    <Gift className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 text-sm font-bold">Free Shipping Applied!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;