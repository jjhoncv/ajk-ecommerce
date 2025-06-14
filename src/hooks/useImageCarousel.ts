import { ItemImage } from '@/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseImageCarouselProps {
  images: ItemImage[]
  initialIndex?: number
  autoSlideInterval?: number
  autoSlideOnHover?: boolean
  loop?: boolean
  preloadImages?: boolean
}

export interface UseImageCarouselReturn {
  // Estado actual
  currentImageIndex: number
  currentImage: ItemImage | null
  hasMultipleImages: boolean
  isPlaying: boolean

  // Navegación
  goToNextImage: () => void
  goToPrevImage: () => void
  goToImage: (index: number) => void

  // Control de auto-slide
  startAutoSlide: () => void
  stopAutoSlide: () => void
  toggleAutoSlide: () => void

  // Handlers para eventos
  handleMouseEnter: () => void
  handleMouseLeave: () => void

  // Utilidades
  getImageAtIndex: (index: number) => ItemImage | null
  isFirstImage: boolean
  isLastImage: boolean
  totalImages: number
}

export const useImageCarousel = ({
  images,
  initialIndex = 0,
  autoSlideInterval = 2000,
  autoSlideOnHover = true,
  loop = true,
  preloadImages = true
}: UseImageCarouselProps): UseImageCarouselReturn => {
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    // Validar índice inicial
    if (images.length === 0) return 0
    const validIndex = Math.max(0, Math.min(initialIndex, images.length - 1))
    return validIndex
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const preloadedRef = useRef<Set<number>>(new Set())

  // Propiedades derivadas
  const hasMultipleImages = images.length > 1
  const currentImage = images[currentImageIndex] || null
  const isFirstImage = currentImageIndex === 0
  const isLastImage = currentImageIndex === images.length - 1
  const totalImages = images.length

  // Función para precargar imágenes
  const preloadImage = useCallback(
    (index: number) => {
      if (!preloadImages || preloadedRef.current.has(index) || !images[index])
        return

      const img = new Image()
      img.src = images[index].imageUrlNormal
      preloadedRef.current.add(index)
    },
    [images, preloadImages]
  )

  // Navegación básica
  const goToImage = useCallback(
    (index: number) => {
      if (images.length === 0) return

      const validIndex = Math.max(0, Math.min(index, images.length - 1))
      setCurrentImageIndex(validIndex)

      // Precargar imagen actual y adyacentes
      if (preloadImages) {
        preloadImage(validIndex)
        if (validIndex > 0) preloadImage(validIndex - 1)
        if (validIndex < images.length - 1) preloadImage(validIndex + 1)
      }
    },
    [images.length, preloadImage, preloadImages]
  )

  const goToNextImage = useCallback(() => {
    if (images.length === 0) return

    if (isLastImage) {
      if (loop) {
        goToImage(0)
      }
    } else {
      goToImage(currentImageIndex + 1)
    }
  }, [currentImageIndex, isLastImage, loop, goToImage, images.length])

  const goToPrevImage = useCallback(() => {
    if (images.length === 0) return

    if (isFirstImage) {
      if (loop) {
        goToImage(images.length - 1)
      }
    } else {
      goToImage(currentImageIndex - 1)
    }
  }, [currentImageIndex, isFirstImage, loop, goToImage, images.length])

  // Control de auto-slide
  const clearAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoSlide = useCallback(() => {
    if (!hasMultipleImages || autoSlideInterval <= 0) return

    clearAutoSlide()
    setIsPlaying(true)

    intervalRef.current = setInterval(() => {
      goToNextImage()
    }, autoSlideInterval)
  }, [hasMultipleImages, autoSlideInterval, clearAutoSlide, goToNextImage])

  const stopAutoSlide = useCallback(() => {
    clearAutoSlide()
    setIsPlaying(false)
  }, [clearAutoSlide])

  const toggleAutoSlide = useCallback(() => {
    if (isPlaying) {
      stopAutoSlide()
    } else {
      startAutoSlide()
    }
  }, [isPlaying, startAutoSlide, stopAutoSlide])

  // Handlers para eventos del mouse
  const handleMouseEnter = useCallback(() => {
    if (autoSlideOnHover && hasMultipleImages) {
      startAutoSlide()
    }
  }, [autoSlideOnHover, hasMultipleImages, startAutoSlide])

  const handleMouseLeave = useCallback(() => {
    if (autoSlideOnHover) {
      stopAutoSlide()
    }
  }, [autoSlideOnHover, stopAutoSlide])

  // Utilidad para obtener imagen por índice
  const getImageAtIndex = useCallback(
    (index: number): ItemImage | null => {
      return images[index] || null
    },
    [images]
  )

  // Efecto para limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      clearAutoSlide()
    }
  }, [clearAutoSlide])

  // Efecto para actualizar índice cuando cambian las imágenes
  useEffect(() => {
    if (images.length === 0) {
      setCurrentImageIndex(0)
      stopAutoSlide()
      return
    }

    // Si el índice actual es mayor que el número de imágenes, resetear
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(0)
    }

    // Precargar primera imagen
    if (preloadImages && images.length > 0) {
      preloadImage(0)
    }
  }, [images, currentImageIndex, stopAutoSlide, preloadImage, preloadImages])

  // Efecto para manejar cambios en initialIndex
  useEffect(() => {
    if (
      initialIndex !== undefined &&
      initialIndex >= 0 &&
      initialIndex < images.length
    ) {
      goToImage(initialIndex)
    }
  }, [initialIndex, images.length, goToImage])

  return {
    // Estado actual
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    isPlaying,

    // Navegación
    goToNextImage,
    goToPrevImage,
    goToImage,

    // Control de auto-slide
    startAutoSlide,
    stopAutoSlide,
    toggleAutoSlide,

    // Handlers para eventos
    handleMouseEnter,
    handleMouseLeave,

    // Utilidades
    getImageAtIndex,
    isFirstImage,
    isLastImage,
    totalImages
  }
}
