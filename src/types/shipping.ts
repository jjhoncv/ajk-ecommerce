// 📄 types/shipping.ts
import { type ShippingCalculation } from '@/backend/shipping-zone-method/ShippingZoneMethod.interfaces'

// Tipo para dirección con opciones de envío
export interface ShippingOptionForAddress {
  addressId: number
  address: {
    id: number
    alias: string
    streetName: string
    streetNumber: string
    district: string
    province: string
    department: string
    apartment?: string
  }
  shippingOptions: ShippingCalculation[]
  defaultShippingOption?: ShippingCalculation
}

// Respuesta del API para cálculo de envío
export interface ShippingCalculationResponse {
  defaultAddress: ShippingOptionForAddress | null
  allAddresses: ShippingOptionForAddress[]
  userId: string
  message?: string
}

// Request para cálculo de envío
export interface ShippingCalculationRequest {
  productVariantId: number
  quantity: number
  orderValue: number
}
