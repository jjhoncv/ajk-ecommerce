import searchModel, { ProductSearchItem } from '@/backend/search'
import { hydrateDealsProducts } from './hydrators'

export const getDealsProducts = async (): Promise<ProductSearchItem[]> => {
  try {
    const dealsSearchResult = await searchModel.searchProducts({
      page: 1,
      limit: 6,
      sort: 'price_desc'
    })
    return hydrateDealsProducts(dealsSearchResult.products)
  } catch (error) {
    throw new Error(
      `Error al obtener getDealsProducts ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
