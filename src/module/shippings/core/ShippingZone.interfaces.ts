import { type ShippingZones as ShippingZone } from '@/types/domain'
import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'

export interface ShippingZoneMethodWithDetails extends ShippingZoneMethodRaw {
  method_name?: string
  zone_name?: string
  zone_districts?: unknown
}

export interface ShippingZoneMethodExtended {
  id: number
  shippingZoneId: number
  shippingMethodId: number
  cost: number
  estimatedDaysMin?: number
  estimatedDaysMax?: number
  freeShippingThreshold?: number
  isActive?: number
  methodName?: string
}

export interface ShippingZoneWithMethods extends ShippingZone {
  methods?: ShippingZoneMethodWithDetails[]
  districtCount?: number
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
