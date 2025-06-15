"use client";
import { useCartContext } from "@/providers/CartProvider";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface ProductCardButtonAddToCartProps {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number
}

const ProductCardButtonAddToCart: React.FC<ProductCardButtonAddToCartProps> = ({
  id,
  name,
  price,
  image,
  stock
}) => {
  const { addItem, openCart } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price,
      image,
      stock
    });
    openCart()
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-3 absolute w-10 h-10 bottom-2 right-2 bg-secondary border-secondary border text-white py-2 rounded-full hover:bg-transparent hover:border-secondary hover:border-2 hover:bg-secondary-200 hover:text-secondary transition-colors flex items-center justify-center gap-2"
    >
      <ShoppingCart className="h-6 w-6" />
    </button>
  );
};

export default ProductCardButtonAddToCart;
