// Filters exports
export { default as filtersModel } from './Filters.model'
export {
  FilterCategoryMapper,
  FilterCategoriesMapper,
  FilterBrandMapper,
  FilterBrandsMapper,
  FilterAttributeMapper,
  FilterAttributesMapper,
  AvailableFiltersMapper
} from './Filters.mapper'
export { default as filtersRepository } from './Filters.repository'
export {
  type AvailableFilters,
  type FilterPromotion,
  type FilterCategory,
  type FilterBrand,
  type PriceRange,
  type FilterAttribute,
  type FilterAttributeOption
} from './Filters.interfaces'

// Search exports
export { default as searchModel } from './Search.model'
export {
  VariantSearchResultMapper,
  VariantSearchResultsMapper,
  ProductSearchItemMapper
} from './Search.mapper'
export { default as searchRepository } from './Search.repository'
export { type VariantSearchResultRaw } from './Search.repository'
export {
  type ProductSearchFilters,
  type ProductSearchResult,
  type VariantSearchResult,
  type ProductSearchItem,
  type CategorySummary
} from './Search.interfaces'
