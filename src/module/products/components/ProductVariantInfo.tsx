'use client'

import { ProductVariantOfferPrice } from './ProductVariantOfferPrice'
import { ProductVariantPrice } from './ProductVariantPrice'
import { ProductVariantPromotion } from './ProductVariantPromotion'
import { ProductVariantRating } from './ProductVariantRating'
import { useOffer } from '@/module/offers/hooks/useOffer'
import { getVariantTitle } from '@/module/products/helpers/productVariant.helpers'
import {
  type Products as Product,
  type ProductVariants as ProductVariant
} from '@/types/domain'
import { type FC, useCallback } from 'react'

interface ProductVariantInfoProps {
  product: Product
  variant: ProductVariant
}

export const ProductVariantInfo: FC<ProductVariantInfoProps> = ({
  product,
  variant
}) => {
  const { offer, loading } = useOffer(variant.id)

  const handleOfferExpire = useCallback(() => {
    window.location.reload()
  }, [])

  // Determinar qué mostrar: Oferta tiene prioridad sobre Promoción
  const hasActiveOffer = !loading && offer !== null

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {/* Si hay oferta activa, mostrar solo la oferta */}
        {/* Si no hay oferta, mostrar promoción (si existe) */}
        {!hasActiveOffer && <ProductVariantPromotion variant={variant} />}

        {/* Precio: con oferta o normal/promoción */}
        {hasActiveOffer ? (
          <ProductVariantOfferPrice
            variant={variant}
            offer={offer}
            onOfferExpire={handleOfferExpire}
          />
        ) : (
          <ProductVariantPrice variant={variant} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold leading-4 text-gray-900">
            {getVariantTitle(product.name, variant)}
          </h1>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-900">
              {product.description}
            </p>
          )}
        </div>
        <ProductVariantRating variant={variant} />
      </div>
    </>
  )
}
