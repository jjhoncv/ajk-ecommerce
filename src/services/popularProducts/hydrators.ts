import { type ProductComplete } from '@/backend/product'
import { type ProductSearchItem } from '@/backend/search'

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
