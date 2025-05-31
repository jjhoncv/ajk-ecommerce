"use client";
import { Clock } from "lucide-react";
import Image from "next/image";
import React from "react";
import ButtonAddToCart from "../ButtonAddToCart";
import { ProductCardDealProps } from "./ProductCard.interfaces";

const ProductCardDeal: React.FC<ProductCardDealProps> = ({
  product,
  layout = "grid",
}) => {
  return (
    <div
      className={
        layout === "list"
          ? "flex flex-col md:flex-row md:items-center md:gap-6"
          : ""
      }
    >
      <div
        className={`relative aspect-square mb-4 ${
          layout === "list" ? "md:w-1/3" : ""
        }`}
      >
        {/* Usar una imagen estática o una imagen optimizada según la URL */}
        {product.image.includes("?") ? (
          // Para URLs con parámetros de consulta, usar img en lugar de Image
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          // Para URLs sin parámetros de consulta, usar el componente Image de Next.js
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover rounded-lg"
          />
        )}

        {/* Etiqueta de descuento */}
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
          {product.discount}% OFF
        </span>
      </div>

      <div className={layout === "list" ? "md:w-2/3" : ""}>
        <h3 className="font-medium mb-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            S/ {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              S/ {product.originalPrice}
            </span>
          )}
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Vendidos: {30 - product.stock}</span>
            <span>Disponible: {product.stock}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full"
              style={{
                width: `${((30 - product.stock) / 30) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 mb-3">
          <Clock className="h-4 w-4" />
          <span>Oferta termina en: {product.timer}</span>
        </div>
        <ButtonAddToCart {...product} />
      </div>
    </div>
  );
};

export default ProductCardDeal;
