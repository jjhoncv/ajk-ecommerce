import { type ProductComplete } from '@/module/products/core'
import { type ProductSearchItem } from '@/module/search/core'

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
