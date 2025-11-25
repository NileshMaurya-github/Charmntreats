import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, ArrowLeft, Calendar, CreditCard, MapPin, Truck, CheckCircle, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { orderStorageService } from '@/services/orderStorageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  order_status: string;
  order_date: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_category: string;
  catalog_number: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const orderStatuses = [
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-600 border-blue-200', icon: CheckCircle },
    { value: 'processing', label: 'Processing', color: 'bg-amber-100 text-amber-600 border-amber-200', icon: Package },
    { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-600 border-purple-200', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-600 border-indigo-200', icon: Truck },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-pink-100 text-pink-600 border-pink-200', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-600 border-red-200', icon: Package }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      // Use the order storage service to fetch orders
      const userOrders = await orderStorageService.getUserOrders(user.email);

      console.log('📋 Fetched orders for user:', userOrders.length);
      setOrders(userOrders);

      if (userOrders.length === 0) {
        console.log('ℹ️ No orders found for user:', user.email);
      }

    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    const IconComponent = statusConfig?.icon || Package;

    return (
      <Badge className={`${statusConfig?.color || 'bg-slate-100 text-slate-800'} border px-3 py-1`}>
        <IconComponent className="h-3 w-3 mr-2" />
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getOrderProgress = (status: string) => {
    const statusOrder = ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return statusOrder.map((step, index) => {
      const stepConfig = orderStatuses.find(s => s.value === step);
      const isCompleted = index <= currentIndex;
      const isCurrent = index === currentIndex;

      return {
        ...stepConfig,
        isCompleted,
        isCurrent,
        step: index + 1
      };
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-800 hover:text-pink-600 hover:bg-pink-50 p-0 h-auto font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <span className="text-slate-700">•</span>
          <span className="text-pink-600 font-bold">Order History</span>
        </div>

        <div className="mb-10 animate-slide-up">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Your Orders</h1>
          <p className="text-slate-800 text-lg">Track and manage your handcrafted treasures</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
            <span className="text-slate-600 font-medium">Loading your orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-center py-20 animate-fade-in shadow-sm">
            <CardContent>
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <ShoppingBag className="h-10 w-10 text-pink-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Orders Yet</h3>
              <p className="text-slate-800 mb-8 max-w-md mx-auto text-lg">
                You haven't placed any orders yet. Start shopping to fill your life with handcrafted beauty.
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {orders.map((order, index) => (
              <Card key={order.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          Order #{order.order_id}
                        </h3>
                        {getStatusBadge(order.order_status)}
                      </div>
                      <p className="text-sm text-slate-800 flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4 text-pink-600" />
                        Placed on {new Date(order.order_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-1">
                        ₹{order.total_amount.toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-700 font-bold uppercase tracking-wider">Total Amount</p>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mb-10 overflow-x-auto pb-4">
                    <div className="flex items-center justify-between min-w-[600px]">
                      {getOrderProgress(order.order_status).map((step, index) => (
                        <div key={step?.value} className="flex flex-col items-center flex-1 relative group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${step?.isCompleted
                            ? 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-200'
                            : step?.isCurrent
                              ? 'bg-pink-600 border-pink-700 text-white shadow-lg shadow-pink-200 scale-110'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}>
                            {step?.isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-bold">{step?.step}</span>
                            )}
                          </div>
                          <div className={`text-xs font-bold text-center mt-3 transition-colors ${step?.isCurrent ? 'text-pink-600' : step?.isCompleted ? 'text-green-600' : 'text-slate-700'
                            }`}>
                            {step?.label}
                          </div>
                          {index < getOrderProgress(order.order_status).length - 1 && (
                            <div className="absolute h-1 w-full top-5 left-1/2 -z-0 bg-slate-100">
                              <div
                                className={`h-full transition-all duration-500 ${step?.isCompleted ? 'bg-green-500' : 'w-0'}`}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {order.items?.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group relative bg-white">
                          <img
                            src={item.product_image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                            alt={item.product_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute bottom-0 right-0 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                            x{item.quantity}
                          </div>
                        </div>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                          <span className="text-lg font-bold">+{(order.items?.length || 0) - 4}</span>
                          <span className="text-[10px] uppercase font-bold">More</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-800 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <CreditCard className="h-4 w-4 text-pink-600" />
                        <span className="font-medium text-slate-900">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <MapPin className="h-4 w-4 text-pink-600" />
                        <span className="font-medium text-slate-900">{order.city}, {order.state}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 font-bold h-10 px-6 rounded-xl transition-all shadow-lg shadow-slate-200"
                        >
                          View Full Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white border border-slate-200 text-slate-900 p-0 gap-0 rounded-3xl shadow-2xl">
                        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-10">
                          <DialogTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                            Order Details <span className="text-pink-600">#{order.order_id}</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-6">
                          {selectedOrder && <OrderDetailsDialog order={selectedOrder} />}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const OrderDetailsDialog = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-8">
      {/* Order Status */}
      <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Truck className="h-5 w-5 text-pink-600" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800">Current Status</span>
              <Badge className="bg-pink-100 text-pink-600 border border-pink-200 px-3 py-1">
                {order.order_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800">Order Date</span>
              <span className="text-slate-900 font-bold">{new Date(order.order_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800">Payment Method</span>
              <span className="text-slate-900 font-bold">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPin className="h-5 w-5 text-pink-600" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-slate-900 leading-relaxed">
            <p className="font-bold text-slate-900 text-lg mb-1">{order.customer_name}</p>
            <p>{order.delivery_address}</p>
            <p>{order.city}, {order.state} - {order.pincode}</p>
            <p className="mt-2 flex items-center gap-2 text-slate-800">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-900">PHONE</span> {order.customer_phone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Package className="h-5 w-5 text-pink-600" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-pink-300 transition-colors">
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-lg">{item.product_name}</h4>
                  <p className="text-sm text-slate-800 mb-2">
                    {item.product_category} • <span className="font-mono text-slate-700">#{item.catalog_number}</span>
                  </p>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-900">Qty: {item.quantity}</span>
                    <div className="text-right">
                      <div className="font-bold text-pink-600 text-lg">₹{item.total_price.toLocaleString()}</div>
                      <div className="text-xs text-slate-800">₹{item.unit_price.toLocaleString()} each</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Amount</span>
              <span className="text-3xl font-black text-slate-900">₹{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;