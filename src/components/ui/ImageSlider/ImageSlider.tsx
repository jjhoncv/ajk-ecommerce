"use client";
import Image from "next/image";
import React from "react";
import { useImageSlider } from "./useImageSlider"; // Ajusta la ruta según tu estructura

// Interfaces para el slider
interface ImageInterface {
  alt: string;
  url: string;
  isPrimary: boolean;
}

interface ImageSliderProps {
  images: ImageInterface[];
  defaultImage?: string;
  className?: string;
  autoSlideInterval?: number;
  showIndicators?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  defaultImage = "/no-image.webp",
  className = "w-full aspect-square overflow-hidden relative bg-gray-50",
  autoSlideInterval = 2000,
  showIndicators = true,
}) => {
  const {
    currentImageIndex,
    goToImage,
    startSlider,
    stopSlider,
  } = useImageSlider({
    imagesLength: images.length,
    autoSlideInterval
  });

  // Si no hay imágenes, mostrar imagen por defecto
  if (images.length === 0) {
    return (
      <div className={className}>
        <Image
          src={defaultImage}
          alt="No image available"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      onMouseEnter={startSlider}
      onMouseLeave={stopSlider}
    >
      {/* Contenedor de imágenes */}
      {images.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ${currentImageIndex === idx ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={image.url || defaultImage}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Indicadores de imágenes */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === idx
                ? "bg-gray-800"
                : "bg-gray-300"
                }`}
              onClick={(e) => {
                e.preventDefault();
                goToImage(idx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
