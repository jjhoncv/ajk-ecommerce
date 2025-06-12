'use client'
import { AvailableFilters } from '@/backend/filters'
import { ProductSearchFilters } from '@/backend/search'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { FC } from 'react'
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
          <div className='flex items-center gap-0.5'>
            <div className="flex-1">
              <InputPrice
                value={minPrice}
                onChange={setMinPrice}
                onKeyPress={handleKeyPress}
                placeholder="Min"
                hasError={!!error}
              />
            </div>
            <span className="text-gray-500 flex-shrink-0">-</span>
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
            className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            OK
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </CollapsibleSection>
  )
}

export default PriceRangeFilter
