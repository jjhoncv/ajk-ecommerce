import { useEffect, useState } from 'react'

interface UseImageSliderProps {
  imagesLength: number
  autoSlideInterval?: number
}

export const useImageSlider = ({
  imagesLength,
  autoSlideInterval = 2000
}: UseImageSliderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSliderActive, setIsSliderActive] = useState(false)

  // Efecto para cambiar automáticamente las imágenes cuando el slider está activo
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSliderActive && imagesLength > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesLength)
      }, autoSlideInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSliderActive, imagesLength, autoSlideInterval])

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const startSlider = () => {
    setIsSliderActive(true)
  }

  const stopSlider = () => {
    setIsSliderActive(false)
  }

  return {
    currentImageIndex,
    isSliderActive,
    goToImage,
    startSlider,
    stopSlider
  }
}
