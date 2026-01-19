'use client'
import React from 'react'
import { Clock } from 'lucide-react'
import { type ProductCardPromotionProps } from './ProductCard.interfaces'

const ProductCardPromotion: React.FC<ProductCardPromotionProps> = ({
  variant,
  layout = 'grid'
}) => {
  // Si no hay promoción, no mostrar nada
  const promotionVariant = variant.promotionVariants?.[0]
  if (!promotionVariant?.promotion) {
    return null
  }

  const promotion = promotionVariant.promotion
  const originalPrice = variant.price
  const promotionPrice = promotionVariant.promotionPrice || 0

  // Calcular el porcentaje de descuento
  const discountPercentage =
    promotion.discountType === 'percentage'
      ? promotion.discountValue
      : Math.round(((originalPrice - promotionPrice) / originalPrice) * 100)

  // Calcular tiempo restante
  const now = new Date()
  const endDate = new Date(promotion.endDate)
  const timeRemaining = endDate.getTime() - now.getTime()

  // Convertir a días, horas, minutos
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  // Formatear tiempo restante
  let timeRemainingText = ''
  if (days > 0) {
    timeRemainingText = `${days}d ${hours}h`
  } else if (hours > 0) {
    timeRemainingText = `${hours}h ${minutes}m`
  } else {
    timeRemainingText = `${minutes}m`
  }

  // Si la promoción tiene un límite de stock
  const hasStockLimit = promotionVariant.stockLimit !== null
  const stockPercentage = hasStockLimit
    ? Math.min(100, Math.max(0, (variant.stock / promotionVariant.stockLimit) * 100))
    : 0

  return (
    <div className="mb-3 mt-2">
      {/* Etiqueta de descuento */}
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
          {discountPercentage}% OFF
        </span>
        <span className="text-sm text-gray-500">{promotion.name}</span>
      </div>

      {/* Tiempo restante */}
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
        <Clock className="h-4 w-4" />
        <span>Termina en: {timeRemainingText}</span>
      </div>

      {/* Barra de progreso de stock (si aplica) */}
      {hasStockLimit && (
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Disponible: {variant.stock}</span>
            <span>Límite: {promotionVariant.stockLimit}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-secondary"
              style={{
                width: `${stockPercentage}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCardPromotion
