'use client'
import { type AvailableFilters } from '@/backend/filters'
import { type ProductSearchFilters } from '@/backend/search'
import ActiveFilters from '@/components/search/ActiveFilters'
import AttributeFilter from '@/components/search/AttributeFilter'
import PriceRangeFilter from '@/components/search/PriceRangeFilter'
import PromotionFilter from '@/components/search/PromotionFilter'
import React from 'react'

interface SearchFiltersProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  availableFilters,
  currentFilters
}) => {
  return (
    <div className="rounded-lg bg-white py-6">
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <ClearFiltersButton currentFilters={currentFilters} />
      </div> */}

      {/* Filtros activos */}
      <ActiveFilters
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />

      {/* Categorías */}
      {/* <CategoryFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      /> */}

      {/* Marcas */}
      {/* <BrandFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      /> */}

      <PromotionFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />

      {/* Atributos */}
      <AttributeFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />

      {/* Rango de precios */}
      <PriceRangeFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />
    </div>
  )
}

export default SearchFilters
