'use client'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { type AvailableFilters } from '@/backend/filters'
import { type ProductSearchFilters } from '@/backend/search'

interface CategoryFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
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

  if (
    !availableFilters?.categories ||
    availableFilters.categories.length === 0
  ) {
    return null
  }

  return (
    <CollapsibleSection title="Categorías" className="mb-0">
      <div className="space-y-2">
        {availableFilters.categories.map((category) => (
          <label key={category.id} className="flex items-center">
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={currentFilters.categoryId === category.id}
              onChange={(e) => {
 updateFilter(
                  'category',
                  e.target.checked ? e.target.value : null
                )
}
              }
              className="mr-2"
            />
            <span className="text-sm">
              {category.name} ({category.count})
            </span>
          </label>
        ))}
      </div>
    </CollapsibleSection>
  )
}

export default CategoryFilter
