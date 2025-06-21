'use client'

import { useState } from 'react'
import { type CleanImage } from '../ProductVariant.helpers'

interface UseImageNavigationProps {
  images: CleanImage[]
  initialIndex?: number
}

export const useImageNavigation = ({
  images,
  initialIndex = 0
}: UseImageNavigationProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const selectImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index)
    }
  }

  const currentImage = images[currentImageIndex]
  const hasMultipleImages = images.length > 1

  return {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    goToNextImage,
    goToPrevImage,
    selectImage
  }
}
