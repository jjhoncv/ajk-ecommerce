"use client";
import React, { useState } from "react";
import Link from "next/link";
import ButtonAddToCart from "../ButtonAddToCart";
import ProductCardSlider from "./ProductCardSlider";
import ProductCardVariants from "./ProductCardVariants";
import ProductCardPromotion from "./ProductCardPromotion";
import { ProductCardProps } from "./ProductCard.interfaces";
import { hasPromotion } from "./ProductCard.helpers";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
  showCategories = true,
  className = "",
}) => {
  // Estado para la variante seleccionada
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Obtener el producto directamente
  const variantProduct = product.product;
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

      <div className={layout === "list" ? "md:w-2/3" : ""}>
        {/* Categorías y nombre del producto */}
        {showCategories && (
          <div className="flex flex-wrap gap-1 mb-1">
            {variantProduct.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <Link href={`/productos/${variantProduct.id}`}>
          <h3 className="font-medium mb-1 hover:text-primary transition-colors">
            {variantProduct.name}
          </h3>
        </Link>

        {/* Mostrar promoción si existe */}
        {hasPromotion(selectedVariant) && (
          <ProductCardPromotion variant={selectedVariant} layout={layout} />
        )}

        {/* Atributos con selección */}
        <div className="space-y-2 mb-3">
          <ProductCardVariants
            variantProduct={variantProduct}
            selectedVariantIndex={selectedVariantIndex}
            setSelectedVariantIndex={setSelectedVariantIndex}
            layout={layout}
            showCategories={false} // Ya mostramos las categorías arriba
          />
        </div>

        {/* Botón de agregar al carrito */}
        <ButtonAddToCart
          id={selectedVariant.id}
          image={selectedVariant.images[0]?.imageUrl || ""}
          name={variantProduct.name}
          price={
            selectedVariant.promotion?.promotionPrice || selectedVariant.price
          }
        />
      </div>
    </div>
  );
};

export default ProductCard;
