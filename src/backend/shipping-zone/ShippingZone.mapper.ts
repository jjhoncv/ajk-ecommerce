// 📄 ShippingZone.mapper.ts
import { type ShippingZones as ShippingZoneRaw } from '@/types/database'
import { type ShippingZones as ShippingZone } from '@/types/domain'

export const ShippingZoneMapper = (data: ShippingZoneRaw): ShippingZone => {
  return {
    id: data.id,
    name: data.name,
    districts: data.districts,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export const ShippingZonesMapper = (
  data: ShippingZoneRaw[] | null
): ShippingZone[] | undefined => {
  if (data === null) return undefined
  return data.map(ShippingZoneMapper)
}
