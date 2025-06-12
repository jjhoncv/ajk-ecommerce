import { SearchParams } from '@/app/search/page'
import { ProductSearchFilters } from '@/backend/search'

export const getFilters = (params: SearchParams): ProductSearchFilters => {
  // Convertir parámetros de búsqueda a filtros
  const filters: ProductSearchFilters = {
    query: params.q,
    categoryId: params.category ? parseInt(params.category) : undefined,
    brandId: params.brand ? parseInt(params.brand) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: 12,
    sort:
      (params.sort as
        | 'price_asc'
        | 'price_desc'
        | 'name_asc'
        | 'name_desc'
        | 'newest') || 'newest'
  }

  // Procesar atributos desde searchParams
  // Formato esperado: attr_1=2,3&attr_2=5
  const attributeFilters: { [attributeId: number]: number[] } = {}

  Object.keys(params).forEach((key) => {
    if (key.startsWith('attr_')) {
      const attributeId = parseInt(key.replace('attr_', ''))
      const optionIds = (params[key] as string)
        .split(',')
        .map((id) => parseInt(id))
      attributeFilters[attributeId] = optionIds
    }
  })

  if (Object.keys(attributeFilters).length > 0) {
    filters.attributes = attributeFilters
  }

  return filters
}
