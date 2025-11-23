import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, User, MapPin, Phone, Mail, Calendar, CreditCard, Truck, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('new');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const { toast } = useToast();

  const orderStatuses = [
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'packed', label: 'Packed', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'returned', label: 'Returned', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log(`🔍 OrderManagement: Fetching orders for tab ${activeTab}, page ${currentPage}...`);

      let statusFilter: string[] = [];
      
      if (activeTab === 'new') {
        statusFilter = ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'];
      } else if (activeTab === 'delivered') {
        statusFilter = ['delivered'];
      } else if (activeTab === 'cancelled') {
        statusFilter = ['cancelled', 'returned'];
      }

      const { data, count } = await orderStorageService.getOrdersPaginated(currentPage, pageSize, statusFilter);

      console.log('📋 OrderManagement: Fetched orders:', data.length);
      setOrders(data);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / pageSize));

    } catch (error) {
      console.error('❌ OrderManagement: Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
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
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

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
    const statusConfig = orderStatuses.find(s => s.value === status) || orderStatuses[0];
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  const OrderCard = ({ order, showStatusUpdate = true }: { order: Order; showStatusUpdate?: boolean }) => (
    <Card key={order.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Order #{order.order_id}
            </h3>
            <p className="text-sm text-slate-600">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
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
            <div className="text-sm capitalize">{order.payment_method}</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
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

          {showStatusUpdate && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );

  const OrderDetailsDialog = ({ order }: { order: Order }) => (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {order.customer_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {order.customer_email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {order.customer_phone}
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
            <div className="text-sm">
              {order.delivery_address}<br />
              {order.city}, {order.state} - {order.pincode}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium">Order ID:</span><br />
              <span className="text-sm">{order.order_id}</span>
            </div>
            <div>
              <span className="font-medium">Total Amount:</span><br />
              <span className="text-lg font-bold text-green-600">₹{order.total_amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Payment Method:</span><br />
              <span className="text-sm capitalize">{order.payment_method}</span>
            </div>
            <div>
              <span className="font-medium">Status:</span><br />
              {getStatusBadge(order.order_status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-slate-600">
                      {item.product_category} • SKU: {item.catalog_number}
                    </div>
                    <div className="text-sm text-slate-600">
                      Qty: {item.quantity} × ₹{item.unit_price.toLocaleString()}
                    </div>
                  </div>
                  <div className="font-bold">
                    ₹{item.total_price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2 text-slate-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Orders
        </Button>
      </div>

      <Tabs defaultValue="new" className="space-y-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            New Orders
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Delivered
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Cancelled/Returned
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              {activeTab === 'new' && 'New Orders'}
              {activeTab === 'delivered' && 'Delivered Orders'}
              {activeTab === 'cancelled' && 'Cancelled & Returned Orders'}
              <span className="ml-2 text-sm font-normal text-slate-500">({totalCount})</span>
            </h3>
            <Badge variant="outline" className={
              activeTab === 'new' ? "bg-blue-50 text-blue-700" :
              activeTab === 'delivered' ? "bg-green-50 text-green-700" :
              "bg-red-50 text-red-700"
            }>
              {activeTab === 'new' && 'Pending processing'}
              {activeTab === 'delivered' && 'Successfully completed'}
              {activeTab === 'cancelled' && 'Cancelled or returned'}
            </Badge>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                {activeTab === 'new' && <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />}
                {activeTab === 'delivered' && <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />}
                {activeTab === 'cancelled' && <XCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />}
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Orders Found</h3>
                <p className="text-slate-500">
                  {activeTab === 'new' && 'New orders will appear here when customers place orders.'}
                  {activeTab === 'delivered' && 'Delivered orders will appear here once orders are marked as delivered.'}
                  {activeTab === 'cancelled' && 'Cancelled or returned orders will appear here.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  showStatusUpdate={activeTab !== 'delivered'} 
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default OrderManagement;