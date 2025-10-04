export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  catalogNumber: string;
  in_stock: boolean;
  stock_quantity?: number;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  materials?: string[];
  size?: string;
  care_instructions?: string;
  weight?: string;
  color?: string;
  style?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
  paymentMethod: 'UPI' | 'COD';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
}
