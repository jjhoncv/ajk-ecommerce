"use client";
import { getVariantImages } from '@/components/product/ProductImageSlider/ProductImageSlider.helpers';
import ProductVariantAttributeSelector from '@/components/product/ProductVariantAttributeSelector';
import { ProductVariantInfo } from '@/components/product/ProductVariantInfo';
import { ProductVariantPurchase } from '@/components/product/ProductVariantPurchase';
import { ProductVariantRatings } from '@/components/product/ProductVariantRating';
import { ProductVariantData } from '@/services/product/productVariant';
import { ProductVariants } from '@/types/domain';
import React, { useState } from 'react';
import { ProductImageSlider, ProductImageSliderModal } from './ProductImageSlider'; // Nuevo import

interface ProductVariantInteractiveProps {
  initialData: ProductVariantData;
  allVariants: ProductVariants[];
  variant: ProductVariants;
}

const ProductVariantInteractive: React.FC<ProductVariantInteractiveProps> = ({
  initialData,
  allVariants,
  variant
}) => {
  const [data, setData] = useState<ProductVariantData>(initialData);
  const { product } = data;
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [initialModalImageIndex, setInitialModalImageIndex] = useState(0);

  // Manejar cambio de variante
  const handleVariantChange = (newData: ProductVariantData) => {
    setData(newData);
  };

  // Manejar click en imagen para abrir galería completa
  const handleImageClick = (imageIndex: number) => {
    setInitialModalImageIndex(imageIndex);
    setIsGalleryModalOpen(true);
  };

  // Cerrar modal de galería
  const closeGalleryModal = () => {
    setIsGalleryModalOpen(false);
  };

  return (
    <>
      <div className="xl:col-span-9">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className="xl:col-span-1">
            <ProductImageSlider
              images={getVariantImages(variant)}
              productName={product.name}
              onImageClick={handleImageClick}
            />
          </div>
          <div className='xl:col-span-1 space-y-5'>
            <ProductVariantInfo product={product} variant={variant} />
            <div className="border-t border-gray-200 pt-6">
              <ProductVariantAttributeSelector
                data={data}
                allVariants={allVariants}
                variant={variant}
                onVariantChange={handleVariantChange} />
            </div>
          </div>
        </div>
        <div>
          <ProductVariantRatings
            product={product}
            variant={variant}
          />
        </div>
      </div>

      <div className="xl:col-span-3">
        <ProductVariantPurchase product={product} variant={variant} />
      </div>

      {/* Modal de galería de imágenes */}
      <ProductImageSliderModal
        isOpen={isGalleryModalOpen}
        onClose={closeGalleryModal}
        images={getVariantImages(variant)}
        productName={product.name}
        initialImageIndex={initialModalImageIndex}
      />
    </>
  );
};

export default ProductVariantInteractive;