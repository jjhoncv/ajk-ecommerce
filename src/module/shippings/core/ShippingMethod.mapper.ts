import { type ShippingMethods as ShippingMethodRaw } from '@/types/database'
import { type ShippingMethods as ShippingMethod } from '@/types/domain'

export const ShippingMethodMapper = (
  data: ShippingMethodRaw
): ShippingMethod => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    baseCost: Number(data.base_cost),
    estimatedDaysMin: Number(data.estimated_days_min),
    estimatedDaysMax: Number(data.estimated_days_max),
    freeShippingThreshold: Number(data.free_shipping_threshold),
    isActive: data.is_active,
    displayOrder: data.display_order
  }
}

export const ShippingMethodsMapper = (
  data: ShippingMethodRaw[] | null
): ShippingMethod[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingMethodMapper)
}
