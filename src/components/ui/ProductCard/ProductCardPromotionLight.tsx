'use client'
import React from 'react'
import { type ProductCardPromotionProps } from './ProductCard.interfaces'

const ProductCardPromotionLight: React.FC<ProductCardPromotionProps> = ({
  variant
}) => {
  // Si no hay promoción, no mostrar nada
  if (!variant.promotion) {
    return null
  }

  const promotion = variant.promotion
  const originalPrice = variant.price
  const promotionPrice = promotion.promotionPrice || 0

  // Calcular el porcentaje de descuento
  const discountPercentage =
    promotion.discountType === 'percentage'
      ? promotion.discountValue
      : Math.round(((originalPrice - promotionPrice) / originalPrice) * 100)

  // Calcular el ahorro
  const savings = originalPrice - promotionPrice

  // Si la promoción tiene un límite de stock
  const hasStockLimit =
    promotion.stockLimit !== null && variant.stock <= promotion.stockLimit

  return (
    <>
      {/* Badges de promoción y stock */}
      <div className="absolute left-2 top-2 flex flex-col gap-1">
        <div className="promotion-badge rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
          -{discountPercentage}% DSCTO
        </div>

        {hasStockLimit && (
          <div className="stock-badge inline rounded-lg bg-orange-500 px-2 py-1 text-xs font-bold text-white">
            ¡Solo {variant.stock}!
          </div>
        )}
      </div>

      {/* Precios */}
      <div className="inline rounded-sm bg-green-100 px-2 py-1 text-xs text-green-600">
        Ahorras S/ {savings.toFixed(2)}
      </div>
    </>
  )
}

export default ProductCardPromotionLight
