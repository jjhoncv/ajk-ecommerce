'use client'
import { type AvailableFilters, type ProductSearchFilters } from '@/module/search/core'
import ActiveFilters from '../ActiveFilters'
import AttributeFilter from '../AttributeFilter'
import CategoryFilter from '../CategoryFilter'
import SubcategoryFilter from '../SubcategoryFilter'
import PriceRangeFilter from '../PriceRangeFilter'
import PromotionFilter from '../PromotionFilter'
import React from 'react'

interface SearchFiltersProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
  hideMainCategoryFilter?: boolean
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  availableFilters,
  currentFilters,
  hideMainCategoryFilter = false
}) => {
  return (
    <div className="rounded-lg bg-white py-6">
      {/* Filtros activos */}
      <ActiveFilters
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />

      {/* Categorías o Subcategorías */}
      {hideMainCategoryFilter ? (
        <SubcategoryFilter
          availableFilters={availableFilters}
          currentFilters={currentFilters}
        />
      ) : (
        <CategoryFilter
          availableFilters={availableFilters}
          currentFilters={currentFilters}
        />
      )}

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
