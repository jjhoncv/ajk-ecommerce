"use client";
import { useCart } from "@/hooks/useCart";
import { CartContext } from "./Cart.context";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Simplemente usar el hook y pasar todo el valor
  const cartValue = useCart();

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}