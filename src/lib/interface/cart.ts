import { Product } from "./product";

export interface ProductInCart {
  id: string;
  name: string;
  image?: string;
  price: string;
}

export interface CartItem {
  id: string;
  quantity: number;
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
