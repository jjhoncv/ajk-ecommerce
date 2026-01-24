'use client'
import { CollapsibleSection } from '@/module/shared/components/ui'
import Link from 'next/link'
import React from 'react'

import { type AvailableFilters, type ProductSearchFilters } from '@/module/search/core'

interface SubcategoryFilterProps {
  availableFilters: AvailableFilters & {
    categories: Array<{ id: number; name: string; slug?: string; count: number }>
  }
  currentFilters: ProductSearchFilters
}

const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({
  availableFilters
}) => {
  if (
    !availableFilters?.categories ||
    availableFilters.categories.length === 0
  ) {
    return null
  }

  return (
    <CollapsibleSection title="Subcategorías" className="mb-0">
      <div className="space-y-2">
        {availableFilters.categories.map((category) => (
          <Link
            key={category.id}
            href={`/categoria/${category.slug || category.id}`}
            className="block text-sm text-gray-700 hover:text-gray-900 hover:underline"
          >
            {category.name}
            {category.count > 0 && (
              <span className="ml-1 text-gray-500">({category.count})</span>
            )}
          </Link>
        ))}
      </div>
    </CollapsibleSection>
  )
}

export default SubcategoryFilter
