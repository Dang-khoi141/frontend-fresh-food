export interface OrderProduct {
  id: string;
  name: string;
  image?: string;
  price: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: OrderProduct;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  paymentMethod: "COD" | "ONLINE";
  shippingAddress: string;
  notes?: string;
}
