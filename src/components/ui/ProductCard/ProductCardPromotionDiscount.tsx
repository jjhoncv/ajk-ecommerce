"use client";
import React from "react";
import { ProductCardPromotionProps } from "./ProductCard.interfaces";

const ProductCardPromotionDiscount: React.FC<ProductCardPromotionProps> = ({
  variant,
}) => {
  // Si no hay promoción, no mostrar nada
  if (!variant.promotion) {
    return null;
  }

  const promotion = variant.promotion;
  const originalPrice = variant.price;
  const promotionPrice = promotion.promotionPrice || 0;

  // Calcular el porcentaje de descuento
  const discountPercentage =
    promotion.discountType === "percentage"
      ? promotion.discountValue
      : Math.round(((originalPrice - promotionPrice) / originalPrice) * 100);

  // Calcular el ahorro
  const savings = originalPrice - promotionPrice;

  // Si la promoción tiene un límite de stock
  const hasStockLimit =
    promotion.stockLimit !== null && variant.stock <= promotion.stockLimit;

  return (
    <>
      {/* Badges de promoción y stock */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <div className="promotion-badge bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{discountPercentage}% DSCTO
        </div>

        {hasStockLimit && (
          <div className="stock-badge bg-orange-500 inline text-white text-xs font-bold px-2 py-1 rounded-lg">
            ¡Solo {variant.stock}!
          </div>
        )}
      </div>

      {/* Precios */}
      <div className="text-xs bg-green-100 inline rounded-sm py-1 px-2 text-green-600">
        Ahorras S/ {savings.toFixed(2)}
      </div>
    </>
  );
};

export default ProductCardPromotionDiscount;
