"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart, Share2 } from "lucide-react";
import ImageZoomModal from "@/components/ui/ImageZoomModal";
import { ProductDTO } from "@/dto";
import ProductImageSlider from "./ProductImageSlider";
import ProductAttributes from "./ProductAttributes";
import ProductRatings from "./ProductRatings";
import ProductCardRating from "@/components/ui/ProductCard/ProductCardRating";
import {
  hasPromotion,
  calculateFinalPrice,
} from "@/components/ui/ProductCard/ProductCard.helpers";

interface ProductDetailProps {
  product: ProductDTO;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string>("");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex];

  console.log("selectedVariant", selectedVariant);

  const finalPrice = calculateFinalPrice(selectedVariant);
  const originalPrice = Number(selectedVariant.price);
  const hasDiscount = hasPromotion(selectedVariant);

  const incrementQuantity = () => {
    if (quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    console.log("Agregando al carrito:", {
      variantId: selectedVariant.id,
      quantity,
      price: finalPrice,
    });
    // Aquí iría la lógica para agregar al carrito
  };

  const handleImageZoom = (imageUrl: string) => {
    setZoomImageUrl(imageUrl);
    setIsZoomModalOpen(true);
  };

  const closeZoomModal = () => {
    setIsZoomModalOpen(false);
    setZoomImageUrl("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Columna izquierda: Imágenes */}
      <div>
        <ProductImageSlider
          images={selectedVariant.images}
          productName={product.name}
          onImageZoom={handleImageZoom}
        />
      </div>

      {/* Columna derecha: Información del producto */}
      <div className="flex flex-col">
        {/* Categorías y marca */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.id}`}
              className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
            >
              {category.name}
            </Link>
          ))}
          <span className="text-xs text-white bg-gray-800 px-2 py-1 rounded">
            {product.brandName}
          </span>
        </div>

        {/* Nombre del producto */}
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        {/* Valoraciones */}
        {selectedVariant.ratings && (
          <div className="mb-4">
            <ProductCardRating
              rating={selectedVariant.ratings.averageRating}
              totalRatings={selectedVariant.ratings.totalRatings}
              size="md"
            />
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-red-600">
            S/ {finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-500 line-through">
                S/ {originalPrice.toFixed(2)}
              </span>
              {selectedVariant.promotion && (
                <span className="text-sm font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                  {selectedVariant.promotion.discountType === "percentage"
                    ? `-${selectedVariant.promotion.discountValue}%`
                    : `- S/ ${selectedVariant.promotion.discountValue}`}
                </span>
              )}
            </>
          )}
        </div>

        {/* Promoción */}
        {hasDiscount && selectedVariant.promotion && (
          <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded">
            <p className="font-medium">🔥 {selectedVariant.promotion.name}</p>
            <p className="text-sm">
              Válido hasta el{" "}
              {new Date(selectedVariant.promotion.endDate).toLocaleDateString(
                "es-ES",
                { day: "numeric", month: "long" }
              )}
            </p>
          </div>
        )}

        {/* Descripción */}
        {product.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Atributos */}
        <div className="mb-6">
          <ProductAttributes
            product={product}
            selectedVariantIndex={selectedVariantIndex}
            setSelectedVariantIndex={setSelectedVariantIndex}
          />
        </div>

        {/* Cantidad */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Cantidad</h2>
          <div className="flex items-center">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
              {quantity}
            </div>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= selectedVariant.stock}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="ml-3 text-sm text-gray-500">
              {selectedVariant.stock} disponibles
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={addToCart}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Agregar al carrito
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
          <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">SKU</h3>
              <p className="mt-1">{selectedVariant.sku}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
              <p className="mt-1">{product.categories[0]?.name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Marca</h3>
              <p className="mt-1">{product.brandName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Disponibilidad
              </h3>
              <p className="mt-1">
                {selectedVariant.stock > 0 ? "En stock" : "Agotado"}
              </p>
            </div>
          </div>
        </div>

        {/* Valoraciones y reseñas */}
        <ProductRatings variantId={selectedVariant.id} productId={product.id} />
      </div>

      {/* Modal de zoom de imagen */}
      <ImageZoomModal
        isOpen={isZoomModalOpen}
        imageUrl={zoomImageUrl}
        altText={product.name}
        onClose={closeZoomModal}
      />
    </div>
  );
};

export default ProductDetail;
