import { Product } from "./product";

export interface ProductInCart {
  id: string;
  name: string;
  image?: string;
  price: number;
  finalPrice?: number;
  discountPercentage?: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: ProductInCart;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface CartItemDisplay {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}
