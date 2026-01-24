'use client'

import { OfferPrice, OfferCountdown, OfferStockIndicator, OfferBadge } from '@/module/offers/components/ui'
import { type VariantActiveOffer } from '@/module/offers/core'
import { getPriceIfHasPromotion } from './ProductVariant.helpers'
import { formatPrice } from '@/module/shared/helpers/utils'
import { type ProductVariants } from '@/types/domain'
import { type FC } from 'react'

interface ProductVariantOfferPriceProps {
  variant: ProductVariants
  offer: VariantActiveOffer | null
  onOfferExpire?: () => void
}

/**
 * Componente que muestra el precio de oferta con badge, countdown y stock.
 * Recibe la oferta como prop (ya validada desde el componente padre).
 */
export const ProductVariantOfferPrice: FC<ProductVariantOfferPriceProps> = ({
  variant,
  offer,
  onOfferExpire
}) => {
  const { additionalCost } = getPriceIfHasPromotion(variant)
  const basePrice = Number(variant?.price || 0)

  if (!offer) {
    return null
  }

  return (
    <div className="space-y-3">
        {/* Badge de oferta */}
        {offer.badgeText && (
          <OfferBadge
            text={offer.badgeText}
            color={offer.badgeColor}
            size="lg"
            showIcon
          />
        )}

        {/* Precio de oferta */}
        <OfferPrice
          originalPrice={offer.originalPrice}
          offerPrice={offer.offerPrice}
          showSavings={offer.showSavings}
          size="lg"
        />

        {/* Countdown */}
        {offer.showCountdown && (
          <OfferCountdown
            endDate={offer.endDate}
            variant="banner"
            onExpire={onOfferExpire}
          />
        )}

        {/* Stock indicator */}
        {offer.showStockIndicator && offer.remainingStock !== null && (
          <OfferStockIndicator
            remainingStock={offer.remainingStock}
            totalStock={offer.stockLimit}
            variant="minimal"
          />
        )}

        {/* Costo adicional por atributos */}
        {additionalCost > 0 && (
          <div className="text-xs text-gray-600">
            <span>Precio base: {formatPrice(basePrice)}</span>
            <span className="mx-1">+</span>
            <span className="font-medium text-blue-600">
              {formatPrice(additionalCost)} por atributos seleccionados
            </span>
          </div>
        )}
    </div>
  )
}
