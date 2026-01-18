export interface AvailableFilters {
  categories: FilterCategory[]
  brands: FilterBrand[]
  priceRange: PriceRange
  attributes: FilterAttribute[]
  promotions?: FilterPromotion[]
}

export interface FilterPromotion {
  id: number
  name: string
  type: string
  count: number
}

export interface FilterCategory {
  id: number
  name: string
  count: number
}

export interface FilterBrand {
  id: number
  name: string
  count: number
}

export interface PriceRange {
  min: number
  max: number
}

export interface FilterAttribute {
  id: number
  name: string
  displayType: string
  options: FilterAttributeOption[]
}

export interface FilterAttributeOption {
  id: number
  value: string
  additionalCost?: number
  count: number
}
