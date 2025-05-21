"use client";
import { useCartContext } from "@/providers/CartProvider";
import React from "react";
import { BaseProduct } from "./ProductCard";

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
      className="w-full mt-3 bg-secondary border-secondary border text-white py-2 rounded-lg hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors"
    >
      Agregar al carrito
    </button>
  );
};

export default ButtonAddToCart;
