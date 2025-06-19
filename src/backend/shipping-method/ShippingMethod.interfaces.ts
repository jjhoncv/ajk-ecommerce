// 📄 ShippingMethod.interfaces.ts
import { ShippingMethods as ShippingMethod } from '@/types/domain'

export interface ShippingMethodWithZones extends ShippingMethod {
  zones?: ShippingZoneMethod[]
}

export interface ShippingZoneMethod {
  id: number
  shippingZoneId: number
  cost: number
  estimatedDaysMin?: number
  estimatedDaysMax?: number
  freeShippingThreshold?: number
  isActive?: number
  zoneName: string
  districts: string[]
}
