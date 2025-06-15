"use client";
import { ImageGalleryThumbs } from "@/components/ui/ImageGalleryThumbs";
import { ItemImage } from "@/shared";
import React from "react";
import {
  cleanAndValidateImages
} from "../ProductVariant.helpers";

interface ProductImageSliderProps {
  images: ItemImage[];
  productName: string;
  onImageZoom?: (imageUrl: string) => void;
  onImageClick?: (imageIndex: number) => void;
  initialImageIndex?: number;
  isInModal?: boolean;
  showImageType?: boolean;
  thumbsPosition?: 'left' | 'bottom';
  className?: string;
}

export const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
  onImageZoom,
  onImageClick,
  initialImageIndex,
  isInModal = false,
  showImageType = true,
  thumbsPosition = 'left',
  className
}) => {
  // Limpiar y validar imágenes usando el helper
  const cleanImages = cleanAndValidateImages(images, productName);

  return (
    <ImageGalleryThumbs
      images={cleanImages}
      productName={productName}
      onImageClick={onImageClick}
      onImageZoom={onImageZoom}
      initialImageIndex={initialImageIndex}
      isInModal={isInModal}
      showImageType={showImageType}
      thumbsPosition={thumbsPosition}
      className={className}
    />
  );
};