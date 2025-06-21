import searchModel, {
  type ProductSearchFilters,
  type ProductSearchResult
} from '@/backend/search'

export const getSearchParams = async (
  filters: ProductSearchFilters
): Promise<ProductSearchResult> => {
  try {
    const searchResults = await searchModel.searchProducts(filters)
    return searchResults
  } catch (error) {
    throw new Error(
      `Error al obtener getSearchParams ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
