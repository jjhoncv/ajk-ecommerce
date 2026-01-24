import { type PromotionsDiscountType } from '@/types/domain'

export type ButtonType = 'mini' | 'normal'

export interface Promotion {
  id: number
  name: string
  slug?: string | null
  discountType: PromotionsDiscountType
  discountValue: number
  icon?: string
}
