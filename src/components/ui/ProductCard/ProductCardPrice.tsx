"use client";
import { getPriceIfHasPromotion } from "@/components/product/ProductVariant.helpers";
import { formatPrice } from "@/helpers/utils";
import React from "react";
import { ProductCardVariantsProps } from "./ProductCard.interfaces";

const ProductCardPrice: React.FC<ProductCardVariantsProps> = ({
  variant,
}) => {
  const { finalPrice, hasPromotion, originalPrice, currentPromotion } = getPriceIfHasPromotion(variant)

  return (
    <div className="flex flex-col gap-1 mt-2">
      {/* Mostrar precio original si hay promoción */}
      <div className="flex gap-1 items-center">
        <div className="text-[20px] leading-[20px] font-bold text-primary">
          {formatPrice(Number(finalPrice))}
        </div>
        {hasPromotion &&
          <div className="text-red-500 font-bold -tracking-widest text-sm rounded-sm">
            {currentPromotion?.promotion?.discountType === 'percentage'
              ? `-${Number(currentPromotion.promotion.discountValue)}%`
              : `- ${formatPrice(Number(currentPromotion?.promotion?.discountValue))}`}
            {' '}dscto.
          </div>
        }
      </div>
      {hasPromotion && (
        <div className="text-[14px] leading-[14px] text-gray-500 line-through">
          {formatPrice(Number(originalPrice))}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
