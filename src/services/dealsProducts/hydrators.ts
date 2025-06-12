import { ProductSearchItem } from '@/backend/search'

export const hydrateDealsProducts = (
  data: ProductSearchItem[]
): ProductSearchItem[] => {
  return data.map((item) => ({
    ...item
  }))
}
