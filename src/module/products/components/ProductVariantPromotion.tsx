import { getPriceIfHasPromotion } from './ProductVariant.helpers'
import { PromotionBanner } from '@/module/promotions/components'
import { type ProductVariants } from '@/types/domain'
import { type Promotion } from '@/module/promotions/services/types'
import { type FC } from 'react'

interface ProductVariantPromotionProps {
  variant: ProductVariants
}
export const ProductVariantPromotion: FC<ProductVariantPromotionProps> = ({
  variant
}) => {
  const { hasPromotion, currentPromotion } = getPriceIfHasPromotion(variant)

  // Convert domain promotion to service promotion type
  const promotion: Promotion | null = currentPromotion?.promotion ? {
    id: currentPromotion.promotion.id,
    name: currentPromotion.promotion.name ?? '',
    description: currentPromotion.promotion.description ?? '',
    discountType: currentPromotion.promotion.discountType,
    discountValue: currentPromotion.promotion.discountValue,
    startDate: currentPromotion.promotion.startDate?.toString() ?? '',
    endDate: currentPromotion.promotion.endDate?.toString() ?? '',
    type: currentPromotion.promotion.type ?? '',
    imageUrl: currentPromotion.promotion.imageUrl ?? ''
  } : null

  return (
    <>
      {hasPromotion && promotion && (
        <PromotionBanner promotion={promotion} size="small" />
      )}
    </>
  )
}
