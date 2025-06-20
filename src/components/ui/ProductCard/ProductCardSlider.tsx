'use client'
import { cleanAndValidateImages } from '@/components/product/ProductVariant.helpers'
import { ImageGalleryDots } from '@/components/ui/ImageGalleryDots'
import { ItemImage } from '@/shared'
import { Heart } from 'lucide-react'
import React from 'react'

interface ProductCardSliderProps {
  images: ItemImage[]
  productName: string
  onImageClick?: (imageIndex: number) => void
  showFavoriteButton?: boolean
  mouseZoneDetection?: boolean // ✅ Nueva prop (reemplaza autoSlideInterval y autoSlideOnHover)
  showZoneIndicator?: boolean // ✅ Para debugging
  className?: string
}

const ProductCardSlider: React.FC<ProductCardSliderProps> = ({
  images,
  productName,
  onImageClick,
  showFavoriteButton = true,
  mouseZoneDetection = true, // ✅ Por defecto activado para cards de producto
  showZoneIndicator = false, // ✅ Para debugging, por defecto false
  className = 'relative mb-2 group'
}) => {
  const cleanImages = cleanAndValidateImages(images, productName)

  return (
    <div className={className}>
      <ImageGalleryDots
        images={cleanImages}
        productName={productName}
        mouseZoneDetection={mouseZoneDetection} // ✅ Nueva prop
        showZoneIndicator={showZoneIndicator} // ✅ Para debugging
        showDotsIndicator={true}
        showImageCounter={false}
        onImageClick={onImageClick}
        className="relative aspect-square w-full overflow-hidden rounded bg-gray-50"
      />

      {/* Botón de favoritos */}
      {showFavoriteButton && (
        <button
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default ProductCardSlider
