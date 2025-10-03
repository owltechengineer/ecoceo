export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: ShippingMethod;
}
