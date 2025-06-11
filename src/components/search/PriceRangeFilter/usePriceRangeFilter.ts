import { SearchFiltersProps } from '@/interfaces/components/search.interface'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { priceSchema } from './schema'

interface UsePriceRangeFilterProps {
  availableFilters: SearchFiltersProps['availableFilters']
  currentFilters: SearchFiltersProps['currentFilters']
}

export const usePriceRangeFilter = ({
  availableFilters,
  currentFilters
}: UsePriceRangeFilterProps) => {
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() || ''
  )
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() || ''
  )
  const [error, setError] = useState('')

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const applyPriceFilter = () => {
    try {
      const minVal = minPrice ? parseFloat(minPrice) : undefined
      const maxVal = maxPrice ? parseFloat(maxPrice) : undefined

      // Validar con Zod
      priceSchema.parse({ minPrice: minVal, maxPrice: maxVal })

      // Validar rango disponible
      if (availableFilters?.priceRange) {
        if (minVal && minVal < availableFilters.priceRange.min) {
          setError(
            `El precio mínimo debe ser mayor a S/ ${availableFilters.priceRange.min}`
          )
          return
        }
        if (maxVal && maxVal > availableFilters.priceRange.max) {
          setError(
            `El precio máximo debe ser menor a S/ ${availableFilters.priceRange.max}`
          )
          return
        }
      }

      setError('')

      const params = new URLSearchParams(searchParams.toString())

      if (minVal) {
        params.set('minPrice', minVal.toString())
      } else {
        params.delete('minPrice')
      }

      if (maxVal) {
        params.set('maxPrice', maxVal.toString())
      } else {
        params.delete('maxPrice')
      }

      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError('Por favor, introduce números válidos en el rango de precios')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyPriceFilter()
    }
  }

  return {
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    error,
    applyPriceFilter,
    handleKeyPress
  }
}
