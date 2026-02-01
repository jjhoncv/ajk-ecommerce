import { type ProductVariants as ProductVariant } from '@/types/domain'

// Tag data for variant display
export interface VariantTag {
  id: number
  name: string
  slug: string
  color: string
}

export interface ProductVariantComplete extends ProductVariant {
  // Extended variant properties
  tags?: VariantTag[]
}

export interface ProductComplete {
  variants: ProductVariantComplete[]
  variantId: number
  variantPrice: number
  name: string
  // Tags for the selected variant (convenience property)
  tags?: VariantTag[]
}
