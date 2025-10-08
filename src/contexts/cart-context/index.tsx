"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { cartService, CartItem } from "@/lib/service/cart.service";

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const updated = await cartService.addToCart(productId, quantity);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };


  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const updated = await cartService.updateQuantity(productId, quantity);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updated = await cartService.removeItem(productId);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
