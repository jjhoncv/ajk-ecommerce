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

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative"
      >
        {/* Header con botón de cerrar */}
        <div className="flex justify-end items-center p-4 bg-white">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido del modal con el slider */}
        <div className="p-6 pt-0 bg-white">
          <ProductImageSlider
            images={images}
            productName={productName}
            initialImageIndex={initialImageIndex}
            isInModal={true}
          />
        </div>
      </div>
    </div>
  );
};

