import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'
import { type ShippingZoneMethods as ShippingZoneMethod } from '@/types/domain'

export const ShippingZoneMethodMapper = (
  data: ShippingZoneMethodRaw
): ShippingZoneMethod => {
  return {
    id: data.id,
    shippingMethodId: data.shipping_method_id,
    shippingZoneId: data.shipping_zone_id,
    cost: Number(data.cost),
    estimatedDaysMin: Number(data.estimated_days_min),
    estimatedDaysMax: Number(data.estimated_days_max),
    freeShippingThreshold: Number(data.free_shipping_threshold),
    isActive: data.is_active
  }
}

export const ShippingZoneMethodsMapper = (
  data: ShippingZoneMethodRaw[] | null
): ShippingZoneMethod[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingZoneMethodMapper)
}
