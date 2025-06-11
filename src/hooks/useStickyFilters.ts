'use client'
import { useEffect, useState } from 'react'

interface UseStickyFiltersReturn {
  topPosition: string
  maxHeight: string
  minHeight: string
  bottomConstraint: string
}

export const useStickyFilters = (): UseStickyFiltersReturn => {
  const [topPosition, setTopPosition] = useState('128px')
  const [maxHeight, setMaxHeight] = useState('70vh')
  const [minHeight, setMinHeight] = useState('400px')
  const [bottomConstraint, setBottomConstraint] = useState('auto')

  useEffect(() => {
    const calculateDimensions = () => {
      // Obtener altura del header
      const header =
        document.querySelector('header') ||
        document.querySelector('[data-header]')
      const headerHeight = header ? header.offsetHeight : 128

      // Obtener posición del footer
      const footer =
        document.querySelector('footer') ||
        document.querySelector('[data-footer]')

      const calculatedTop = `${headerHeight + 16}px` // Posición inicial
      let calculatedMaxHeight = '70vh' // Altura por defecto
      const calculatedMinHeight = '400px' // Altura mínima
      let calculatedBottomConstraint = 'auto'

      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const footerTop = footerRect.top + window.scrollY

        // Calcular la distancia desde el top del documento hasta el footer
        // menos un margen de seguridad
        const distanceToFooter = footerTop - 32 // 32px de margen
        calculatedBottomConstraint = `${distanceToFooter}px`

        // Ajustar altura máxima basada en el espacio disponible
        const availableSpace = distanceToFooter - (headerHeight + 16)
        if (availableSpace > 400) {
          calculatedMaxHeight = `${Math.min(availableSpace, window.innerHeight * 0.7)}px`
        } else {
          calculatedMaxHeight = '400px'
        }
      }

      setTopPosition(calculatedTop)
      setMaxHeight(calculatedMaxHeight)
      setMinHeight(calculatedMinHeight)
      setBottomConstraint(calculatedBottomConstraint)
    }

    // Calcular dimensiones al montar
    calculateDimensions()

    // Recalcular en scroll y resize
    const handleScroll = () => calculateDimensions()
    const handleResize = () => calculateDimensions()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Recalcular cuando el DOM esté completamente cargado
    const timer = setTimeout(calculateDimensions, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  return {
    topPosition,
    maxHeight,
    minHeight,
    bottomConstraint
  }
}
