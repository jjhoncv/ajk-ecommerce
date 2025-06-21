'use client'
import { type CleanImage } from '@/components/product/ProductVariant.helpers'
import { useImageCarousel } from '@/hooks/useImageCarousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface ImageGalleryDotsProps {
  images: CleanImage[]
  productName: string
  className?: string
  mouseZoneDetection?: boolean // ✅ Nueva prop
  showDotsIndicator?: boolean
  showImageCounter?: boolean
  showZoneIndicator?: boolean // Para debugging
  onImageClick?: (imageIndex: number) => void
}

export const ImageGalleryDots: React.FC<ImageGalleryDotsProps> = ({
  images,
  productName,
  className = 'w-full aspect-square overflow-hidden relative bg-gray-50 rounded',
  mouseZoneDetection = false, // ✅ Por defecto desactivado
  showDotsIndicator = true,
  showImageCounter = false,
  showZoneIndicator = false,
  onImageClick
}) => {
  const {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove, // ✅ Nuevo handler
    goToImage,
    totalImages,
    containerRef, // ✅ Ref que necesitas usar
    currentZone,
    isHovering
  } = useImageCarousel({
    images,
    initialIndex: 0,
    mouseZoneDetection, // ✅ Pasar la prop
    loop: true,
    preloadImages: true
  })

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-400">Sin imágenes</span>
        </div>
      </div>
    )
  }

  const handleClick = () => {
    onImageClick?.(currentImageIndex)
  }

  return (
    <div
      ref={containerRef} // ✅ AQUÍ usas el containerRef
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove} // ✅ Agregar el handler de mouse move
    >
      {/* Imagen actual */}
      {currentImage && (
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={handleClick}
        >
          <Image
            src={currentImage.imageUrlNormal}
            alt={
              currentImage.altText ||
              `${productName} - Imagen ${currentImageIndex + 1}`
            }
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-opacity duration-200"
            priority={currentImageIndex === 0}
          />
        </div>
      )}

      {/* Precargar imágenes siguientes (ocultas) */}
      {images.map(
        (image, idx) =>
          idx !== currentImageIndex && (
            <div
              key={`preload-${idx}`}
              className="pointer-events-none absolute inset-0 opacity-0"
            >
              <Image
                src={image.imageUrlNormal}
                alt={image.altText || ''}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
          )
      )}

      {/* Indicadores de puntos */}
      {showDotsIndicator && hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 z-40 flex -translate-x-1/2 transform gap-1.5 rounded-full bg-black/20 px-2 py-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-200',
                currentImageIndex === idx
                  ? 'scale-110 bg-white'
                  : 'bg-white/60 hover:bg-white/80'
              )}
              onClick={(e) => {
                e.stopPropagation()
                goToImage(idx)
                e.preventDefault()
              }}
              aria-label={`Ver imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador de imágenes */}
      {showImageCounter && hasMultipleImages && (
        <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          {currentImageIndex + 1}/{totalImages}
        </div>
      )}
    </div>
  )
}
