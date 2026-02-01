import { type AvailableFilters } from './Filters.interfaces'
import { type ProductVariantComplete } from '@/module/products/core'

export interface ProductSearchFilters {
  query?: string
  categoryId?: number
  brandId?: number
  minPrice?: number
  maxPrice?: number
  attributes?: Record<number, number[]>
  page?: number
  limit?: number
  promotionIds?: number[]
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
}

export interface ProductSearchResult {
  products: ProductSearchItem[]
  totalCount: number
  page: number
  totalPages: number
  filters: AvailableFilters
}

export interface VariantSearchResult {
  variantId: number
  productId: number
  sku: string
  price: number
  stock: number
  productName: string
  productDescription: string
  brandId: number
  basePrice: number
}

export interface ProductSearchItem {
  id: number
  name: string
  description?: string
  brandId?: number
  brandName: string
  basePrice?: number
  minVariantPrice: number
  categories: CategorySummary[]
  variants: ProductVariantComplete[]
  mainImage?: string
  // Campos especificos de variante para resultados de busqueda
  variantId: number
  variantSku?: string
  variantPrice: number
  variantStock?: number
}

export interface CategorySummary {
  id: number
  name: string
}
