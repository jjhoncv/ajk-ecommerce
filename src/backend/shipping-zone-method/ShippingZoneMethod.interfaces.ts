// 📄 ShippingZoneMethod.interfaces.ts
import { type ShippingZoneMethods as ShippingZoneMethod } from '@/types/domain'

export interface ShippingZoneMethodExtended extends ShippingZoneMethod {
  methodName?: string
  zoneName?: string
  zoneDistricts?: any[]
}

export interface ShippingCalculation {
  methodId: number
  zoneId: number
  baseCost: number
  finalCost: number
  isFree: boolean
  estimatedDays: {
    min: number
    max: number
  }
  methodName: string
  zoneName: string
}
