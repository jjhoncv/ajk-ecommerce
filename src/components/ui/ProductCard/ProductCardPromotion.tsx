"use client";
import React from "react";
import { Clock } from "lucide-react";
import { ProductCardPromotionProps } from "./ProductCard.interfaces";

const ProductCardPromotion: React.FC<ProductCardPromotionProps> = ({
  variant,
  layout = "grid",
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

  // Calcular tiempo restante
  const now = new Date();
  const endDate = new Date(promotion.endDate);
  const timeRemaining = endDate.getTime() - now.getTime();

  // Convertir a días, horas, minutos
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  // Formatear tiempo restante
  let timeRemainingText = "";
  if (days > 0) {
    timeRemainingText = `${days}d ${hours}h`;
  } else if (hours > 0) {
    timeRemainingText = `${hours}h ${minutes}m`;
  } else {
    timeRemainingText = `${minutes}m`;
  }

  // Si la promoción tiene un límite de stock
  const hasStockLimit = promotion.stockLimit !== null;
  const stockPercentage = hasStockLimit
    ? Math.min(100, Math.max(0, (variant.stock / promotion.stockLimit) * 100))
    : 0;

  return (
    <div className="mt-2 mb-3">
      {/* Etiqueta de descuento */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
          {discountPercentage}% OFF
        </span>
        <span className="text-sm text-gray-500">{promotion.name}</span>
      </div>

      {/* Tiempo restante */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
        <Clock className="h-4 w-4" />
        <span>Termina en: {timeRemainingText}</span>
      </div>

      {/* Barra de progreso de stock (si aplica) */}
      {hasStockLimit && (
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Disponible: {variant.stock}</span>
            <span>Límite: {promotion.stockLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full"
              style={{
                width: `${stockPercentage}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCardPromotion;
