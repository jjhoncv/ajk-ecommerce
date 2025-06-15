"use client";
import { cleanAndValidateImages } from "@/components/product/ProductVariant.helpers";
import { ImageGalleryDots } from "@/components/ui/ImageGalleryDots";
import { ItemImage } from "@/shared";
import { Heart } from "lucide-react";
import React from "react";

interface ProductCardSliderProps {
  images: ItemImage[];
  productName: string;
  onImageClick?: (imageIndex: number) => void;
  showFavoriteButton?: boolean;
  autoSlideInterval?: number;
  autoSlideOnHover?: boolean;
  className?: string;
}

const ProductCardSlider: React.FC<ProductCardSliderProps> = ({
  images,
  productName,
  onImageClick,
  showFavoriteButton = true,
  autoSlideInterval = 2000,
  autoSlideOnHover = true,
  className = "relative mb-2 group"
}) => {
  const cleanImages = cleanAndValidateImages(images, productName);

  return (

    <div className={className}>
      <ImageGalleryDots
        images={cleanImages}
        productName={productName}
        autoSlideInterval={autoSlideInterval}
        autoSlideOnHover={autoSlideOnHover}
        showDotsIndicator={true}
        showImageCounter={false}
        onImageClick={onImageClick}
        className="w-full aspect-square overflow-hidden relative bg-gray-50 rounded"
      />

      {/* Botón de favoritos */}
      {showFavoriteButton && (
        <button
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ProductCardSlider;