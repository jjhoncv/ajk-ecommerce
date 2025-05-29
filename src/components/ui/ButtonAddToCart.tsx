"use client";
import { useCartContext } from "@/providers/CartProvider";
import React from "react";
import { BaseProduct } from "./ProductCard";
import { ShoppingCart } from "lucide-react";

const ButtonAddToCart: React.FC<BaseProduct> = (product) => {
  const { addItem } = useCartContext();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full mt-3 bg-secondary border-secondary border text-white py-2 rounded-lg hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors flex items-center justify-center gap-2"
    >
      <ShoppingCart className="h-4 w-4" />
      Agregar al carrito
    </button>
  );
};

export default ButtonAddToCart;
