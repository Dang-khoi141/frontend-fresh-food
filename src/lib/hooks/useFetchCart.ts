"use client";

import { useState } from "react";
import { Product } from "@/lib/interface/product";
import { Cart, CartItemDisplay } from "@/lib/interface/cart";
import { cartService } from "@/lib/service/cart.service";

export default function useFetchCart() {
  const [cart, setCart] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mapCart = (serverCart: Cart): CartItemDisplay[] => {
    return serverCart.items.map(i => ({
      product: {
        id: i.product.id,
        name: i.product.name,
        price: Number(i.product.price),
        image: i.product.image,
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
    const updated = await cartService.addToCart(String(product.id), quantity);
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
