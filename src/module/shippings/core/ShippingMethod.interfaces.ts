import { type ShippingMethods as ShippingMethod } from '@/types/domain'
import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'

export interface ShippingZoneMethodWithDetails extends ShippingZoneMethodRaw {
  method_name?: string
  zone_name?: string
  zone_districts?: unknown
}

export interface ShippingMethodWithZones extends ShippingMethod {
  zones?: ShippingZoneMethodWithDetails[]
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
