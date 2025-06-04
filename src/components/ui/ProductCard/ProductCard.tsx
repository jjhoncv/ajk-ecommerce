"use client";
import Link from "next/link";
import React from "react";
import { getVariantTitle, hasPromotion } from "./ProductCard.helpers";
import { ProductCardProps } from "./ProductCard.interfaces";
import ProductCardPrice from "./ProductCardPrice";
import ProductCardSlider from "./ProductCardSlider";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
  className = "",
}) => {
  // Obtener el producto directamente
  const variantProduct = product.product;

  // Verificar que el producto y sus variantes existan
  if (
    !variantProduct ||
    !variantProduct.variants ||
    variantProduct.variants.length === 0
  ) {
    console.error("ProductCard: Producto o variantes no válidos:", product);
    return null;
  }

  const selectedVariant = variantProduct.variants[0];
  const hasDiscount = hasPromotion(selectedVariant);

  return (
    <div
      className={`bg-white relative p-2 hover:shadow-lg transition-shadow  ${className} ${
        layout === "list"
          ? "flex flex-col md:flex-row md:items-center md:gap-6"
          : ""
      }`}
    >
      <Link
        href={`/productos/variante/${selectedVariant.id}`}
        className={`block ${layout === "list" ? "md:w-1/3" : ""}`}
      >
        <ProductCardSlider
          selectedVariant={selectedVariant}
          layout={layout}
          variantProduct={variantProduct}
        />
      </Link>

      <div className={layout === "list" ? "md:w-2/3" : ""}>
        <Link href={`/productos/variante/${selectedVariant.id}`}>
          <h3 className="font-medium mb-1 text-[14px] leading-[14px] hover:text-primary transition-colors line-clamp-1">
            {/* Promoción */}
            {hasDiscount && selectedVariant.promotion && (
              <span className="bg-red-500 text-[11px] leading-[11px] inline-block text-white px-[3px] py-[2px] mr-[1px]">
                Promo
              </span>
            )}

            {getVariantTitle(variantProduct, selectedVariant)}
          </h3>
        </Link>

        {/* Atributos con selección */}
        <div className="space-y-2">
          <ProductCardPrice variantProduct={variantProduct} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
