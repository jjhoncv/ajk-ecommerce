'use client'
import { ProductSearchFilters } from '@/backend/search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface SearchSortingProps {
  currentSort?: ProductSearchFilters['sort']
}
interface ExtendedSearchSortingProps extends SearchSortingProps {
  variant?: 'select' | 'toggle'
}

const SearchSorting: React.FC<ExtendedSearchSortingProps> = ({
  currentSort,
  variant = 'select'
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const sortOptions = [
    {
      key: 'newest',
      label: 'Más recientes',
      asc: 'newest',
      desc: 'newest' // Solo hay una dirección para "más recientes"
    },
    {
      key: 'price',
      label: 'Precio',
      asc: 'price_asc',
      desc: 'price_desc'
    },
    {
      key: 'name',
      label: 'Nombre',
      asc: 'name_asc',
      desc: 'name_desc'
    }
  ]

  // Función para determinar qué opción está activa y su dirección
  const getActiveSort = () => {
    const current = currentSort || 'newest'
    for (const option of sortOptions) {
      if (current === option.asc || current === option.desc) {
        return {
          key: option.key,
          direction: current === option.desc ? 'desc' : 'asc'
        }
      }
    }
    return { key: 'newest', direction: 'asc' }
  }

  const activeSort = getActiveSort()

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortValue)
    params.set('page', '1') // Reset to first page when sorting
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleToggleDirection = (option: (typeof sortOptions)[0]) => {
    if (option.key === 'newest') {
      // Para "más recientes" solo hay una opción
      handleSortChange(option.asc)
      return
    }

    // Para precio y nombre, alternar entre asc y desc
    const currentValue = currentSort || 'newest'
    const isCurrentlyAsc = currentValue === option.asc
    const newValue = isCurrentlyAsc ? option.desc : option.asc
    handleSortChange(newValue)
  }

  if (variant === 'toggle') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const isActive = activeSort.key === option.key
            const isDesc = activeSort.direction === 'desc'

            return (
              <button
                key={option.key}
                onClick={() => handleToggleDirection(option)}
                className={`flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {option.key !== 'newest' && (
                  <span className="text-xs">
                    {isActive && isDesc ? '↓' : '↑'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700"
      >
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={currentSort || 'newest'}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="newest">Más recientes</option>
        <option value="price_asc">Precio: menor a mayor</option>
        <option value="price_desc">Precio: mayor a menor</option>
        <option value="name_asc">Nombre: A-Z</option>
        <option value="name_desc">Nombre: Z-A</option>
      </select>
    </div>
  )
}

export default SearchSorting
