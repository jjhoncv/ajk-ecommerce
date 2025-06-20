'use client'
import { Clock } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { ProductCardDealProps } from './ProductCard.interfaces'
import ButtonAddToCart from './ProductCardButtonAddToCart'

const ProductCardDeal: React.FC<ProductCardDealProps> = ({
  product,
  layout = 'grid'
}) => {
  return (
    <div
      className={
        layout === 'list'
          ? 'flex flex-col md:flex-row md:items-center md:gap-6'
          : ''
      }
    >
      <div
        className={`relative mb-4 aspect-square ${
          layout === 'list' ? 'md:w-1/3' : ''
        }`}
      >
        {/* Usar una imagen estática o una imagen optimizada según la URL */}
        {product.image.includes('?') ? (
          // Para URLs con parámetros de consulta, usar img en lugar de Image
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          // Para URLs sin parámetros de consulta, usar el componente Image de Next.js
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="rounded-lg object-cover"
          />
        )}

        {/* Etiqueta de descuento */}
        <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
          {product.discount}% OFF
        </span>
      </div>

      <div className={layout === 'list' ? 'md:w-2/3' : ''}>
        <h3 className="mb-2 font-medium">{product.name}</h3>

        <div className="mb-3 flex items-center gap-2">
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
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Vendidos: {30 - product.stock}</span>
            <span>Disponible: {product.stock}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-secondary"
              style={{
                width: `${((30 - product.stock) / 30) * 100}%`
              }}
            />
          </div>
        </div>
        <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Oferta termina en: {product.timer}</span>
        </div>
        <ButtonAddToCart {...product} />
      </div>
    </div>
  )
}

export default ProductCardDeal
