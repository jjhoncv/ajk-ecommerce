import { getPriceIfHasPromotion } from './ProductVariant.helpers'
import { formatPrice } from '@/module/shared/helpers/utils'
import { type ProductVariants } from '@/types/domain'
import { type FC } from 'react'

interface ProductVariantPriceProps {
  variant: ProductVariants
}

export const ProductVariantPrice: FC<ProductVariantPriceProps> = ({
  variant
}) => {
  const { finalPrice, hasPromotion, originalPrice, currentPromotion, additionalCost } =
    getPriceIfHasPromotion(variant)

  const basePrice = Number(variant?.price || 0)

  return (
    <div className="ml-1 flex flex-col gap-1">
      <div className="text-4xl font-bold">
        {formatPrice(Number(finalPrice))}
      </div>
      {hasPromotion && (
        <div className="flex items-center">
          <span className="text-lg leading-5 text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="flex flex-col items-center px-2 text-base font-semibold leading-4 text-red-600">
            {currentPromotion?.promotion?.discountType === 'percentage'
              ? `-${Number(currentPromotion.promotion.discountValue)}%`
              : `- ${formatPrice(Number(currentPromotion?.promotion?.discountValue))}`}{' '}
            dscto.
          </span>
        </div>
      )}
      {additionalCost > 0 && (
        <div className="text-xs text-gray-600">
          <span>Precio base: {formatPrice(basePrice)}</span>
          <span className="mx-1">+</span>
          <span className="font-medium text-blue-600">
            {formatPrice(additionalCost)} por atributos seleccionados
          </span>
        </div>
      )}
    </div>
  )
}
