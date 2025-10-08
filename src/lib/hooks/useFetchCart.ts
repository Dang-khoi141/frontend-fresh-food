"use client";

import { useState } from "react";
import { Product } from "@/lib/interface/product";
import { cartService, Cart } from "@/lib/service/cart.service";

export interface CartItem {
  product: Product;
  quantity: number;
}

export default function useFetchCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mapCart = (serverCart: Cart): CartItem[] => {
    return serverCart.items.map(i => ({
      product: {
        id: i.productId,
        name: i.name,
        price: i.price,
        image: i.image,
      } as Product,
      quantity: i.quantity,
    }));
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const serverCart = await cartService.getCart();
      setCart(mapCart(serverCart));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const updated = await cartService.addToCart(product.id, quantity);
    setCart(mapCart(updated));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const updated = await cartService.updateQuantity(productId, quantity);
    setCart(mapCart(updated));
  };

  const removeFromCart = async (productId: string) => {
    const updated = await cartService.removeItem(productId);
    setCart(mapCart(updated));
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
