import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'
import { type ShippingZoneMethods as ShippingZoneMethod } from '@/types/domain'

export const ShippingZoneMethodMapper = (
  data: ShippingZoneMethodRaw
): ShippingZoneMethod => {
  return {
    id: data.id,
    shippingMethodId: data.shipping_method_id,
    shippingZoneId: data.shipping_zone_id,
    cost: data.cost,
    estimatedDaysMin: data.estimated_days_min,
    estimatedDaysMax: data.estimated_days_max,
    freeShippingThreshold: data.free_shipping_threshold,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export const ShippingZoneMethodsMapper = (
  data: ShippingZoneMethodRaw[] | null
): ShippingZoneMethod[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingZoneMethodMapper)
}
