import { type ProductVariantComplete } from '@/backend/product-variant'
export interface ProductComplete {
  variants: ProductVariantComplete[]
  variantId: number
  variantPrice: number
  name: string
}
