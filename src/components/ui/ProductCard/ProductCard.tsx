'use client'
import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import ProductCardButtonView from '@/components/ui/ProductCard/ProductCardButtonView'
import { PromotionBadge } from '@/components/ui/ProductCard/PromotionBadge'
import { getVariantImages } from '@/helpers/image.helpers'
import { getVariantTitle } from '@/helpers/productVariant.helpers'
import Link from 'next/link'
import React from 'react'
import { hasPromotion } from './ProductCard.helpers'
import { type ProductCardProps } from './ProductCard.interfaces'
import ProductCardPrice from './ProductCardPrice'
import ProductCardSlider from './ProductCardSlider'

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Verificar que el producto y sus variantes existan
  if (
    !product?.variants ||
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

  const { originalPrice, icon, currentPromotion, type, name } =
    getPriceIfHasPromotion(variant)

  return (
    <div className={'relative bg-white pb-2 transition-shadow hover:shadow-lg'}>
      <div className="relative">
        <Link href={`/productos/variante/${variant.id}`} className={'block'}>
          <ProductCardSlider images={images} productName={product.name} />
        </Link>
        <ProductCardButtonView variantId={product.variantId} />
      </div>

      <div className="px-1">
        <Link href={`/productos/variante/${variant.id}`}>
          <span className="flex">
            {/* Promoción */}
            {hasDiscount && (
              <div className="flex">
                <PromotionBadge type={type} name={type} />
              </div>
            )}
            <h3 className="mb-1 line-clamp-1 text-[14px] font-medium leading-[14px] -tracking-wide transition-colors hover:text-primary">
              {getVariantTitle(product.name, variant)}
            </h3>
          </span>
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
