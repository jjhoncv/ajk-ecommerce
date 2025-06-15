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
  const { updateQuantity, items, addItem } = useCartContext();

  // Encontrar el item en el carrito si existe
  const existingItem = items.find(item => item.id === id);
  const currentCartQuantity = existingItem?.quantity || 0;

  // Verificaciones
  const isOutOfStock = stock === 0;
  const exceedsStock = quantity > stock;
  const sameAsCart = existingItem && currentCartQuantity === quantity;

  // El botón se deshabilita si no hay stock, excede stock, o ya tiene esa cantidad
  const isDisabled = isOutOfStock || exceedsStock || sameAsCart;

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
    }
  };

  // Función para obtener el texto del botón
  const getButtonText = () => {
    if (isOutOfStock) {
      return "Sin stock";
    }
    if (exceedsStock) {
      return `Stock insuficiente (máximo ${stock})`;
    }
    if (sameAsCart) {
      return `${quantity > 1 ? `${quantity} unidades` : '1 unidad'} en carrito`;
    }

    if (existingItem) {
      return `Actualizar a ${quantity > 1 ? `${quantity} unidades` : '1 unidad'}`;
    } else {
      return `Agregar ${quantity > 1 ? `${quantity} unidades` : '1 unidad'} al carrito`;
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 px-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sameAsCart
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      disabled={isDisabled}
      title={exceedsStock ? `Máximo ${stock} unidades disponibles` : undefined}
    >
      {getButtonText()}
    </button>
  );
};

export default ProductVariantButtonAddToCart;