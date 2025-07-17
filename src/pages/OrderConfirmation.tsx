import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn't find the order details.</p>
            <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700">
              Go to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { customerInfo, items, totalAmount, paymentMethod, orderDate } = orderData;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600">
            Thank you for your order. We've sent a confirmation email to {customerInfo.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-amber-600">#{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Date:</span>
                    <span>{new Date(orderDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-amber-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
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
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{customerInfo.fullName}</div>
                  <div className="text-slate-600">{customerInfo.address}</div>
                  <div className="text-slate-600">
                    {customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{customerInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{customerInfo.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg border">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-600">
                          {item.category} • #{item.catalogNumber}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">Order Confirmed</div>
                      <div className="text-xs text-slate-600">Just now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm text-slate-500">Processing</div>
                      <div className="text-xs text-slate-600">Within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm text-slate-500">Shipped</div>
                      <div className="text-xs text-slate-600">2-3 business days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm text-slate-500">Delivered</div>
                      <div className="text-xs text-slate-600">5-7 business days</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-amber-800 mb-2">
                    What's Next?
                  </div>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• We'll process your order within 24 hours</li>
                    <li>• You'll receive tracking details via email</li>
                    <li>• Estimated delivery: 5-7 business days</li>
                    {paymentMethod === 'cod' && (
                      <li>• Pay cash when your order arrives</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="w-full"
                  >
                    Browse Products
                  </Button>
                </div>

                <div className="text-xs text-slate-500 text-center">
                  Need help? Contact us at charmntreats@gmail.com
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