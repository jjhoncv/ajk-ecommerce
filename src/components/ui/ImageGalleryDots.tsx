"use client";
import { CleanImage } from "@/components/product/ProductVariant.helpers";
import { useImageCarousel } from "@/hooks/useImageCarousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ImageGalleryDotsProps {
  images: CleanImage[];
  productName: string;
  className?: string;
  autoSlideInterval?: number;
  autoSlideOnHover?: boolean;
  showDotsIndicator?: boolean;
  showImageCounter?: boolean;
  onImageClick?: (imageIndex: number) => void;
}

export const ImageGalleryDots: React.FC<ImageGalleryDotsProps> = ({
  images,
  productName,
  className = "w-full aspect-square overflow-hidden relative bg-gray-50 rounded",
  autoSlideInterval = 2000,
  autoSlideOnHover = true,
  showDotsIndicator = true,
  showImageCounter = false,
  onImageClick,
}) => {
  const {
    currentImageIndex,
    currentImage,
    hasMultipleImages,
    handleMouseEnter,
    handleMouseLeave,
    goToImage,
    totalImages
  } = useImageCarousel({
    images,
    initialIndex: 0,
    autoSlideInterval,
    autoSlideOnHover,
    loop: true,
    preloadImages: true
  });

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Sin imágenes</span>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    onImageClick?.(currentImageIndex);
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen actual */}
      {currentImage && (
        <div
          className="w-full h-full cursor-pointer"
          onClick={handleClick}
        >
          <Image
            src={currentImage.imageUrlNormal}
            alt={currentImage.altText || `${productName} - Imagen ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-opacity duration-300"
            priority={currentImageIndex === 0}
          />
        </div>
      )}

      {/* Precargar imágenes siguientes (ocultas) */}
      {images.map((image, idx) => (
        idx !== currentImageIndex && (
          <div key={`preload-${idx}`} className="absolute inset-0 opacity-0 pointer-events-none">
            <Image
              src={image.imageUrlNormal}
              alt={image.altText || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>
        )
      ))}

      {/* Indicadores de puntos */}
      {showDotsIndicator && hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/20 rounded-full px-2 py-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentImageIndex === idx
                  ? "bg-white scale-110"
                  : "bg-white/60 hover:bg-white/80"
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToImage(idx);
              }}
              aria-label={`Ver imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador de imágenes */}
      {showImageCounter && hasMultipleImages && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1}/{totalImages}
        </div>
      )}

      {/* Indicador de hover para cambio de imagen */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded shadow">
          Hover para cambiar
        </div>
      </div>
    </div>
  );
};