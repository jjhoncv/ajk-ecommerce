// 📄 ShippingZone.interfaces.ts
import { ShippingZones as ShippingZone } from '@/types/domain'

export interface ShippingZoneWithMethods extends ShippingZone {
  methods?: ShippingZoneMethodInfo[]
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
