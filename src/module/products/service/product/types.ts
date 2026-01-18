export interface ProductAdmin {
  id: number
  name: string
  description?: string | null
  basePrice: number
  brandId?: number | null
  brand?: {
    id: number
    name: string
  } | null
  variantsCount: number
  totalStock: number
  minPrice: number
  maxPrice: number
  mainImage?: string | null
  isActive: boolean
  categories?: Array<{
    id: number
    name: string
  }>
}

export interface Product {
  id: number
  name: string
  description?: string | null
  basePrice: number
  brandId?: number | null
  isActive: boolean
}
