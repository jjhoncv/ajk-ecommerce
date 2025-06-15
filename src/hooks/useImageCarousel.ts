import { useCallback, useEffect, useRef, useState } from 'react'

// Tipo base para imágenes compatibles
export interface BaseImage {
  id: number
  imageUrlNormal: string
  imageUrlThumb: string
  imageUrlZoom: string
  altText?: string
  imageType?: string
  displayOrder?: number
}

export interface UseImageCarouselProps {
  images: BaseImage[]
  initialIndex?: number
  mouseZoneDetection?: boolean // ✅ Prop para activar detección por zonas
  loop?: boolean
  preloadImages?: boolean
}

export interface UseImageCarouselReturn {
  // Estado actual
  currentImageIndex: number
  currentImage: BaseImage | null
  hasMultipleImages: boolean

  // Navegación
  goToNextImage: () => void
  goToPrevImage: () => void
  goToImage: (index: number) => void

  // Handlers para eventos (detección por zonas o básicos)
  handleMouseEnter: (event?: React.MouseEvent<HTMLDivElement>) => void
  handleMouseLeave: () => void
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void

  // Utilidades
  getImageAtIndex: (index: number) => BaseImage | null
  isFirstImage: boolean
  isLastImage: boolean
  totalImages: number

  // Propiedades para detección por zonas
  containerRef: React.RefObject<HTMLDivElement>
  currentZone: number
  isHovering: boolean
}

export const useImageCarousel = ({
  images,
  initialIndex = 0,
  mouseZoneDetection = false,
  loop = true,
  preloadImages = true
}: UseImageCarouselProps): UseImageCarouselReturn => {
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    if (images.length === 0) return 0
    const validIndex = Math.max(0, Math.min(initialIndex, images.length - 1))
    return validIndex
  })

  const [isHovering, setIsHovering] = useState(false)
  const [currentZone, setCurrentZone] = useState(0)
  const preloadedRef = useRef<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

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

  // ✅ Utilidades para detección por zonas
  const getZoneWidth = useCallback((): number => {
    if (!containerRef.current || totalImages <= 0) return 0
    return containerRef.current.offsetWidth / totalImages
  }, [totalImages])

  const getZoneForPosition = useCallback(
    (x: number): number => {
      const zoneWidth = getZoneWidth()
      if (zoneWidth <= 0) return 0

      const zone = Math.floor(x / zoneWidth)
      return Math.max(0, Math.min(zone, totalImages - 1))
    },
    [getZoneWidth, totalImages]
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

  // ✅ Handlers para eventos (con detección por zonas)
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseZoneDetection || !containerRef.current || !hasMultipleImages)
        return

      // Obtener posición relativa dentro del contenedor
      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left

      // Calcular zona actual
      const newZone = getZoneForPosition(x)

      // Solo actualizar si cambió la zona
      if (newZone !== currentZone) {
        setCurrentZone(newZone)
        goToImage(newZone) // ✅ Cambiar imagen cuando cambie la zona
      }
    },
    [
      mouseZoneDetection,
      hasMultipleImages,
      currentZone,
      getZoneForPosition,
      goToImage
    ]
  )

  const handleMouseEnter = useCallback(
    (event?: React.MouseEvent<HTMLDivElement>) => {
      setIsHovering(true)

      // Si está activada la detección por zonas, calcular zona inicial
      if (
        mouseZoneDetection &&
        event &&
        containerRef.current &&
        hasMultipleImages
      ) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = event.clientX - rect.left
        const initialZone = getZoneForPosition(x)

        setCurrentZone(initialZone)
        goToImage(initialZone)
      }
    },
    [mouseZoneDetection, hasMultipleImages, getZoneForPosition, goToImage]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)

    // Opcionalmente resetear a la primera imagen al salir
    if (mouseZoneDetection) {
      setCurrentZone(0)
      goToImage(0)
    }
  }, [mouseZoneDetection, goToImage])

  // Utilidad para obtener imagen por índice
  const getImageAtIndex = useCallback(
    (index: number): BaseImage | null => {
      return images[index] || null
    },
    [images]
  )

  // Efecto para actualizar índice cuando cambian las imágenes
  useEffect(() => {
    if (images.length === 0) {
      setCurrentImageIndex(0)
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
  }, [images, currentImageIndex, preloadImage, preloadImages])

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

    // Navegación
    goToNextImage,
    goToPrevImage,
    goToImage,

    // Handlers para eventos
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,

    // Utilidades
    getImageAtIndex,
    isFirstImage,
    isLastImage,
    totalImages,

    // Propiedades para detección por zonas
    containerRef,
    currentZone,
    isHovering
  }
}
