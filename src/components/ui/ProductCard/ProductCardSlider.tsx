"use client";
import ImageSlider from "@/components/ui/ImageSlider/ImageSlider";
import { Heart } from "lucide-react";
import React from "react";
import { ProductCardSliderProps } from "./ProductCard.interfaces";

const ProductCardSlider: React.FC<ProductCardSliderProps> = ({
  images,
}) => {
  return (
    <div
      className="relative mb-4 group"
    >
      {/* Slider de imágenes */}
      <ImageSlider
        images={images}
        autoSlideInterval={2000}
        showIndicators={true}
      />

      {/* Botón de favoritos */}
      <button className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
        <Heart className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductCardSlider;
