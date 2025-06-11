import { PromotionVariants as PromotionVariant } from '@/types/domain'

export interface PromotionSummaryForVariant {
  totalPromotions: number
  bestPromotion: PromotionVariant | undefined
  availablePromotions: PromotionVariant[] | undefined
  averageDiscountPercentage: number
}

export interface PromotionMetrics {
  totalVariants: number
  variantsWithStock: number
  totalStockLimit: number
  averagePromotionPrice: number
}
