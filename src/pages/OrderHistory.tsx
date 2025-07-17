import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, ArrowLeft, Calendar, CreditCard, MapPin, Truck, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800', icon: Package },
    { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-800', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Package }
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
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        <IconComponent className="h-3 w-3 mr-1" />
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
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <span className="text-slate-400">•</span>
          <span className="text-amber-600 font-medium">Order History</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Orders</h1>
          <p className="text-slate-600">Track and manage your order history</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <span className="ml-2">Loading your orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Orders Yet</h3>
              <p className="text-slate-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Order #{order.order_id}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Placed on {new Date(order.order_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-800 mb-2">
                        ₹{order.total_amount.toLocaleString()}
                      </div>
                      {getStatusBadge(order.order_status)}
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      {getOrderProgress(order.order_status).map((step, index) => (
                        <div key={step?.value} className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step?.isCompleted 
                              ? 'bg-green-500 text-white' 
                              : step?.isCurrent 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-slate-200 text-slate-500'
                          }`}>
                            {step?.isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-bold">{step?.step}</span>
                            )}
                          </div>
                          <div className="text-xs text-center mt-2 max-w-16">
                            {step?.label}
                          </div>
                          {index < getOrderProgress(order.order_status).length - 1 && (
                            <div className={`absolute h-0.5 w-full top-4 left-1/2 ${
                              step?.isCompleted ? 'bg-green-500' : 'bg-slate-200'
                            }`} style={{ zIndex: -1 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {order.items?.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={item.product_image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg border bg-slate-100 flex items-center justify-center">
                          <span className="text-xs text-slate-600">+{(order.items?.length || 0) - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {order.city}, {order.state}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.order_id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && <OrderDetailsDialog order={selectedOrder} />}
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
    <div className="space-y-6">
      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Current Status:</span>
              <Badge className="bg-amber-100 text-amber-800">
                {order.order_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Date:</span>
              <span>{new Date(order.order_date).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Method:</span>
              <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-800">
            {order.customer_name}<br />
            {order.delivery_address}<br />
            {order.city}, {order.state} - {order.pincode}<br />
            Phone: {order.customer_phone}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-lg">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg border">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{item.product_name}</h4>
                  <p className="text-sm text-slate-600">
                    {item.product_category} • #{item.catalog_number}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                    <div className="text-right">
                      <div className="font-semibold">₹{item.total_price.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">₹{item.unit_price.toLocaleString()} each</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-amber-600">₹{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;