import { type ProductSearchFilters } from '@/module/search/core'
import {
  SEARCH_INITIAL_PAGE,
  SEARCH_PRODUCTS_PER_PAGE
} from '@/constants/search.constants'
import { type FILTER_SORT, SEARCH_SORT, type SearchParams } from '@/shared'

export const formatParams = (params: SearchParams): ProductSearchFilters => {
  const filters = {
    query: params.q,
    categoryId: params.category ? parseInt(params.category) : undefined,
    brandId: params.brand ? parseInt(params.brand) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    page: params.page ? parseInt(params.page) : SEARCH_INITIAL_PAGE,
    limit: SEARCH_PRODUCTS_PER_PAGE,
    sort: (params.sort as FILTER_SORT) || SEARCH_SORT.NEWEST
  }
  return filters
}

export const getFilters = (params: SearchParams): ProductSearchFilters => {
  // Convertir parámetros de búsqueda a filtros
  const filters = formatParams(params)

  // Procesar atributos desde searchParams
  // Formato esperado: attr_1=2,3&attr_2=5
  const attributeFilters: Record<number, number[]> = {}

  let promotionIds: number[] = []

  Object.keys(params).forEach((key) => {
    if (key.startsWith('attr_')) {
      const attributeId = parseInt(key.replace('attr_', ''))
      const optionIds = (params[key] as string)
        .split(',')
        .map((id) => parseInt(id))
      attributeFilters[attributeId] = optionIds
    }

    // ✅ Manejar parámetros de promociones
    if (key === 'promotions') {
      promotionIds = (params[key] as string)
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id))
    }
  })

  if (Object.keys(attributeFilters).length > 0) {
    filters.attributes = attributeFilters
  }

  // ✅ Agregar promociones a los filtros
  if (promotionIds.length > 0) {
    filters.promotionIds = promotionIds
  }

  return filters
}
