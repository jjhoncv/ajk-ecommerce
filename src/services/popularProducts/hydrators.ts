import { ProductComplete } from '@/models/Product'
import { ProductSearchItem } from '@/types/search'

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
