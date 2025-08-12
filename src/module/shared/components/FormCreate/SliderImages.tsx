import { ChevronLeft, ChevronRight, Edit } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface SliderImagesProps {
  images: string[]
  className?: string
  showArrows?: boolean
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onClickEdit: () => void
}

export const SliderImages: React.FC<SliderImagesProps> = ({
  images,
  className = '',
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onClickEdit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto play
  React.useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => {
      clearInterval(interval)
      setCurrentIndex(0)
    }
  }, [autoPlay, autoPlayInterval])

  useEffect(() => {
    setCurrentIndex(0)
  }, [images])

  if (!images.length) return null

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className="group relative h-full overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => onClickEdit()}
          className="absolute left-0 right-0 top-[90px] z-10 mx-auto flex w-[110px] gap-3 rounded border border-transparent bg-sky-600 px-4 py-2 text-white opacity-0 transition-all group-hover:opacity-100"
        >
          <Edit size={20} />
          Editar
        </button>

        {/* Imagen actual */}
        <div className="relative h-full w-full">
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="object-scale-down transition-opacity duration-500"
            priority
          />
        </div>

        {/* Flechas de navegación */}
        {showArrows && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/75"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/75"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicadores de posición */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-4 bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
