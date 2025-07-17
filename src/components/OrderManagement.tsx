import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, User, MapPin, Phone, Mail, Calendar, CreditCard, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { orderStorageService } from '@/services/orderStorageService';

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

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const orderStatuses = [
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Use the order storage service to fetch all orders
      const allOrders = await orderStorageService.getAllOrders();
      
      console.log('📋 Fetched orders for admin:', allOrders.length);
      setOrders(allOrders);
      
      if (allOrders.length === 0) {
        console.log('ℹ️ No orders found');
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Use the order storage service to update status
      const updated = await orderStorageService.updateOrderStatus(orderId, newStatus);

      if (!updated) {
        toast({
          title: "Error",
          description: "Failed to update order status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, order_status: newStatus }
          : order
      ));

      toast({
        title: "Status Updated",
        description: `Order status updated to ${orderStatuses.find(s => s.value === newStatus)?.label}`,
      });

      // TODO: Send status update email to customer
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
        <Button onClick={fetchOrders} variant="outline">
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Orders Found</h3>
            <p className="text-slate-500">Orders will appear here once customers start placing them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="font-medium text-sm">{order.customer_name}</div>
                      <div className="text-xs text-slate-600">{order.customer_email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div className="text-sm">{order.customer_phone}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <div className="text-sm">{order.city}, {order.state}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-500" />
                    <div className="text-sm capitalize">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
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

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Status:</span>
                    <Select
                      value={order.order_status}
                      onValueChange={(value) => updateOrderStatus(order.order_id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetailsDialog = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Name</label>
              <p className="text-slate-800">{order.customer_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <p className="text-slate-800">{order.customer_email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Phone</label>
              <p className="text-slate-800">{order.customer_phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Payment Method</label>
              <p className="text-slate-800 capitalize">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
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
            {order.delivery_address}<br />
            {order.city}, {order.state} - {order.pincode}
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

export default OrderManagement;