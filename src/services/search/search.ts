import searchModel, {
  ProductSearchFilters,
  ProductSearchResult
} from '@/backend/search'

export const getSearch = async (
  filters: ProductSearchFilters
): Promise<ProductSearchResult> => {
  try {
    const searchResults = await searchModel.searchProducts(filters)
    return searchResults
  } catch (error) {
    throw new Error(
      `Error al obtener getSearch ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
