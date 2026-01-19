'use client'
import { type ProductSearchFilters } from '@/module/search/core'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface ClearFiltersButtonProps {
  currentFilters: ProductSearchFilters
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  currentFilters
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    // Mantener solo la query de búsqueda si existe
    if (currentFilters.query) {
      params.set('q', currentFilters.query)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <button
      onClick={clearAllFilters}
      className="text-sm text-primary hover:text-primary/80"
    >
      Limpiar filtros
    </button>
  )
}

export default ClearFiltersButton
