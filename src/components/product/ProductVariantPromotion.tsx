import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import PromotionBanner from '@/components/promotion/PromotionBanner'
import { type ProductVariants } from '@/types/domain'
import { type FC } from 'react'

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
        <PromotionBanner promotion={currentPromotion?.promotion} size="small" />
      )}
    </>
  )
}
