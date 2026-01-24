'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

interface RatingImage {
  id: number
  imageUrl: string
}

interface RatingImageModalProps {
  images: RatingImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export const RatingImageModal: React.FC<RatingImageModalProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Actualizar índice cuando cambia initialIndex
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Navegación con teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
          break
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
          break
      }
    },
    [isOpen, images.length, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Contador de imágenes */}
      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Contenedor principal */}
      <div
        className="relative flex h-full w-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón anterior */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        {/* Imagen principal */}
        <div className="relative flex items-center justify-center">
          <div className="relative h-[600px] w-[600px] max-h-[80vh] max-w-[80vw]">
            <Image
              src={currentImage.imageUrl}
              alt={`Imagen ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="600px"
              priority
            />
          </div>
        </div>

        {/* Botón siguiente */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
