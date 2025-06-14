"use client";
import { cn } from "@/lib/utils";
import { ItemImage } from "@/shared";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  cleanAndValidateImages,
  findPrimaryImageIndex,
  getImageTypeLabel
} from "../ProductVariant.helpers";
import { useImageNavigation } from "./useImageNavigation";

interface ProductImageSliderProps {
  images: ItemImage[];
  productName: string;
  onImageZoom?: (imageUrl: string) => void;
  onImageClick?: (imageIndex: number) => void;
  initialImageIndex?: number;
  isInModal?: boolean;
}

export const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
  onImageZoom,
  onImageClick,
  initialImageIndex,
  isInModal = false,
}) => {
  // Limpiar y validar imágenes usando el helper
  const cleanImages = cleanAndValidateImages(images, productName);

  // Encontrar índice de imagen principal
  const defaultInitialIndex = findPrimaryImageIndex(cleanImages);
  const actualInitialIndex = initialImageIndex !== undefined ? initialImageIndex : defaultInitialIndex;

  // Hook para navegación
  const {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    goToNextImage,
    goToPrevImage,
    selectImage,
  } = useImageNavigation({ images: cleanImages, initialIndex: actualInitialIndex });

  // Si no hay imágenes válidas
  if (cleanImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const handleZoom = () => {
    onImageZoom?.(currentImage.imageUrlZoom);
  };

  const handleImageClick = () => {
    if (!isInModal) {
      onImageClick?.(currentImageIndex);
    } else {
      handleZoom();
    }
  };

  return (
    <div className={cn(
      "flex",
      isInModal ? "gap-6" : "gap-4"
    )}>
      {/* Thumbnails al lado izquierdo */}
      {hasMultipleImages && (
        <div className={cn(
          "flex flex-col",
          isInModal ? "space-y-3 w-24" : "space-y-2 w-20"
        )}>
          {cleanImages.map((image, index) => (
            <button
              key={image.id}
              onMouseEnter={() => selectImage(index)}
              className={cn(
                "relative overflow-hidden flex-shrink-0 border-2 transition-colors",
                isInModal ? "w-20 h-20" : "w-16 h-16",
                index === currentImageIndex
                  ? "border-indigo-600"
                  : "border-gray-200 hover:border-gray-300"
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.imageUrlThumb}
                alt={image.altText}
                width={isInModal ? 80 : 64}
                height={isInModal ? 80 : 64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="flex-1">
        <div
          className={cn(
            "relative bg-gray-100 overflow-hidden group",
            !isInModal && "aspect-square"
          )}
          style={isInModal ? { height: '70vh' } : undefined}
        >
          <Image
            src={currentImage.imageUrlNormal}
            alt={currentImage.altText}
            width={isInModal ? 1200 : 600}
            height={isInModal ? 1200 : 600}
            className={cn(
              "w-full h-full object-contain transition-opacity duration-200",
              !isInModal ? "cursor-zoom-in" : "cursor-pointer"
            )}
            onClick={handleImageClick}
            priority
          />

          {/* Badge del tipo de imagen */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {getImageTypeLabel(currentImage.imageType)}
          </div>

          {/* Botones de navegación - solo visibles en hover */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
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