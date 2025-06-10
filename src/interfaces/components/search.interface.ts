import { Attributes, Brands, Categories } from '@/types/domain'
import {
  ProductSearchFilters,
  ProductSearchItem,
  ProductSearchResult
} from '@/types/search'

// Interface para SearchFilters - usando tipos de domain directamente
export interface SearchFiltersProps {
  categories: Categories[]
  brands: Brands[]
  attributes: Attributes[]
  availableFilters: ProductSearchResult['filters']
  currentFilters: ProductSearchFilters
}

// Interface para SearchResults - usando ProductSearchItem directamente
export interface SearchResultsProps {
  products: ProductSearchItem[]
  totalPages: number
  currentPage: number
  currentFilters: ProductSearchFilters
  defaultView?: 'grid' | 'list'
}

// Interface para SearchSorting
export interface SearchSortingProps {
  currentSort?: ProductSearchFilters['sort']
}
