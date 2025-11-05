"use client";

import { Cart, CartItemDisplay } from "@/lib/interface/cart";
import { Product } from "@/lib/interface/product";
import { cartService } from "@/lib/service/cart.service";
import { useCallback, useState } from "react";

export default function useFetchCart() {
  const [cart, setCart] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mapCart = useCallback((serverCart: Cart): CartItemDisplay[] => {
    return serverCart.items.map(i => ({
      product: {
        id: i.product.id,
        name: i.product.name,
        price: Number(i.product.price),
        image: i.product.image,
      } as Product,
      quantity: i.quantity,
    }));
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const serverCart = await cartService.getCart();
      setCart(mapCart(serverCart));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [mapCart]);

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      try {
        const updated = await cartService.addToCart(
          String(product.id),
          quantity
        );
        setCart(mapCart(updated));
      } catch (err) {
        setError(err as Error);
      }
    },
    [mapCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        const updated = await cartService.updateQuantity(productId, quantity);
        setCart(mapCart(updated));
      } catch (err) {
        setError(err as Error);
      }
    },
    [mapCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        const updated = await cartService.removeItem(productId);
        setCart(mapCart(updated));
      } catch (err) {
        setError(err as Error);
      }
    },
    [mapCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

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
