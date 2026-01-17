'use client'
import { type AvailableFilters } from '@/backend/filters'
import { type ProductSearchFilters } from '@/backend/search'

import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface AttributeFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({
  availableFilters,
  currentFilters
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  if (
    !availableFilters?.attributes ||
    availableFilters.attributes.length === 0
  ) {
    return null
  }

  // Filtrar atributos inválidos
  const validAttributes = availableFilters.attributes.filter(
    (attr) => attr && typeof attr.id === 'number' && attr.name && attr.options?.length > 0
  )

  if (validAttributes.length === 0) {
    return null
  }

  return (
    <div>
      {validAttributes.map((attribute) => (
        <CollapsibleSection
          key={attribute.id}
          title={attribute.name}
          className="mb-0"
        >
          <div className="space-y-1">
            {attribute.options
              .filter((opt) => opt && typeof opt.id === 'number' && opt.value)
              .map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={String(option.id)}
                  checked={
                    currentFilters.attributes?.[attribute.id]?.includes(
                      option.id
                    ) || false
                  }
                  onChange={(e) => {
                    const currentValues =
                      currentFilters.attributes?.[attribute.id] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option.id]
                      : currentValues.filter((id) => id !== option.id)

                    const params = new URLSearchParams(searchParams.toString())
                    if (newValues.length > 0) {
                      params.set(`attr_${attribute.id}`, newValues.join(','))
                    } else {
                      params.delete(`attr_${attribute.id}`)
                    }
                    params.set('page', '1')
                    router.push(`${pathname}?${params.toString()}`)
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{option.value}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  )
}

export default AttributeFilter
