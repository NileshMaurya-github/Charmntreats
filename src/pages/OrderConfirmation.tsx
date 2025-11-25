import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Calendar, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center animate-fade-in">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
            <ShoppingBag className="h-10 w-10 text-slate-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Order Not Found</h1>
          <p className="text-slate-700 mb-8 text-lg">We couldn't find the order details you're looking for.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
          >
            Go to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { customerInfo, items, totalAmount, paymentMethod, orderDate } = orderData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Success Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="relative mb-8 inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200 animate-bounce-soft mx-auto">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <Sparkles className="absolute top-0 right-0 w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Thank you for your order. We've sent a confirmation email to <span className="text-slate-900 font-bold">{customerInfo.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <Package className="h-6 w-6 text-pink-600" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Order ID</span>
                    <p className="font-mono text-xl text-slate-900 font-bold">#{orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Order Date</span>
                    <p className="text-lg text-slate-900 font-medium">{new Date(orderDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 text-sm">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Amount</span>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                      ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <MapPin className="h-6 w-6 text-pink-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2 text-slate-800">
                    <p className="font-bold text-slate-900 text-xl">{customerInfo.fullName}</p>
                    <p className="text-lg">{customerInfo.address}</p>
                    <p className="text-lg">{customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}</p>
                  </div>
                  <div className="space-y-3 min-w-[200px]">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Phone className="h-5 w-5 text-pink-600" />
                      <span className="text-slate-900 font-medium">{customerInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Mail className="h-5 w-5 text-pink-600" />
                      <span className="text-slate-900 font-medium truncate">{customerInfo.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <ShoppingBag className="h-6 w-6 text-pink-600" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6 hover:bg-slate-50 transition-colors">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-700 mb-2">
                          {item.category} • <span className="font-mono text-slate-600">#{item.catalogNumber}</span>
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-slate-100 text-slate-800 border-0">Qty: {item.quantity}</Badge>
                          <span className="font-bold text-pink-600 text-lg">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Sidebar */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 sticky top-24">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <Truck className="h-6 w-6 text-pink-600" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200 -z-10"></div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">Order Confirmed</div>
                      <div className="text-sm text-green-600 font-medium">Just now</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-600">Processing</div>
                      <div className="text-xs text-slate-700">Within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-600">Shipped</div>
                      <div className="text-xs text-slate-700">2-3 business days</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-600">Delivered</div>
                      <div className="text-xs text-slate-700">5-7 business days</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                  <div className="text-base font-bold text-amber-600 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> What's Next?
                  </div>
                  <ul className="text-sm text-slate-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span> We'll process your order within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span> You'll receive tracking details via email
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span> Estimated delivery: 5-7 business days
                    </li>
                    {paymentMethod === 'cod' && (
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span> <span className="font-bold text-slate-900">Please keep cash ready</span> when your order arrives
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 h-12 rounded-xl font-bold"
                  >
                    Browse More Products
                  </Button>
                </div>

                <div className="text-xs text-slate-700 text-center font-medium">
                  Need help? Contact us at <a href="mailto:charmntreats@gmail.com" className="text-pink-600 hover:underline">charmntreats@gmail.com</a>
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

export default OrderConfirmation;