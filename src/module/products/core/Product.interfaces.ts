import { type ProductVariants as ProductVariant } from '@/types/domain'

export interface ProductVariantComplete extends ProductVariant {
  // Extended variant properties
}

export interface ProductComplete {
  variants: ProductVariantComplete[]
  variantId: number
  variantPrice: number
  name: string
}
