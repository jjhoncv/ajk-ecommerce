"use client";
import { ItemImage } from "@/shared";
import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { ProductImageSlider } from "./ProductImageSlider";

interface ProductImageSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ItemImage[];
  productName: string;
  initialImageIndex?: number;
}

export const ProductImageSliderModal: React.FC<ProductImageSliderModalProps> = ({
  isOpen,
  onClose,
  images,
  productName,
  initialImageIndex = 0
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageZoom = (imageUrl: string) => {
    // Abrir imagen en nueva ventana para zoom máximo
    window.open(imageUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden relative rounded-lg"
      >
        {/* Header con botón de cerrar */}
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Galería de {productName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido del modal con el slider */}
        <div className="p-6 bg-white overflow-y-auto max-h-[calc(95vh-80px)]">
          <ProductImageSlider
            images={images}
            productName={productName}
            initialImageIndex={initialImageIndex}
            isInModal={true}
            onImageZoom={handleImageZoom}
            showImageType={true}
            thumbsPosition="left"
          />
        </div>

        {/* Footer con información adicional */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-sm text-gray-600">
            Usa las flechas de navegación o haz clic en las miniaturas para cambiar de imagen.
            Haz clic en la imagen principal para zoom completo.
          </p>
        </div>
      </div>
    </div>
  );
};