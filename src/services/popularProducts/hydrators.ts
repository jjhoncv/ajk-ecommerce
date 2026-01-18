import { type ProductComplete, type ProductSearchItem } from '@/module/products/core'

export const hydratePopularProducts = (
  data: ProductSearchItem[]
): ProductComplete[] => {
  return data.map((item) => ({
    name: item.name,
    variantId: item.variantId,
    variantPrice: item.variantPrice,
    variants: item.variants
  }))
}
