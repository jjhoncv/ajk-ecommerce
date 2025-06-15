"use client";
import { useCartContext } from "@/providers/CartProvider";
import React from "react";

interface ProductVariantButtonAddToCartProps {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number
  quantity: number
}

const ProductVariantButtonAddToCart: React.FC<ProductVariantButtonAddToCartProps> = ({
  id,
  quantity,
  image,
  name,
  price,
  stock
}) => {
  const { updateQuantity, items, addItem } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const existsItem = items.some(item => item.id === id)
    const item = items.find(item => item.id === id)

    if (existsItem) {
      updateQuantity(id, quantity + (item?.quantity || 0));
      return
    }
    addItem({
      id,
      image,
      name,
      price,
      stock
    })
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full border border-gray-300 text-gray-700 py-3 px-4 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={(stock || 0) === 0}
    >
      Agregar al carrito
    </button>
  );
};

export default ProductVariantButtonAddToCart;
