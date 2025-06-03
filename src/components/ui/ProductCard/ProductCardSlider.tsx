"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ProductCardSliderProps } from "./ProductCard.interfaces";

const ProductCardSlider: React.FC<ProductCardSliderProps> = ({
  images,
  productName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliderActive, setIsSliderActive] = useState(false);

  // Efecto para cambiar automáticamente las imágenes cuando el slider está activo
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSliderActive && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000); // Cambiar imagen cada 2 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSliderActive, images.length]);

  // Si no hay imágenes, mostrar una imagen por defecto
  if (images.length === 0) {
    return (
      <div className="relative mb-4">
        <Image
          src="/no-image.webp"
          alt={productName}
          width={200}
          height={200}
          className="w-full h-48 object-contain rounded-lg bg-gray-50"
        />
      </div>
    );
  }

  return (
    <div
      className="relative mb-4 group"
      onMouseEnter={() => setIsSliderActive(true)}
      onMouseLeave={() => setIsSliderActive(false)}
    >
      {/* Slider de imágenes */}
      <div className="w-full h-48 overflow-hidden rounded-lg relative bg-gray-50">
        {images.map((image, idx) => {
          // Usar las propiedades correctas del hidratador
          const imageUrl =
            image.imageUrlNormal || image.imageUrlThumb || image.imageUrl;

          return (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentImageIndex === idx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={imageUrl || "/no-image.webp"}
                alt={`${productName} - Imagen ${idx + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </div>
          );
        })}

        {/* Indicadores de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === idx
                    ? "bg-primary"
                    : "bg-white bg-opacity-60"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botón de favoritos */}
      <button className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
        <Heart className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductCardSlider;
