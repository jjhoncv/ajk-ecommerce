'use client'
import { Modal } from '@/components/ui/Modal' // 👈 USAR TU MODAL
import { ItemImage } from '@/shared'
import { X } from 'lucide-react'
import React from 'react'
import { ProductImageSlider } from './ProductImageSlider'

interface ProductImageSliderModalProps {
  isOpen: boolean
  onClose: () => void
  images: ItemImage[]
  productName: string
  initialImageIndex?: number
}

export const ProductImageSliderModal: React.FC<
  ProductImageSliderModalProps
> = ({ isOpen, onClose, images, productName, initialImageIndex = 0 }) => {
  // const handleImageZoom = (imageUrl: string) => {
  //   // Abrir imagen en nueva ventana para zoom máximo
  //   // window.open(imageUrl, '_blank');
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // 👈 CLASES PERSONALIZADAS PARA ESTE MODAL ESPECÍFICO
      className="max-h-[95vh] max-w-7xl overflow-hidden rounded-lg p-0"
    >
      {/* 👈 CONTENIDO DEL MODAL SIN EL BACKDROP (YA LO MANEJA Modal) */}
      <>
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Galería de {productName}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Cerrar galería"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido del modal con el slider */}
        <div className="max-h-[calc(95vh-80px)] overflow-y-auto bg-white p-6">
          <ProductImageSlider
            images={images}
            productName={productName}
            initialImageIndex={initialImageIndex}
            isInModal={true}
            showImageType={true}
            thumbsPosition="left"
          />
        </div>

        {/* Footer con información adicional */}
        <div className="border-t bg-gray-50 px-6 py-3">
          <p className="text-sm text-gray-600">
            Usa las flechas de navegación o haz clic en las miniaturas para
            cambiar de imagen. Haz clic en la imagen principal para zoom
            completo.
          </p>
        </div>
      </>
    </Modal>
  )
}
