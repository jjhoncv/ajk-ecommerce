'use client'
import {
  type ProductSearchFilters,
  type ProductSearchItem
} from '@/backend/search'
import PromotionBanner from '@/components/promotion/PromotionBanner'
import Pagination from '@/components/search/Pagination'
import { SearchNotFound } from '@/components/search/SearchNotFound'
import SearchSorting from '@/components/search/SearchSorting'
import ProductCard from '@/components/ui/ProductCard'
import { type Promotion } from '@/services/promotion/types'
import React from 'react'

interface SearchResultsProps {
  promotion: Promotion | null
  products: ProductSearchItem[]
  totalPages: number
  currentPage: number
  currentFilters: ProductSearchFilters
  defaultView?: 'grid' | 'list'
}

const SearchResults: React.FC<SearchResultsProps> = ({
  promotion,
  products,
  totalPages,
  currentPage,
  defaultView: viewMode = 'grid',
  currentFilters: filters
}) => {
  if (products.length === 0) {
    return <SearchNotFound />
  }

  return (
    <div>
      {promotion != null && <PromotionBanner promotion={promotion} />}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center justify-end">
          <SearchSorting currentSort={filters.sort} variant="toggle" />
        </div>
      </div>

      {/* Productos en modo grid o list */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
            : 'flex flex-col space-y-4'
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.variantId || product.id}
            product={product}
          />
        ))}
      </div>

      {/* Paginación */}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  )
}

export default SearchResults
