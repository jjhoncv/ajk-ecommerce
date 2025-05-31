"use client";
import React, { JSX } from "react";
import { getPromotionDiscount } from "./ProductCard.helpers";
import { ProductCardVariantsProps } from "./ProductCard.interfaces";

const ProductCardPrice: React.FC<ProductCardVariantsProps> = ({
  variantProduct,
}) => {
  const selectedVariant = variantProduct.variants[0];

  const Discount = (): JSX.Element | null => {
    const promotionDiscount = getPromotionDiscount(selectedVariant);
    if (promotionDiscount === null) return null;
    return (
      <div className="bg-red-500 px-1 py-0.5 font-bold text-white text-xs rounded-sm">
        -{promotionDiscount}%
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 mt-4">
      {/* Mostrar precio original si hay promoción */}
      <div className="flex gap-1 items-center">
        <div className="text-[18px] leading-[18px] font-bold text-primary">
          S/{" "}
          {selectedVariant.promotion?.promotionPrice || selectedVariant.price}
        </div>
        {Discount()}
      </div>
      {selectedVariant.promotion && (
        <div className="text-[14px] leading-[14px] text-gray-500 line-through">
          S/ {selectedVariant.price}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
