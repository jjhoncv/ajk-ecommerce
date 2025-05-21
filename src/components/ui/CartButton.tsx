"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/providers/CartProvider";

const CartButton: React.FC = () => {
  const { totalItems, toggleCart } = useCartContext();

  return (
    <button
      className="flex flex-col items-center relative"
      onClick={toggleCart}
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="text-xs mt-1">Carrito</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
