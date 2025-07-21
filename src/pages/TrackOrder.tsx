import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft, Search, Package, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // First try to find the order in the database
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (orderData) {
        // Create tracking timeline based on order status
        const timeline = [
          {
            status: 'Order Placed',
            date: new Date(orderData.created_at).toLocaleDateString(),
            time: new Date(orderData.created_at).toLocaleTimeString(),
            completed: true,
            description: 'Your order has been confirmed'
          },
          {
            status: 'Processing',
            date: new Date(orderData.created_at).toLocaleDateString(),
            time: 'Processing',
            completed: orderData.status !== 'pending',
            description: 'Order is being prepared'
          },
          {
            status: 'Shipped',
            date: orderData.status === 'shipped' || orderData.status === 'delivered' ? new Date().toLocaleDateString() : 'Pending',
            time: orderData.status === 'shipped' || orderData.status === 'delivered' ? 'Shipped' : 'Pending',
            completed: orderData.status === 'shipped' || orderData.status === 'delivered',
            description: 'Package has been dispatched'
          },
          {
            status: 'Delivered',
            date: orderData.status === 'delivered' ? new Date().toLocaleDateString() : 'Expected',
            time: orderData.status === 'delivered' ? 'Delivered' : 'Expected',
            completed: orderData.status === 'delivered',
            description: orderData.status === 'delivered' ? 'Package delivered successfully' : 'Package will be delivered soon'
          }
        ];

        setTrackingResult({
          orderNumber: orderData.order_number,
          status: orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          currentLocation: orderData.status === 'delivered' ? 'Delivered' : 'Processing Center',
          timeline: timeline,
          orderData: orderData
        });
      } else {
        // Order not found
        toast({
          title: "Order Not Found",
          description: "No order found with this order number. Please check and try again.",
          variant: "destructive",
        });
        setTrackingResult(null);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-floral-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Track Your Order</h1>
              <p className="text-slate-600">Enter your order number to track your package</p>
            </div>
          </div>

          {/* Track Order Form */}
          <Card className="bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-pink-600" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your order number (e.g., ORD-123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleTrackOrder}
                  disabled={loading}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingResult && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{trackingResult.orderNumber}</span>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {trackingResult.status}
                  </span>
                </CardTitle>
                <p className="text-slate-600">
                  Current Location: {trackingResult.currentLocation}
                </p>
                <p className="text-slate-600">
                  Estimated Delivery: {trackingResult.estimatedDelivery}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {item.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Clock className="h-6 w-6 text-slate-400" />
                        )}
                        {index < trackingResult.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 mt-2 ${item.completed ? 'bg-green-600' : 'bg-slate-300'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${item.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                            {item.status}
                          </h3>
                          <span className={`text-sm ${item.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                            {item.date} {item.time !== 'Expected' && `at ${item.time}`}
                          </span>
                        </div>
                        <p className={`text-sm ${item.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Orders for Quick Tracking */}
          {user && userOrders.length > 0 && !trackingResult && (
            <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Your Recent Orders</CardTitle>
                <p className="text-slate-600">Click on any order to track it quickly</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userOrders.slice(0, 5).map((order: any) => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setOrderNumber(order.order_number);
                        handleTrackOrder();
                      }}
                    >
                      <div>
                        <p className="font-medium text-slate-900">#{order.order_number}</p>
                        <p className="text-sm text-slate-600">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">₹{order.total_amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results State */}
          {!trackingResult && orderNumber === '' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
              <Package className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Track Your Package</h2>
              <p className="text-slate-600 mb-6">
                Enter your order number above to get real-time tracking information for your package.
              </p>
              <Link to="/order-history">
                <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                  View Order History
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;