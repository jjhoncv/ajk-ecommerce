import { type PromotionsDiscountType } from '@/types/domain'

export interface Promotion {
  id: number
  name: string
  description: string
  discountType: PromotionsDiscountType
  discountValue: number
  startDate: string
  endDate: string
  type: string
  imageUrl: string
}

export interface BannerPromotion {
  title: string
  subtitle: string
  image: string
  link: string
}
