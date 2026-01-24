'use client'
import { getPriceIfHasPromotion } from '@/module/products/components/ProductVariant.helpers'
import { formatPrice } from '@/module/shared/helpers/utils'
import { type VariantActiveOffer } from '@/module/offers/core'
import React from 'react'
import { type ProductCardPromotionProps } from './ProductCard.interfaces'

interface ProductCardPriceProps {
  variant: ProductCardPromotionProps['variant']
  offer?: VariantActiveOffer | null
}

const ProductCardPrice: React.FC<ProductCardPriceProps> = ({ variant, offer }) => {
  const { finalPrice, hasPromotion, originalPrice, currentPromotion } =
    getPriceIfHasPromotion(variant)

  // Si hay oferta activa, mostrar precio de oferta
  if (offer) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(offer.offerPrice)}
          </span>
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">
            -{offer.discountPercent}%
          </span>
        </div>
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(offer.originalPrice)}
        </span>
      </div>
    )
  }

  // Si no hay oferta, mostrar precio de promoción o normal
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-primary">
          {formatPrice(Number(finalPrice))}
        </span>
        {hasPromotion && (
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">
            {currentPromotion?.promotion?.discountType === 'percentage'
              ? `-${Number(currentPromotion.promotion.discountValue)}%`
              : `-${formatPrice(Number(currentPromotion?.promotion?.discountValue))}`}
          </span>
        )}
      </div>
      {hasPromotion && (
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(Number(originalPrice))}
        </span>
      )}
    </div>
  )
}

export default ProductCardPrice
