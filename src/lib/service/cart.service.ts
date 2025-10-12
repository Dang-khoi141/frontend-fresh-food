import { BaseApiService } from "./baseApi.service";

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

class CartService extends BaseApiService {
  async getCart(): Promise<Cart> {
    const res = await this.axiosInstance.get("/cart");
    return res.data?.data ?? res.data;
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const res = await this.axiosInstance.post("/cart/add", {
      productId,
      quantity,
    });
    return res.data?.data ?? res.data;
  }

  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    const res = await this.axiosInstance.patch("/cart/quantity", {
      productId,
      quantity,
    });
    return res.data?.data ?? res.data;
  }

  async removeItem(productId: string): Promise<Cart> {
    const res = await this.axiosInstance.delete(`/cart/items/${productId}`);
    return res.data?.data ?? res.data;
  }

  async clearCart(): Promise<void> {
    await this.axiosInstance.delete("/cart/clear");
  }

  async updateCartItem(productId: string, updates: Partial<CartItem>): Promise<Cart> {
    const res = await this.axiosInstance.patch(`/cart/items/${productId}`, updates);
    return res.data?.data ?? res.data;
  }
}

export const cartService = new CartService();
