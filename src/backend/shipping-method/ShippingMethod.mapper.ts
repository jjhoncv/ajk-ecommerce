// 📄 ShippingMethod.mapper.ts
import { type ShippingMethods as ShippingMethodRaw } from '@/types/database'
import { type ShippingMethods as ShippingMethod } from '@/types/domain'

export const ShippingMethodMapper = (
  data: ShippingMethodRaw
): ShippingMethod => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    baseCost: data.base_cost,
    estimatedDaysMin: data.estimated_days_min,
    estimatedDaysMax: data.estimated_days_max,
    freeShippingThreshold: data.free_shipping_threshold,
    isActive: data.is_active,
    displayOrder: data.display_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export const ShippingMethodsMapper = (
  data: ShippingMethodRaw[] | null
): ShippingMethod[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingMethodMapper)
}
