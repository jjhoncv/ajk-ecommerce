'use client'
import { useState } from 'react'

interface UseNavigationReturn {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

// Hook personalizado para manejar el estado del menú de categorías
export const useNavigation = (): UseNavigationReturn => {
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false)

  const handleToggle = (): void => {
    setIsCategoriesMenuOpen((prev) => !prev)
  }

  const handleClose = (): void => {
    setIsCategoriesMenuOpen(false)
  }

  return {
    isOpen: isCategoriesMenuOpen,
    toggle: handleToggle,
    close: handleClose
  }
}
