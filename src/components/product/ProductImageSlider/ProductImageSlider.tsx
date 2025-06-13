"use client";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  cleanAndValidateImages,
  findPrimaryImageIndex,
  getImageTypeLabel
} from "../ProductVariant.helpers";
// import { AttributeOptionImagesSlider } from "./ProductImage.interfaces";
import { ItemImage } from "@/shared";
import { useImageNavigation } from "./useImageNavigation";

interface ProductImageSliderProps {
  images: ItemImage[];
  productName: string;
  onImageZoom?: (imageUrl: string) => void;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
  onImageZoom,
}) => {
  // Limpiar y validar imágenes usando el helper
  const cleanImages = cleanAndValidateImages(images, productName);

  // Encontrar índice de imagen principal
  const initialIndex = findPrimaryImageIndex(cleanImages);

  // Hook para navegación
  const {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    goToNextImage,
    goToPrevImage,
    selectImage,
  } = useImageNavigation({ images: cleanImages, initialIndex });

  // Si no hay imágenes válidas
  if (cleanImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const handleZoom = () => {
    onImageZoom?.(currentImage.imageUrlZoom);
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnails al lado izquierdo */}
      {hasMultipleImages && (
        <div className="flex flex-col space-y-2 w-20">
          {cleanImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${index === currentImageIndex
                ? "border-indigo-600"
                : "border-gray-200 hover:border-gray-300"
                }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.imageUrlThumb}
                alt={image.altText}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="flex-1">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={currentImage.imageUrlNormal}
            alt={currentImage.altText}
            width={600}
            height={600}
            className="w-full h-full object-contain cursor-zoom-in"
            onClick={handleZoom}
            priority
          />

          {/* Botón de zoom */}
          <button
            onClick={handleZoom}
            className="absolute top-2 left-2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            aria-label="Ampliar imagen"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Badge del tipo de imagen */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {getImageTypeLabel(currentImage.imageType)}
          </div>

          {/* Botones de navegación */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider;
