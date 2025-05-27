"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Star, Clock, ShoppingCart } from "lucide-react";
import ButtonAddToCart from "./ButtonAddToCart";
import { ProductDTO } from "@/dto";
import { hydrateProductDTO } from "@/utils/hydrators/product-card.hydrator";
import Link from "next/link";

export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface RegularProduct extends BaseProduct {
  rating: number;
  reviews: number;
  type: "regular";
}

interface DealProduct extends BaseProduct {
  discount: number;
  timer: string;
  stock: number;
  type: "deal";
}

interface VariantProduct {
  product: ProductDTO;
  type: "variant";
}

type ProductProps = {
  product: RegularProduct | DealProduct | VariantProduct;
};

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const isRegularProduct = product.type === "regular";
  const isDealProduct = product.type === "deal";
  const isVariantProduct = product.type === "variant";

  // Estado para la variante seleccionada (solo para productos con variantes)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Renderizar producto con variantes
  if (isVariantProduct) {
    // Hidratar el producto para asegurar que los tipos sean correctos
    const hydratedProduct = hydrateProductDTO(product.product);
    const variantProduct = hydratedProduct.product;
    const selectedVariant = variantProduct.variants[selectedVariantIndex];

    // Encontrar la imagen principal de la variante seleccionada
    const mainImage =
      selectedVariant.images.find((img) => img.isPrimary)?.imageUrl ||
      variantProduct.mainImage ||
      "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";

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
      <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200">
        <Link href={`/productos/${variantProduct.id}`} className="block">
          <div className="relative mb-4">
            {/* Usar una imagen estática o una imagen optimizada según la URL */}
            {mainImage.includes("?") ? (
              // Para URLs con parámetros de consulta, usar img en lugar de Image
              <img
                src={mainImage}
                alt={variantProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              // Para URLs sin parámetros de consulta, usar el componente Image de Next.js
              <Image
                src={mainImage}
                alt={variantProduct.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            {/* Etiqueta de marca */}
            <div className="absolute top-2 left-2">
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                {variantProduct.brandName}
              </span>
            </div>

            {/* Botón de favoritos */}
            <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </Link>

        {/* Categorías */}
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
              S/ {minPrice.toFixed(2)} - S/ {maxPrice.toFixed(2)}
            </span>
          ) : (
            <span className="text-lg font-bold text-primary">
              S/ {selectedVariant.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Botón de agregar al carrito */}
        <button className="w-full mt-3 bg-secondary border-secondary border text-white py-2 rounded-lg hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors flex items-center justify-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200">
      <div
        className={`relative ${
          isRegularProduct ? "mb-4" : "aspect-square mb-4"
        }`}
      >
        {/* Usar una imagen estática o una imagen optimizada según la URL */}
        {product.image.includes("?") ? (
          // Para URLs con parámetros de consulta, usar img en lugar de Image
          <img
            src={product.image}
            alt={product.name}
            className={`${
              isRegularProduct
                ? "w-full h-48 object-cover rounded-lg"
                : "w-full h-full object-cover rounded-lg"
            }`}
          />
        ) : (
          // Para URLs sin parámetros de consulta, usar el componente Image de Next.js
          <Image
            src={product.image}
            alt={product.name}
            {...(isRegularProduct
              ? {
                  width: 400,
                  height: 300,
                  className: "w-full h-48 object-cover rounded-lg",
                }
              : {
                  fill: true,
                  sizes:
                    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
                  className: "object-cover rounded-lg",
                })}
          />
        )}

        {isRegularProduct && (
          <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4" />
          </button>
        )}

        {isDealProduct && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <h3 className={`font-medium ${isRegularProduct ? "mb-1" : "mb-2"}`}>
        {product.name}
      </h3>

      {isRegularProduct && (
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor((product as RegularProduct).rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({(product as RegularProduct).reviews})
          </span>
        </div>
      )}

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

      {isDealProduct && (
        <>
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Vendidos: {30 - (product as DealProduct).stock}</span>
              <span>Disponible: {(product as DealProduct).stock}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-secondary h-2 rounded-full"
                style={{
                  width: `${
                    ((30 - (product as DealProduct).stock) / 30) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 mb-3">
            <Clock className="h-4 w-4" />
            <span>Oferta termina en: {(product as DealProduct).timer}</span>
          </div>
        </>
      )}
      <ButtonAddToCart {...product} />
    </div>
  );
};

export default ProductCard;
