"use client";
import React from "react";
import Link from "next/link";
import ButtonAddToCart from "../ButtonAddToCart";
import { ProductCardVariantsProps } from "./ProductCard.interfaces";

const ProductCardVariants: React.FC<ProductCardVariantsProps> = ({
  variantProduct,
  selectedVariantIndex,
  setSelectedVariantIndex,
  layout = "grid",
  showCategories = true,
}) => {
  const selectedVariant = variantProduct.variants[selectedVariantIndex];

  // Obtener el precio mínimo y máximo de las variantes
  const minPrice = Math.min(...variantProduct.variants.map((v) => v.price));
  const maxPrice = Math.max(...variantProduct.variants.map((v) => v.price));

  // Determinar si mostrar un rango de precios
  const showPriceRange = minPrice !== maxPrice;

  // Agrupar atributos por nombre para mostrar opciones
  const attributeGroups: { [key: string]: Set<string> } = {};

  variantProduct.variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!attributeGroups[attr.name]) {
        attributeGroups[attr.name] = new Set();
      }
      attributeGroups[attr.name].add(attr.value);
    });
  });

  return (
    <div className={layout === "list" ? "md:w-2/3" : ""}>
      {/* Categorías */}
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

      {/* Nombre del producto */}
      <Link href={`/productos/${variantProduct.id}`}>
        <h3 className="font-medium mb-1 hover:text-primary transition-colors">
          {variantProduct.name}
        </h3>
      </Link>

      {/* Atributos con selección */}
      <div className="space-y-2 mb-3">
        {Object.entries(attributeGroups).map(([attrName, values]) => (
          <div key={attrName} className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">{attrName}:</span>
            <div className="flex flex-wrap gap-1">
              {Array.from(values).map((value) => {
                // Verificar si la variante seleccionada tiene este atributo con este valor
                const isSelected = selectedVariant.attributes.some(
                  (attr) => attr.name === attrName && attr.value === value
                );

                // Encontrar variantes con este atributo
                const variantWithAttr = variantProduct.variants.findIndex(
                  (variant) =>
                    variant.attributes.some(
                      (attr) => attr.name === attrName && attr.value === value
                    )
                );

                return (
                  <button
                    key={value}
                    className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary border border-primary"
                        : "bg-gray-100 text-gray-700 border border-transparent"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (variantWithAttr >= 0) {
                        setSelectedVariantIndex(variantWithAttr);
                      }
                    }}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Precio */}
      <div className="flex items-center gap-2 mb-3">
        {showPriceRange ? (
          <span className="text-lg font-bold text-primary">
            Desde S/ {minPrice.toFixed(2)}
          </span>
        ) : (
          <span className="text-lg font-bold text-primary">
            S/ {selectedVariant.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Botón de agregar al carrito */}
      <ButtonAddToCart
        id={selectedVariant.id}
        image={selectedVariant.images[0]?.imageUrl || ""}
        name={variantProduct.name}
        price={selectedVariant.price}
      />
    </div>
  );
};

export default ProductCardVariants;
