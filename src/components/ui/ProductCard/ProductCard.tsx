'use client'
import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import ProductCardButtonView from '@/components/ui/ProductCard/ProductCardButtonView'
import { getVariantImages } from '@/helpers/image.helpers'
import { getVariantTitle } from '@/helpers/productVariant.helpers'
import Link from 'next/link'
import React from 'react'
import { hasPromotion } from './ProductCard.helpers'
import { ProductCardProps } from './ProductCard.interfaces'
import ProductCardPrice from './ProductCardPrice'
import ProductCardSlider from './ProductCardSlider'

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Verificar que el producto y sus variantes existan
  if (
    !product ||
    !product.variants ||
    product.variants.length === 0 ||
    !product.variantId
  ) {
    console.error('ProductCard: Producto o variantes no válidos:', product)
    return null
  }

  // Buscar la variante específica por variantId
  const variant =
    product.variants.find((v) => v.id === product.variantId) ||
    product.variants[0]
  if (!variant) {
    console.error('ProductCard: Variante no encontrada:', product)
    return null
  }

  const hasDiscount = hasPromotion(variant)
  const images = getVariantImages(variant)

  const thumbImage = images.sort((a, b) => a.displayOrder - b.displayOrder)[0]
    .imageUrlThumb

  const { originalPrice } = getPriceIfHasPromotion(variant)

  return (
    <div className={`relative bg-white pb-2 transition-shadow hover:shadow-lg`}>
      <div className="relative">
        <Link href={`/productos/variante/${variant.id}`} className={`block`}>
          <ProductCardSlider images={images} productName={product.name} />
        </Link>

        {/* <button className="absolute h-10 bottom-2 right-2">
          Addsss
        </button> */}
        <ProductCardButtonView variantId={product.variantId} />
        {/* <ProductCardButtonAddToCart
          id={product.variantId}
          image={thumbImage}
          name={getVariantTitle(product.name, variant)}
          price={originalPrice}
          stock={variant.stock}
          quantity={1}
          promotionVariants={variant.promotionVariants}
        /> */}
      </div>

      <div className="px-1">
        <Link href={`/productos/variante/${variant.id}`}>
          <h3 className="mb-1 line-clamp-1 text-[14px] font-medium leading-[14px] -tracking-wide transition-colors hover:text-primary">
            {/* Promoción */}
            {hasDiscount && (
              <span className="mr-[1px] inline-block bg-gradient-to-r from-red-500 to-red-700 px-[3px] py-[2px] text-[11px] leading-[11px] text-white">
                Promo
              </span>
            )}

            {getVariantTitle(product.name, variant)}
          </h3>
        </Link>

        {/* Precio */}
        <div className="space-y-2">
          <ProductCardPrice variant={variant} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
