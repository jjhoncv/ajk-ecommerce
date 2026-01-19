// hooks/useHeroSlider.ts
'use client'

import { type Banner } from '@/module/banners/service/banner/types'
import { useCallback, useEffect, useState } from 'react'
import { createSliderLayout, shouldRenderSlider } from './HeroSlider.helpers'
import { type HeroSliderLayout, type SideBanner } from './HeroSlider.interfaces'

export interface UseHeroSliderProps {
  slides: Banner[]
  sideBanners?: SideBanner[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export interface UseHeroSliderReturn {
  // Estado
  currentSlide: number
  layout: HeroSliderLayout
  shouldRender: boolean

  // Acciones
  nextSlide: () => void
  prevSlide: () => void
  goToSlide: (index: number) => void

  // Utilidades
  canGoPrev: boolean
  canGoNext: boolean
}

export const useHeroSlider = ({
  slides,
  sideBanners = [],
  autoPlay = false,
  autoPlayInterval = 5000
}: UseHeroSliderProps): UseHeroSliderReturn => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Crear layout de información
  const layout = createSliderLayout(slides.length, sideBanners.length)
  const shouldRender = shouldRenderSlider(layout)

  // Verificar si se puede navegar
  const canGoPrev = currentSlide > 0 && slides.length > 1
  const canGoNext = currentSlide < slides.length - 1 && slides.length > 1

  // Navegación hacia adelante
  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Navegación hacia atrás
  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Ir a un slide específico
  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index)
      }
    },
    [slides.length]
  )

  // Auto-play funcionalidad
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const intervalId = setInterval(nextSlide, autoPlayInterval)

    return () => {
      clearInterval(intervalId)
    }
  }, [autoPlay, autoPlayInterval, nextSlide, slides.length])

  // Resetear slide cuando cambian los slides
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0)
    }
  }, [slides.length, currentSlide])

  return {
    // Estado
    currentSlide,
    layout,
    shouldRender,

    // Acciones
    nextSlide,
    prevSlide,
    goToSlide,

    // Utilidades
    canGoPrev,
    canGoNext
  }
}
