"use client";
import { useCartContext } from "@/providers/CartProvider";
import React from "react";

interface ProductVariantButtonAddToCartProps {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
}

const ProductVariantButtonAddToCart: React.FC<ProductVariantButtonAddToCartProps> = ({
  id,
  quantity,
  image,
  name,
  price,
  stock
}) => {
  const { updateQuantity, items, addItem, openCart } = useCartContext();

  // Encontrar el item en el carrito si existe
  const existingItem = items.find(item => item.id === id);
  // const currentCartQuantity = existingItem?.quantity || 0;

  // Verificaciones
  const isOutOfStock = stock === 0;
  const exceedsStock = quantity > stock;
  // const sameAsCart = existingItem && currentCartQuantity === quantity;

  // El botón se deshabilita si no hay stock, excede stock, o ya tiene esa cantidad
  const isDisabled = isOutOfStock || exceedsStock;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isDisabled) return;

    if (existingItem) {
      // Establecer la cantidad total (no sumar)
      updateQuantity(id, quantity);
    } else {
      // Agregar nuevo item
      addItem({
        id,
        image,
        name,
        price,
        stock
      }, quantity);
      openCart()
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`border border-gray-300 text-gray-700 hover:bg-gray-50 w-full py-3 px-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={isDisabled}
    >
      Agregar al carrito
    </button>
  );
};

export default ProductVariantButtonAddToCart;