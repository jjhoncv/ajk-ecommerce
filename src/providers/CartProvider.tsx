"use client";
import { CartItem, useCart } from "@/hooks/useCart";
import React, { createContext, useContext } from "react";

// Tipo para el contexto del carrito

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, initialQuantity?: number) => void // 👈 Agregar parámetro opcional
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook para usar el contexto del carrito
export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Usar el hook personalizado para la lógica del carrito
  const cart = useCart();

  const value: CartContextType = {
    items: cart.items,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    incrementQuantity: cart.incrementQuantity,
    decrementQuantity: cart.decrementQuantity,
    clearCart: cart.clearCart,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    isCartOpen: cart.isCartOpen,
    openCart: cart.openCart,
    closeCart: cart.closeCart,
    toggleCart: cart.toggleCart,
    toastMessage: cart.toastMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
