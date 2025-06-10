"use client";
import React, { JSX } from "react";
import { ProductCardVariantsProps } from "./ProductCard.interfaces";

const ProductCardPrice: React.FC<ProductCardVariantsProps> = ({
  variantProduct,
}) => {
  const selectedVariant = variantProduct;

  // Verificar si hay promoción basándose en la nueva estructura
  const hasPromotion = !!selectedVariant.promotion || (selectedVariant.promotionVariants && selectedVariant.promotionVariants.length > 0);

  // Obtener precio promocional de la nueva estructura o la antigua
  const promotionPrice = selectedVariant.promotion?.promotionPrice ||
    (selectedVariant.promotionVariants?.[0]?.promotionPrice) ||
    null;

  // Promociones detectadas correctamente

  const Discount = (): JSX.Element | null => {
    if (!hasPromotion || !promotionPrice) return null;

    const originalPrice = Number(selectedVariant.price);
    const discountedPrice = Number(promotionPrice);
    const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    return (
      <div className="text-red-500 font-bold -tracking-widest text-sm rounded-sm">
        -{discountPercentage}%
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      {/* Mostrar precio original si hay promoción */}
      <div className="flex gap-1 items-center">
        <div className="text-[20px] leading-[20px] font-bold text-primary">
          S/ {promotionPrice || selectedVariant.price}
        </div>
        {Discount()}
      </div>
      {hasPromotion && (
        <div className="text-[14px] leading-[14px] text-gray-500 line-through">
          S/ {selectedVariant.price}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
