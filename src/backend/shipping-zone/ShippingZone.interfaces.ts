// 📄 ShippingZone.interfaces.ts
import { ShippingZoneMethodExtended } from '@/backend/shipping-zone-method'
import { type ShippingZones as ShippingZone } from '@/types/domain'

export interface ShippingZoneWithMethods extends ShippingZone {
  methods?: ShippingZoneMethodExtended[]
}

export interface ShippingZoneMethodInfo {
  id: number
  shippingMethodId: number
  methodName: string
  cost: number
  estimatedDaysMin?: number
  estimatedDaysMax?: number
  freeShippingThreshold?: number
  isActive?: number
}

export interface DistrictInfo {
  name: string
  province: string
  department: string
}
