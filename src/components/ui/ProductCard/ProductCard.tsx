"use client";
import Link from "next/link";
import React from "react";
import ButtonAddToCart from "../ButtonAddToCart";
import { getVariantTitle } from "./ProductCard.helpers";
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
  const selectedVariant = variantProduct.variants[0];

  return (
    <div
      className={`bg-white relative border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200 ${className} ${
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
        {/* Etiqueta de marca */}
        <div className="inline-block text-gray-600 font-bold text-xs rounded mb-2 text-[13px] leading-[13px]">
          {variantProduct.brandName.toUpperCase()}
        </div>

        <Link href={`/productos/${variantProduct.id}`}>
          <h3 className="font-medium mb-1 text-[16px] leading-[16px] hover:text-primary transition-colors">
            {getVariantTitle(variantProduct, selectedVariant)}
          </h3>
        </Link>

        {/* Atributos con selección */}
        <div className="space-y-2">
          <ProductCardPrice variantProduct={variantProduct} />
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
