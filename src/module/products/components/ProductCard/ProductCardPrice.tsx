'use client'
import { getPriceIfHasPromotion } from '@/module/products/components/ProductVariant.helpers'
import { formatPrice } from '@/module/shared/helpers/utils'
import React from 'react'
import { type ProductCardPromotionProps } from './ProductCard.interfaces'

const ProductCardPrice: React.FC<Pick<ProductCardPromotionProps, 'variant'>> = ({ variant }) => {
  const { finalPrice, hasPromotion, originalPrice, currentPromotion } =
    getPriceIfHasPromotion(variant)

  return (
    <div className="mt-1 flex gap-1">
      {/* Mostrar precio original si hay promoción */}
      {/* <div className="flex gap-1 items-center"> */}
      <div>
        <div className="text-[20px] font-bold leading-[20px] text-primary">
          {formatPrice(Number(finalPrice))}
        </div>
        {/* </div> */}
        {hasPromotion && (
          <div className="text-[14px] leading-[14px] text-gray-500 line-through">
            {formatPrice(Number(originalPrice))}
          </div>
        )}
      </div>
      {hasPromotion && (
        <div className="rounded-sm text-right text-sm font-bold -tracking-widest text-red-500">
          {currentPromotion?.promotion?.discountType === 'percentage'
            ? `-${Number(currentPromotion.promotion.discountValue)}%`
            : `- ${formatPrice(Number(currentPromotion?.promotion?.discountValue))}`}
        </div>
      )}
    </div>
  )
}

export default ProductCardPrice
