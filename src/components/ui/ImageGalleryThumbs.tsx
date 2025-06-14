"use client";
import { useImageCarousel } from "@/hooks/useImageCarousel";
import { cn } from "@/lib/utils";
import { ItemImage } from "@/shared";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ImageGalleryThumbsProps {
  images: ItemImage[];
  productName: string;
  className?: string;
  onImageClick?: (imageIndex: number) => void;
  onImageZoom?: (imageUrl: string) => void;
  initialImageIndex?: number;
  isInModal?: boolean;
  showImageType?: boolean;
  thumbsPosition?: 'left' | 'bottom';
}

export const ImageGalleryThumbs: React.FC<ImageGalleryThumbsProps> = ({
  images,
  productName,
  className,
  onImageClick,
  onImageZoom,
  initialImageIndex = 0,
  isInModal = false,
  showImageType = true,
  thumbsPosition = 'left'
}) => {
  // Estado para controlar la fuente de navegación
  const [lastNavigationSource, setLastNavigationSource] = useState<'arrow' | 'thumbnail' | null>(null);

  const {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    goToNextImage,
    goToPrevImage,
    goToImage,
  } = useImageCarousel({
    images,
    initialIndex: initialImageIndex,
    autoSlideInterval: 0, // Sin auto-slide para vista de producto
    autoSlideOnHover: false,
    loop: true,
    preloadImages: true
  });

  // Si no hay imágenes válidas
  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "aspect-square bg-gray-100 flex items-center justify-center rounded",
        className
      )}>
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const handleImageClick = () => {
    if (!isInModal) {
      onImageClick?.(currentImageIndex);
    } else if (currentImage) {
      onImageZoom?.(currentImage.imageUrlZoom);
    }
  };

  // Navegación con flechas
  const handleArrowPrev = () => {
    setLastNavigationSource('arrow');
    goToPrevImage();
    // Reset después de un tiempo
    setTimeout(() => setLastNavigationSource(null), 300);
  };

  const handleArrowNext = () => {
    setLastNavigationSource('arrow');
    goToNextImage();
    // Reset después de un tiempo
    setTimeout(() => setLastNavigationSource(null), 300);
  };

  // Navegación con thumbnails
  const handleThumbnailClick = (index: number) => {
    setLastNavigationSource('thumbnail');
    goToImage(index);
  };

  const handleThumbnailHover = (index: number) => {
    // Solo cambiar en hover si no se navegó recientemente con flechas
    if (lastNavigationSource !== 'arrow') {
      goToImage(index);
    }
  };

  const getImageTypeLabel = (imageType?: string): string => {
    const labels: Record<string, string> = {
      front: 'Frontal',
      back: 'Trasera',
      left: 'Lateral Izq.',
      right: 'Lateral Der.',
      top: 'Superior',
      bottom: 'Inferior',
      detail: 'Detalle',
      lifestyle: 'Lifestyle',
      packaging: 'Empaque'
    };
    return labels[imageType || 'front'] || 'Imagen';
  };

  // Layout horizontal (thumbnails abajo)
  if (thumbsPosition === 'bottom') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Imagen principal */}
        <div
          className={cn(
            "relative bg-gray-100 overflow-hidden group rounded",
            !isInModal && "aspect-square"
          )}
          style={isInModal ? { height: '70vh' } : undefined}
        >
          {currentImage && (
            <Image
              src={currentImage.imageUrlNormal}
              alt={currentImage.altText || productName}
              width={isInModal ? 1200 : 600}
              height={isInModal ? 1200 : 600}
              className={cn(
                "w-full h-full object-contain transition-opacity duration-200",
                !isInModal ? "cursor-zoom-in" : "cursor-pointer"
              )}
              onClick={handleImageClick}
              priority
            />
          )}

          {/* Badge del tipo de imagen */}
          {showImageType && currentImage && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {getImageTypeLabel(currentImage.imageType)}
            </div>
          )}

          {/* Botones de navegación */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handleArrowPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleArrowNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails horizontales */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onMouseEnter={() => handleThumbnailHover(index)}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative overflow-hidden flex-shrink-0 border-2 transition-colors rounded",
                  "w-16 h-16",
                  index === currentImageIndex
                    ? "border-indigo-600"
                    : "border-gray-200 hover:border-gray-300"
                )}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={image.imageUrlThumb}
                  alt={image.altText || `Imagen ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Layout vertical (thumbnails a la izquierda) - default
  return (
    <div className={cn(
      "flex",
      isInModal ? "gap-6" : "gap-4",
      className
    )}>
      {/* Thumbnails verticales */}
      {hasMultipleImages && (
        <div className={cn(
          "flex flex-col",
          isInModal ? "space-y-3 w-24" : "space-y-2 w-20"
        )}>
          {images.map((image, index) => (
            <button
              key={image.id}
              onMouseEnter={() => handleThumbnailHover(index)}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative overflow-hidden flex-shrink-0 border-2 transition-colors rounded",
                isInModal ? "w-20 h-20" : "w-16 h-16",
                index === currentImageIndex
                  ? "border-indigo-600"
                  : "border-gray-200 hover:border-gray-300"
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.imageUrlThumb}
                alt={image.altText || `Imagen ${index + 1}`}
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
            "relative bg-gray-100 overflow-hidden group rounded",
            !isInModal && "aspect-square"
          )}
          style={isInModal ? { height: '70vh' } : undefined}
        >
          {currentImage && (
            <Image
              src={currentImage.imageUrlNormal}
              alt={currentImage.altText || productName}
              width={isInModal ? 1200 : 600}
              height={isInModal ? 1200 : 600}
              className={cn(
                "w-full h-full object-contain transition-opacity duration-200",
                !isInModal ? "cursor-zoom-in" : "cursor-pointer"
              )}
              onClick={handleImageClick}
              priority
            />
          )}

          {/* Badge del tipo de imagen */}
          {showImageType && currentImage && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {getImageTypeLabel(currentImage.imageType)}
            </div>
          )}

          {/* Botones de navegación */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handleArrowPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleArrowNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicadores de puntos - solo en modal */}
          {isInModal && hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};