// ============================================================================
// INTERFACES PARA BÚSQUEDA Y FILTROS DE PRODUCTOS
// ============================================================================

import { Brands, Categories, Products, ProductVariants } from '@/types/domain'

export interface ProductSearchFilters {
  query?: string
  categoryId?: number
  brandId?: number
  minPrice?: number
  maxPrice?: number
  attributes?: {
    [attributeId: number]: number[] // attributeId -> array de optionIds
  }
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
}

export interface ProductSearchResult {
  products: ProductSearchItem[]
  totalCount: number
  page: number
  totalPages: number
  filters: AvailableFilters
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
  variants: ProductVariants[]
  mainImage?: string
  // Campos específicos de variante para resultados de búsqueda
  variantId?: number
  variantSku?: string
  variantPrice?: number
  variantStock?: number
}

export interface CategorySummary {
  id: number
  name: string
}

export interface BrandSummary {
  id: number
  name: string
}

export interface AvailableFilters {
  categories: FilterCategory[]
  brands: FilterBrand[]
  priceRange: PriceRange
  attributes: FilterAttribute[]
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

// Interfaces para composición de productos
export interface ProductWithVariants extends Products {
  productVariants: ProductVariants[]
}

export interface ProductWithBrand extends Products {
  brands: Brands[]
}

export interface ProductWithCategories extends Products {
  categories: Categories[]
}

export interface ProductComplete extends Products {
  productVariants: ProductVariants[]
  brands: Brands[]
  categories: Categories[]
}

// Interface para resultados de búsqueda de variantes
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
