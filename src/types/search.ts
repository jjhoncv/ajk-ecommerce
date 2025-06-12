// ============================================================================
// INTERFACES PARA BÚSQUEDA Y FILTROS DE PRODUCTOS
// ============================================================================

import { Brands, Categories, Products, ProductVariants } from '@/types/domain'

export interface CategorySummary {
  id: number
  name: string
}

export interface BrandSummary {
  id: number
  name: string
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
