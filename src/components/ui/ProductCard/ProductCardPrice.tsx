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
      <div className="text-red-500 font-bold -tracking-widest text-sm rounded-sm">
        -{promotionDiscount}%
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      {/* Mostrar precio original si hay promoción */}
      <div className="flex gap-1 items-center">
        <div className="text-[20px] leading-[20px] font-bold text-primary">
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
