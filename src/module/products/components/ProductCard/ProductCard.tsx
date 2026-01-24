'use client'
import { getPriceIfHasPromotion } from '@/module/products/components/ProductVariant.helpers'
import ProductCardButtonView from './ProductCardButtonView'
import { PromotionBadge } from './PromotionBadge'
import { OfferBadge } from '@/module/offers/components/ui'
import { useOffer } from '@/module/offers/hooks/useOffer'
import { getVariantImages } from '@/module/products/helpers/image.helpers'
import { getVariantTitle } from '@/module/products/helpers/productVariant.helpers'
import Link from 'next/link'
import React from 'react'
import { hasPromotion } from './ProductCard.helpers'
import { type ProductCardProps } from './ProductCard.interfaces'
import ProductCardPrice from './ProductCardPrice'
import ProductCardSlider from './ProductCardSlider'

const ProductCard: React.FC<ProductCardProps> = ({ product, offer: offerProp }) => {
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

  // Obtener oferta si no se pasó como prop
  const { offer: fetchedOffer } = useOffer(offerProp === undefined ? variant.id : null)
  const offer = offerProp ?? fetchedOffer

  const hasDiscount = hasPromotion(variant)
  const images = getVariantImages(variant)

  const thumbImage = images.sort((a, b) => a.displayOrder - b.displayOrder)[0]
    .imageUrlThumb

  const { originalPrice, currentPromotion, type, name } =
    getPriceIfHasPromotion(variant)

  return (
    <div className={'relative bg-white pb-2 transition-shadow hover:shadow-lg'}>
      <div className="relative">
        {/* Badge de oferta sobre la imagen */}
        {offer && offer.badgeText && (
          <div className="absolute left-2 top-2 z-10">
            <OfferBadge
              text={offer.badgeText}
              color={offer.badgeColor}
              size="sm"
              showIcon
            />
          </div>
        )}
        {/* Badge de promoción si no hay oferta */}
        {!offer && hasDiscount && (
          <div className="absolute left-2 top-2 z-10">
            <PromotionBadge type={type} name={type} />
          </div>
        )}

        <Link href={`/producto/${variant.slug || variant.id}`} className={'block'}>
          <ProductCardSlider images={images} productName={product.name} />
        </Link>
        <ProductCardButtonView variantId={product.variantId} variantSlug={variant.slug} />
      </div>

      <div className="px-2 pt-2">
        <Link href={`/producto/${variant.slug || variant.id}`}>
          <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-tight text-gray-800 transition-colors hover:text-primary">
            {getVariantTitle(product.name, variant)}
          </h3>
        </Link>

        {/* Precio */}
        <div className="mt-1">
          <ProductCardPrice variant={variant} offer={offer} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
