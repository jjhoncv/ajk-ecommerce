"use client";
import { AttributeOptionImages } from "@/types/domain";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import React, { useState } from "react";

interface ProductImageSliderProps {
  images: AttributeOptionImages[];
  productName: string;
  onImageZoom?: (imageUrl: string) => void;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
  onImageZoom,
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
        <img
          src={images[currentImageIndex].imageUrlNormal}
          alt={
            images[currentImageIndex].altText ||
            `${productName} - Imagen ${currentImageIndex + 1}`
          }
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => onImageZoom?.(images[currentImageIndex].imageUrlZoom)}
        />

        {/* Botón de zoom */}
        <button
          onClick={() => onImageZoom?.(images[currentImageIndex].imageUrlZoom)}
          className="absolute top-2 left-2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
          aria-label="Ampliar imagen"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Badge del tipo de imagen */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {images[currentImageIndex].imageType === "front" && "Frontal"}
          {images[currentImageIndex].imageType === "back" && "Trasera"}
          {images[currentImageIndex].imageType === "left" && "Lateral Izq."}
          {images[currentImageIndex].imageType === "right" && "Lateral Der."}
          {images[currentImageIndex].imageType === "top" && "Superior"}
          {images[currentImageIndex].imageType === "bottom" && "Inferior"}
          {images[currentImageIndex].imageType === "detail" && "Detalle"}
          {images[currentImageIndex].imageType === "lifestyle" && "Lifestyle"}
          {images[currentImageIndex].imageType === "packaging" && "Empaque"}
        </div>

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
              className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${index === currentImageIndex
                ? "border-indigo-600"
                : "border-transparent hover:border-gray-300"
                }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={image.imageUrlThumb}
                alt={image.altText || `${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
