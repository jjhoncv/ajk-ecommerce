import { type ProductSearchItem } from '@/module/search/core'

export const hydrateDealsProducts = (
  data: ProductSearchItem[]
): ProductSearchItem[] => {
  return data.map((item) => ({
    ...item
  }))
}
