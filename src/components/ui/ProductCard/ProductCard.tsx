"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import ButtonAddToCart from "../ButtonAddToCart";
import ProductCardSlider from "./ProductCardSlider";
import ProductCardVariants from "./ProductCardVariants";
import ProductCardDeal from "./ProductCardDeal";
import { ProductCardProps } from "./ProductCard.interfaces";
import { hydrateProductDTO } from "@/utils/hydrators/product-card.hydrator";
import {
  isVariantProduct,
  isDealProduct,
  isRegularProduct,
} from "./ProductCard.helpers";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
  showCategories = true,
  className = "",
}) => {
  // Estado para la variante seleccionada (solo para productos con variantes)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Renderizar producto con variantes
  if (isVariantProduct(product)) {
    // Hidratar el producto para asegurar que los tipos sean correctos
    const hydratedProduct = hydrateProductDTO(product.product);
    const variantProduct = hydratedProduct.product;
    const selectedVariant = variantProduct.variants[selectedVariantIndex];

    return (
      <div
        className={`bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200 ${className} ${
          layout === "list"
            ? "flex flex-col md:flex-row md:items-center md:gap-6"
            : ""
        }`}
      >
        <Link
          href={`/productos/${variantProduct.id}`}
          className={`block ${layout === "list" ? "md:w-1/3" : ""}`}
        >
          <ProductCardSlider
            images={selectedVariant.images}
            productName={variantProduct.name}
            brandName={variantProduct.brandName}
            layout={layout}
          />
        </Link>

        <ProductCardVariants
          variantProduct={variantProduct}
          selectedVariantIndex={selectedVariantIndex}
          setSelectedVariantIndex={setSelectedVariantIndex}
          layout={layout}
          showCategories={showCategories}
        />
      </div>
    );
  }

  // Renderizar producto en oferta
  if (isDealProduct(product)) {
    return (
      <div
        className={`bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200 ${className}`}
      >
        <ProductCardDeal product={product} layout={layout} />
      </div>
    );
  }

  // Renderizar producto regular
  if (isRegularProduct(product)) {
    return (
      <div
        className={`bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200 ${className} ${
          layout === "list"
            ? "flex flex-col md:flex-row md:items-center md:gap-6"
            : ""
        }`}
      >
        <div className={`relative mb-4 ${layout === "list" ? "md:w-1/3" : ""}`}>
          {/* Usar una imagen estática o una imagen optimizada según la URL */}
          {product.image.includes("?") ? (
            // Para URLs con parámetros de consulta, usar img en lugar de Image
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            // Para URLs sin parámetros de consulta, usar el componente Image de Next.js
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Botón de favoritos */}
          <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className={layout === "list" ? "md:w-2/3" : ""}>
          <h3 className="font-medium mb-1">{product.name}</h3>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviews})
            </span>
          </div>

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

          <ButtonAddToCart {...product} />
        </div>
      </div>
    );
  }

  // Si no es ninguno de los tipos conocidos, devolver null
  return null;
};

export default ProductCard;
