// Order Storage Service - Handles order storage with database fallback to localStorage
import { supabase } from '@/integrations/supabase/client';

interface OrderData {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: any[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  orderDate: string;
  orderId: string;
}

interface StoredOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  order_date: string;
  created_at: string;
  items?: any[];
}

class OrderStorageService {
  // Store order (try database first, fallback to localStorage)
  async storeOrder(orderData: OrderData): Promise<boolean> {
    console.log('💾 Storing order:', orderData.orderId);

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;

    const orderRecord: StoredOrder = {
      id: Date.now().toString(),
      order_id: orderData.orderId,
      customer_name: orderData.customerInfo.fullName,
      customer_email: orderData.customerInfo.email,
      customer_phone: orderData.customerInfo.phone,
      delivery_address: orderData.customerInfo.address,
      city: orderData.customerInfo.city,
      state: orderData.customerInfo.state,
      pincode: orderData.customerInfo.pincode,
      subtotal: subtotal,
      shipping_cost: shipping,
      total_amount: orderData.totalAmount,
      payment_method: orderData.paymentMethod,
      order_status: 'confirmed',
      order_date: orderData.orderDate,
      created_at: new Date().toISOString(),
      items: orderData.items.map(item => ({
        id: Date.now().toString() + Math.random(),
        order_id: orderData.orderId,
        product_id: item.id,
        product_name: item.name,
        product_category: item.category,
        catalog_number: item.catalogNumber,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        product_image: item.images[0] || ''
      }))
    };

    // Try database first
    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_id: orderRecord.order_id,
          customer_name: orderRecord.customer_name,
          customer_email: orderRecord.customer_email,
          customer_phone: orderRecord.customer_phone,
          delivery_address: orderRecord.delivery_address,
          city: orderRecord.city,
          state: orderRecord.state,
          pincode: orderRecord.pincode,
          subtotal: orderRecord.subtotal,
          shipping_cost: orderRecord.shipping_cost,
          total_amount: orderRecord.total_amount,
          payment_method: orderRecord.payment_method,
          order_status: orderRecord.order_status,
          order_date: orderRecord.order_date,
          created_at: orderRecord.created_at
        }]);

      if (!orderError) {
        // Store order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderRecord.items?.map(item => ({
            order_id: item.order_id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_category: item.product_category,
            catalog_number: item.catalog_number,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            product_image: item.product_image
          })) || []);

        if (!itemsError) {
          console.log('✅ Order stored in database successfully');
          return true;
        }
      }
      
      console.log('⚠️ Database storage failed, using localStorage');
    } catch (error) {
      console.log('⚠️ Database error, using localStorage:', error);
    }

    // Fallback to localStorage
    try {
      const existingOrders = this.getStoredOrders();
      existingOrders.push(orderRecord);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      console.log('✅ Order stored in localStorage');
      return true;
    } catch (error) {
      console.error('❌ Failed to store order:', error);
      return false;
    }
  }

  // Get orders for a specific user
  async getUserOrders(userEmail: string): Promise<StoredOrder[]> {
    console.log('📋 Fetching orders for user:', userEmail);

    // Try database first
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', userEmail)
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData && ordersData.length > 0) {
        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.order_id);

            return {
              ...order,
              items: itemsData || []
            };
          })
        );

        console.log('✅ Orders fetched from database:', ordersWithItems.length);
        return ordersWithItems;
      }
    } catch (error) {
      console.log('⚠️ Database fetch failed, using localStorage:', error);
    }

    // Fallback to localStorage
    try {
      const allOrders = this.getStoredOrders();
      const userOrders = allOrders.filter(order => order.customer_email === userEmail);
      console.log('✅ Orders fetched from localStorage:', userOrders.length);
      return userOrders;
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      return [];
    }
  }

  // Get all orders (for admin)
  async getAllOrders(): Promise<StoredOrder[]> {
    console.log('📋 Fetching all orders for admin');

    // Try database first
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData && ordersData.length > 0) {
        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.order_id);

            return {
              ...order,
              items: itemsData || []
            };
          })
        );

        console.log('✅ All orders fetched from database:', ordersWithItems.length);
        return ordersWithItems;
      }
    } catch (error) {
      console.log('⚠️ Database fetch failed, using localStorage:', error);
    }

    // Fallback to localStorage
    try {
      const allOrders = this.getStoredOrders();
      console.log('✅ All orders fetched from localStorage:', allOrders.length);
      return allOrders;
    } catch (error) {
      console.error('❌ Failed to fetch all orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
    console.log('🔄 Updating order status:', orderId, newStatus);

    // Try database first
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (!error) {
        console.log('✅ Order status updated in database');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Database update failed, using localStorage:', error);
    }

    // Fallback to localStorage
    try {
      const allOrders = this.getStoredOrders();
      const orderIndex = allOrders.findIndex(order => order.order_id === orderId);
      
      if (orderIndex !== -1) {
        allOrders[orderIndex].order_status = newStatus;
        localStorage.setItem('orders', JSON.stringify(allOrders));
        console.log('✅ Order status updated in localStorage');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
    }

    return false;
  }

  // Get stored orders from localStorage
  private getStoredOrders(): StoredOrder[] {
    try {
      const stored = localStorage.getItem('orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error reading stored orders:', error);
      return [];
    }
  }

  // Clear all stored orders (for testing)
  clearAllOrders(): void {
    localStorage.removeItem('orders');
    console.log('🗑️ All stored orders cleared');
  }
}

export const orderStorageService = new OrderStorageService();
export default orderStorageService;