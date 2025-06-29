// 📄 ShippingZone.mapper.ts
import { type ShippingZones as ShippingZoneRaw } from '@/types/database'
import { type ShippingZones as ShippingZone } from '@/types/domain'

export const ShippingZoneMapper = (data: ShippingZoneRaw): ShippingZone => {
  return {
    id: data.id,
    name: data.name,
    districts: data.districts,
    isActive: data.is_active
  }
}

export const ShippingZonesMapper = (
  data: ShippingZoneRaw[] | null
): ShippingZone[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingZoneMapper)
}
