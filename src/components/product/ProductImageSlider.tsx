"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

interface ProductImageSliderProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
}) => {
  // Encontrar la imagen principal o usar la primera
  const primaryImageIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryImageIndex !== -1 ? primaryImageIndex : 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

  // Asegurarse de que hay imágenes
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex].imageUrl}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />

        {/* Botones de navegación */}
        {images.length > 1 && (
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

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                index === currentImageIndex
                  ? "border-indigo-600"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.imageUrl}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
