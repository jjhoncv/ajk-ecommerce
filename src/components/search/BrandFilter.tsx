'use client'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { AvailableFilters } from '@/backend/filters'
import { ProductSearchFilters } from '@/backend/search'

interface BrandFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  availableFilters,
  currentFilters
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    params.set('page', '1') // Reset to first page when filtering
    router.push(`${pathname}?${params.toString()}`)
  }

  if (!availableFilters?.brands || availableFilters.brands.length === 0) {
    return null
  }

  return (
    <CollapsibleSection title="Marcas" className="mb-0">
      <div className="space-y-2">
        {availableFilters.brands.map((brand) => (
          <label key={brand.id} className="flex items-center">
            <input
              type="radio"
              name="brand"
              value={brand.id}
              checked={currentFilters.brandId === brand.id}
              onChange={(e) =>
                updateFilter('brand', e.target.checked ? e.target.value : null)
              }
              className="mr-2"
            />
            <span className="text-sm">
              {brand.name} ({brand.count})
            </span>
          </label>
        ))}
      </div>
    </CollapsibleSection>
  )
}

export default BrandFilter
