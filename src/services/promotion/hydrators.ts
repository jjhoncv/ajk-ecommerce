import { type Promotions } from '@/types/domain'
import { type Promotion } from './types'

export const hydratePromotions = (data: Promotions[]): Promotion[] => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    discountType: item.discountType,
    discountValue: item.discountValue,
    icon: item.icon ?? undefined
  }))
}
