'use client'
import { type AvailableFilters, type ProductSearchFilters } from '@/module/search/core'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { type FC } from 'react'
import InputPrice from './InputPrice'
import { usePriceRangeFilter } from './usePriceRangeFilter'

interface PriceRangeFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const PriceRangeFilter: FC<PriceRangeFilterProps> = ({
  availableFilters,
  currentFilters
}) => {
  const {
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    error,
    applyPriceFilter,
    handleKeyPress
  } = usePriceRangeFilter({ availableFilters, currentFilters })

  if (!availableFilters?.priceRange) {
    return null
  }

  return (
    <CollapsibleSection title="Precio" className="mb-0">
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <div className="flex-1">
              <InputPrice
                value={minPrice}
                onChange={setMinPrice}
                onKeyPress={handleKeyPress}
                placeholder="Min"
                hasError={!!error}
              />
            </div>
            <span className="flex-shrink-0 text-gray-500">-</span>
            <div className="flex-1">
              <InputPrice
                value={maxPrice}
                onChange={setMaxPrice}
                onKeyPress={handleKeyPress}
                placeholder="Max"
                hasError={!!error}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="flex-shrink-0 rounded bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            OK
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </CollapsibleSection>
  )
}

export default PriceRangeFilter
