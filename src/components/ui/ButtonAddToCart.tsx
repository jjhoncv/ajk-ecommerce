"use client";
import { useCartContext } from "@/providers/CartProvider";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface ButtonAddToCartProps {
  id: number;
  name: string;
  image: string;
  price: number;
}

const ButtonAddToCart: React.FC<ButtonAddToCartProps> = ({
  id,
  name,
  price,
  image,
}) => {
  const { addItem } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price,
      image,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-3 absolute w-10 h-10 bottom-2 right-2 bg-secondary border-secondary border text-white py-2 rounded-full hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors flex items-center justify-center gap-2"
    >
      <ShoppingCart className="h-6 w-6" />
    </button>
  );
};

export default ButtonAddToCart;
