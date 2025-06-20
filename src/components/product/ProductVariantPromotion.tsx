import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import { ProductVariants } from '@/types/domain'
import { FC } from 'react'

interface ProductVariantPromotionProps {
  variant: ProductVariants
}
export const ProductVariantPromotion: FC<ProductVariantPromotionProps> = ({
  variant
}) => {
  const { hasPromotion, currentPromotion } = getPriceIfHasPromotion(variant)

  return (
    <>
      {hasPromotion && (
        <div className="flex items-center bg-gradient-to-r from-red-500 to-red-700 p-3 text-sm">
          <p className="line-clamp-1 text-[17px] font-bold leading-[17px] text-white">
            {currentPromotion?.promotion?.name}:{' '}
            {currentPromotion?.promotion?.description}
          </p>
        </div>
      )}
    </>
  )
}
