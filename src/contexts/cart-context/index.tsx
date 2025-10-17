"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CartContextType, CartItem } from "../../lib/interface/cart";
import { UserRole } from "../../lib/enums/user-role.enum";
import { cartService } from "../../lib/service/cart.service";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const isCustomer = (): boolean => {
    if (!session?.user?.role) return false;
    return session.user.role === UserRole.CUSTOMER;
  };

  const fetchCart = async () => {
    if (status !== "authenticated" || !isCustomer()) return;

    setIsLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isCustomer()) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      const updated = await cartService.addToCart(productId, quantity);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isCustomer()) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      const updated = await cartService.updateQuantity(productId, quantity);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isCustomer()) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      const updated = await cartService.removeItem(productId);
      setCart(updated.items || []);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isCustomer()) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isCustomer()) {
      fetchCart();
    } else if (status === "unauthenticated") {
      setCart([]);
    }
  }, [status, session?.user?.role]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading
      }}
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
