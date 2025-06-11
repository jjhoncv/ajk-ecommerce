"use client";
import Link from "next/link";
import React from "react";
import ButtonAddToCart from "../ButtonAddToCart";
import { getThumbImage, getVariantImages, getVariantTitle, hasPromotion } from "./ProductCard.helpers";
import { ProductCardProps } from "./ProductCard.interfaces";
import ProductCardPrice from "./ProductCardPrice";
import ProductCardSlider from "./ProductCardSlider";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  // Verificar que el producto y sus variantes existan
  if (
    !product ||
    !product.variants ||
    product.variants.length === 0 ||
    !product.variantId
  ) {
    console.error("ProductCard: Producto o variantes no válidos:", product);
    return null;
  }

  // Buscar la variante específica por variantId
  const selectedVariant = product.variants.find(v => v.id === product.variantId) || product.variants[0];
  if (!selectedVariant) {
    console.error("ProductCard: Variante no encontrada:", product);
    return null;
  }

  const hasDiscount = hasPromotion(selectedVariant);

  return (
    <div
      className={`bg-white relative hover:shadow-lg transition-shadow pb-2`}
    >
      <div className="relative">
        <Link
          href={`/productos/variante/${selectedVariant.id}`}
          className={`block`}
        >
          <ProductCardSlider
            images={getVariantImages(selectedVariant, product)}
          />
        </Link>

        <ButtonAddToCart
          id={product.variantId}
          image={getThumbImage(selectedVariant, product)}
          name={product.name}
          price={product.variantPrice || selectedVariant.price}
        />
      </div>

      <div className="px-1">
        <Link href={`/productos/variante/${selectedVariant.id}`}>
          <h3 className="font-medium mb-1 text-[14px] leading-[14px] hover:text-primary transition-colors line-clamp-1">
            {/* Promoción */}
            {hasDiscount && (
              <span className="bg-red-500 text-[11px] leading-[11px] inline-block text-white px-[3px] py-[2px] mr-[1px]">
                Promo
              </span>
            )}

            {getVariantTitle(product, selectedVariant)}
          </h3>
        </Link>

        {/* Precio */}
        <div className="space-y-2">
          <ProductCardPrice variantProduct={selectedVariant} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
