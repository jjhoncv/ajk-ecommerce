'use client'
import { type AvailableFilters } from '@/backend/filters'
import { type ProductSearchFilters } from '@/backend/search'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface ActiveFiltersProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
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

  // Verificar si hay filtros activos
  const hasActiveFilters =
    currentFilters.categoryId ||
    currentFilters.brandId ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    (currentFilters.attributes &&
      Object.keys(currentFilters.attributes).length > 0)

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-3">
      <h4 className="mb-2 text-sm font-medium text-gray-700">
        Filtros aplicados:
      </h4>
      <div className="flex flex-wrap gap-2">
        {/* Categoría seleccionada */}
        {currentFilters.categoryId &&
          availableFilters?.categories &&
          (() => {
            const selectedCategory = availableFilters.categories.find(
              (cat) => cat.id === currentFilters.categoryId
            )
            return selectedCategory ? (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs text-white">
                {selectedCategory.name}
                <button
                  onClick={() => {
                    updateFilter('category', null)
                  }}
                  className="ml-1 rounded-full p-0.5 hover:bg-primary/80"
                >
                  ×
                </button>
              </span>
            ) : null
          })()}

        {/* Marca seleccionada */}
        {currentFilters.brandId &&
          availableFilters?.brands &&
          (() => {
            const selectedBrand = availableFilters.brands.find(
              (brand) => brand.id === currentFilters.brandId
            )
            return selectedBrand ? (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs text-white">
                {selectedBrand.name}
                <button
                  onClick={() => {
                    updateFilter('brand', null)
                  }}
                  className="ml-1 rounded-full p-0.5 hover:bg-primary/80"
                >
                  ×
                </button>
              </span>
            ) : null
          })()}

        {/* Precio mínimo */}
        {currentFilters.minPrice && (
          <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-1 text-xs text-white">
            Min: S/ {currentFilters.minPrice}
            <button
              onClick={() => {
                updateFilter('minPrice', null)
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-green-600"
            >
              ×
            </button>
          </span>
        )}

        {/* Precio máximo */}
        {currentFilters.maxPrice && (
          <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-1 text-xs text-white">
            Max: S/ {currentFilters.maxPrice}
            <button
              onClick={() => {
                updateFilter('maxPrice', null)
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-green-600"
            >
              ×
            </button>
          </span>
        )}

        {/* Atributos seleccionados */}
        {currentFilters.attributes &&
          availableFilters?.attributes &&
          Object.entries(currentFilters.attributes).map(
            ([attributeId, optionIds]) => {
              const attribute = availableFilters.attributes.find(
                (attr) => attr.id === parseInt(attributeId)
              )
              if (!attribute) return null

              return optionIds.map((optionId) => {
                const option = attribute.options.find(
                  (opt) => opt.id === optionId
                )
                if (!option) return null

                return (
                  <span
                    key={`${attributeId}-${optionId}`}
                    className="inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                  >
                    {option.value}
                    <button
                      onClick={() => {
                        const currentValues =
                          currentFilters.attributes?.[parseInt(attributeId)] ||
                          []
                        const newValues = currentValues.filter(
                          (id) => id !== optionId
                        )

                        const params = new URLSearchParams(
                          searchParams.toString()
                        )
                        if (newValues.length > 0) {
                          params.set(`attr_${attributeId}`, newValues.join(','))
                        } else {
                          params.delete(`attr_${attributeId}`)
                        }
                        params.set('page', '1')
                        router.push(`${pathname}?${params.toString()}`)
                      }}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )
              })
            }
          )}

        {currentFilters.promotionIds &&
          currentFilters.promotionIds.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Promociones:
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentFilters.promotionIds.map((promotionId) => {
                  const promotion = availableFilters.promotions?.find(
                    (p) => p.id === promotionId
                  )
                  if (!promotion) return null

                  return (
                    <span
                      key={promotionId}
                      className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
                    >
                      {promotion.name}
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(
                            searchParams.toString()
                          )
                          const newPromotions =
                            currentFilters.promotionIds!.filter(
                              (id) => id !== promotionId
                            )

                          if (newPromotions.length > 0) {
                            params.set('promotions', newPromotions.join(','))
                          } else {
                            params.delete('promotions')
                          }

                          params.set('page', '1')
                          router.push(`${pathname}?${params.toString()}`)
                        }}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default ActiveFilters
