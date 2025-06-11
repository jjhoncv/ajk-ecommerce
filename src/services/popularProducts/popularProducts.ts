import { ProductComplete } from '@/models/Product'
import searchModel from '@/models/Search.model'
import { hydratePopularProducts } from './hydrators'

export const popularProducts = async (): Promise<ProductComplete[]> => {
  try {
    const popularSearchResult = await searchModel.searchProducts({
      page: 1,
      limit: 7,
      sort: 'newest'
    })
    return hydratePopularProducts(popularSearchResult.products)
  } catch (error) {
    throw new Error(
      `Error al obtener popularSearchResult ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
