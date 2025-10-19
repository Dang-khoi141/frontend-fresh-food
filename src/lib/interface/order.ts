import { User } from "next-auth";

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
  discountAmount?: number;
  promotionCode?: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  paymentMethod: "COD" | "ONLINE";
  shippingAddress: string;
  notes?: string;
  promotionCode?: string;
  discountAmount?: number;
}

export interface UseFetchOrderOptions {
  orderId?: string;
  autoFetch?: boolean;
  isAdmin?: boolean;
  onSuccess?: (data: Order | Order[]) => void;
  onError?: (error: any) => void;
}

export interface UseFetchOrderResult {
  order: Order | null;
  orders: Order[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateStatus: (status: string) => Promise<Order>;
  cancelOrder: () => Promise<Order>;
}
