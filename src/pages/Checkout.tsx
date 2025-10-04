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
  Mail, 
  User, 
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

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order: OrderData = {
        id: `CHM-${Date.now()}`,
        items: cartItems,
        customerDetails,
        paymentMethod,
        totalAmount: calculateTotal(),
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      setOrderData(order);
      
      // Store order in localStorage (in real app, send to backend)
      const existingOrders = JSON.parse(localStorage.getItem('charmntreats-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('charmntreats-orders', JSON.stringify(existingOrders));
      
      clearCart();
      setStep('confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
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
      <div className="min-h-screen bg-floral-gradient">
        <Header />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-bounce-soft">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-rose-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <Sparkles className="absolute top-4 right-8 w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎉 Order Confirmed!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order! We're preparing your beautiful handcrafted items with love.
            </p>

            {/* Order Details Card */}
            <Card className="card-floral mb-8 text-left">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-green-800">Order #{orderData.id}</span>
                  <Badge className="bg-green-600 text-white">Confirmed</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {customerDetails.firstName} {customerDetails.lastName}<br/>
                      {customerDetails.address}<br/>
                      {customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}<br/>
                      📞 {customerDetails.phone}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600">
                      {paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 UPI Payment'}
                    </p>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4">Order Total</h4>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(orderData.totalAmount)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">
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
                className="btn-floral-gradient hover-scale"
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="border-rose-300 text-rose-600 hover:bg-rose-50"
              >
                Back to Home
              </Button>
            </div>

            {/* Expected Delivery */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Expected Delivery: 5-7 business days</span>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-floral-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-rose-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/cart')} className="hover:text-rose-600 transition-colors">
            Cart
          </button>
          <span>/</span>
          <span className="text-rose-600 font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === 'details' ? 'text-rose-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'details' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="font-medium">Details</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-300"></div>
              
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-rose-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>

            {step === 'details' && (
              <Card className="card-floral">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerDetails.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`input-floral ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerDetails.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`input-floral ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`input-floral ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`input-floral ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`input-floral ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="House no, Street, Area"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={customerDetails.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="input-floral"
                      placeholder="Near any famous location"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={customerDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`input-floral ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="City name"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={customerDetails.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`input-floral ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="State name"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={customerDetails.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`input-floral ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/cart')}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Cart
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitDetails}
                      className="btn-floral-gradient hover-scale"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="card-floral">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-600" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Payment Options */}
                  <div className="space-y-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'COD' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-rose-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Cash on Delivery</h4>
                          <p className="text-sm text-gray-600">Pay when your order arrives</p>
                        </div>
                        <div className="text-2xl">💵</div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'UPI' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="text-rose-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">UPI Payment</h4>
                          <p className="text-sm text-gray-600">Pay instantly via UPI</p>
                        </div>
                        <div className="text-2xl">💳</div>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Secure & Encrypted Payment</span>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStep('details')}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Details
                    </Button>
                    
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-floral-gradient hover-scale"
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
            <Card className="card-floral sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={getTotalPrice() >= 1500 ? 'text-green-600' : ''}>
                      {getTotalPrice() >= 1500 ? 'FREE' : formatPrice(99)}
                    </span>
                  </div>
                  
                  {(getTotalPrice() > 1000) && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(getTotalPrice() > 2000 ? getTotalPrice() * 0.1 : getTotalPrice() * 0.05)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>

                {/* Free Shipping Badge */}
                {getTotalPrice() >= 1500 && (
                  <div className="flex items-center justify-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 text-sm font-medium">Free Shipping Applied!</span>
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