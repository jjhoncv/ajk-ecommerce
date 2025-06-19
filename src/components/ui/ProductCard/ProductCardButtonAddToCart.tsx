"use client";
import { getPromotions } from "@/helpers/utils";
import { useCartContext } from "@/providers/cart";
import { PromotionVariants } from "@/types/domain";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface ProductCardButtonAddToCartProps {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number
  quantity: number;
  promotionVariants?: (PromotionVariants | null)[] | null
}

const ProductCardButtonAddToCart: React.FC<ProductCardButtonAddToCartProps> = ({
  id,
  quantity,
  name,
  price,
  image,
  stock,
  promotionVariants: pvs
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

    const promotionVariants = getPromotions(pvs)

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
        stock,
        promotionVariants
      }, quantity);
      openCart()
    }
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
