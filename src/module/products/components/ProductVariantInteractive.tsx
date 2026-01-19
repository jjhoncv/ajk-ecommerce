'use client'
import { getVariantImages } from './ProductImageSlider/ProductImageSlider.helpers'
import ProductVariantAttributeSelector from './ProductVariantAttributeSelector'
import { ProductVariantInfo } from './ProductVariantInfo'
import { ProductVariantPurchase } from './ProductVariantPurchase'
import { ProductVariantRatings } from './ProductVariantRating'
import { type ProductVariantData } from '@/module/products/services/productVariant'
import { type ProductVariants } from '@/types/domain'
import React, { useState } from 'react'
import {
  ProductImageSlider,
  ProductImageSliderModal
} from './ProductImageSlider' // Nuevo import

interface ProductVariantInteractiveProps {
  initialData: ProductVariantData
  allVariants: ProductVariants[]
  variant: ProductVariants
  preview?: boolean
  handleVariantChangePreview?: (attributeId: number, optionId: number) => void
  onCartAction?: () => void
}

const ProductVariantInteractive: React.FC<ProductVariantInteractiveProps> = ({
  initialData,
  allVariants,
  variant,
  preview = false,
  handleVariantChangePreview,
  onCartAction
}) => {
  const [data, setData] = useState<ProductVariantData>(initialData)
  const { product } = data
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [initialModalImageIndex, setInitialModalImageIndex] = useState(0)

  // Manejar cambio de variante
  const handleVariantChange = (newData: ProductVariantData) => {
    setData(newData)
  }

  // Manejar click en imagen para abrir galería completa
  const handleImageClick = (imageIndex: number) => {
    setInitialModalImageIndex(imageIndex)
    setIsGalleryModalOpen(true)
  }

  // Cerrar modal de galería
  const closeGalleryModal = () => {
    setIsGalleryModalOpen(false)
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <div className="xl:col-span-9">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="xl:col-span-1">
            <ProductImageSlider
              images={getVariantImages(variant)}
              productName={product.name}
              onImageClick={handleImageClick}
            />
          </div>
          <div className="space-y-5 xl:col-span-1">
            <ProductVariantInfo product={product} variant={variant} />
            <div className="border-t border-gray-200 pt-6">
              <ProductVariantAttributeSelector
                data={data}
                preview={preview}
                allVariants={allVariants}
                variant={variant}
                onVariantChange={handleVariantChange}
                handleVariantChangePreview={handleVariantChangePreview}
              />
            </div>
          </div>
        </div>
        {!preview && (
          <div>
            <ProductVariantRatings product={product} variant={variant} />
          </div>
        )}
      </div>

      <div className="xl:col-span-3">
        <ProductVariantPurchase
          onCartAction={onCartAction}
          preview={preview}
          product={product}
          variant={variant}
        />
      </div>

      {/* Modal de galería de imágenes */}
      {!preview && (
        <ProductImageSliderModal
          isOpen={isGalleryModalOpen}
          onClose={closeGalleryModal}
          images={getVariantImages(variant)}
          productName={product.name}
          initialImageIndex={initialModalImageIndex}
        />
      )}
    </div>
  )
}

export default ProductVariantInteractive
