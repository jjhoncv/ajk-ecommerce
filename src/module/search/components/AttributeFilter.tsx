'use client'
import { type AvailableFilters, type ProductSearchFilters } from '@/module/search/core'

import { CollapsibleSection } from '@/module/shared/components/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface AttributeFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

// Helper para convertir option.id (puede ser "6,12") a array de números
const parseOptionIds = (optionId: string): number[] => {
  return optionId.split(',').map((id) => parseInt(id)).filter((id) => !isNaN(id))
}

// Helper para verificar si una opción está seleccionada
// Una opción está seleccionada si TODOS sus IDs están en los filtros actuales
const isOptionSelected = (optionId: string, currentValues: number[]): boolean => {
  const optionIds = parseOptionIds(optionId)
  return optionIds.length > 0 && optionIds.every((id) => currentValues.includes(id))
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
              .filter((opt) => opt && opt.id && opt.value)
              .map((option) => {
                const optionIds = parseOptionIds(option.id)
                const currentValues = currentFilters.attributes?.[attribute.id] || []
                const isChecked = isOptionSelected(option.id, currentValues)

                return (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={isChecked}
                      onChange={(e) => {
                        let newValues: number[]

                        if (e.target.checked) {
                          // Agregar todos los IDs de esta opción
                          newValues = [...new Set([...currentValues, ...optionIds])]
                        } else {
                          // Remover todos los IDs de esta opción
                          newValues = currentValues.filter((id) => !optionIds.includes(id))
                        }

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
                )
              })}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  )
}

export default AttributeFilter
