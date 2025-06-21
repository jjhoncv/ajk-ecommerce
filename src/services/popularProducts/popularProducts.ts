import { type ProductComplete } from '@/backend/product'
import searchModel from '@/backend/search'
import { hydratePopularProducts } from './hydrators'

export const getPopularProducts = async (): Promise<ProductComplete[]> => {
  try {
    const popularSearchResult = await searchModel.searchProducts({
      page: 1,
      limit: 6,
      sort: 'newest'
    })

    return hydratePopularProducts(popularSearchResult.products)
  } catch (error) {
    throw new Error(
      `Error al obtener popularSearchResult ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
