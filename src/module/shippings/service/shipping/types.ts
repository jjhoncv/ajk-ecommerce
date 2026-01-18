export interface ShippingMethod {
  id: number
  name: string
  code: string
  description?: string | null
  estimatedDays?: string | null
  isActive?: number | null
  displayOrder?: number | null
}

export interface ShippingZone {
  id: number
  name: string
  description?: string | null
  districts?: string | null
  isActive?: number | null
}

export interface ShippingZoneMethod {
  zoneId: number
  methodId: number
  price: number
  isActive?: number | null
}
