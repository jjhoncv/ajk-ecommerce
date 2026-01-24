'use client'

import { useFeaturedOffers } from '@/module/offers/hooks/useOffer'
import { OfferBadge } from './OfferBadge'
import { OfferCountdown } from './OfferCountdown'
import { OfferPrice } from './OfferPrice'
import { OfferStockIndicator } from './OfferStockIndicator'
import { Zap } from 'lucide-react'
import Link from 'next/link'

interface FeaturedOffersProps {
  limit?: number
  title?: string
  showTitle?: boolean
  className?: string
}

export function FeaturedOffers({
  limit = 5,
  title = 'Ofertas Flash',
  showTitle = true,
  className = ''
}: FeaturedOffersProps) {
  const { offers, loading, error } = useFeaturedOffers(limit)

  if (loading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || offers.length === 0) {
    return null
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {offers.map((offer) => (
          <Link
            key={`${offer.offerId}-${offer.variantId}`}
            href={`/productos/variante/${offer.variantId}`}
            className="group rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
          >
            {/* Badge */}
            {offer.badgeText && (
              <OfferBadge
                text={offer.badgeText}
                color={offer.badgeColor}
                size="sm"
                showIcon
              />
            )}

            {/* Título */}
            <h3 className="mt-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
              {offer.offerTitle}
            </h3>

            {/* Precio */}
            <div className="mt-2">
              <OfferPrice
                originalPrice={offer.originalPrice}
                offerPrice={offer.offerPrice}
                showSavings={offer.showSavings}
                size="sm"
              />
            </div>

            {/* Countdown */}
            {offer.showCountdown && (
              <div className="mt-2">
                <OfferCountdown
                  endDate={offer.endDate}
                  size="sm"
                />
              </div>
            )}

            {/* Stock */}
            {offer.showStockIndicator && offer.remainingStock !== null && (
              <div className="mt-2">
                <OfferStockIndicator
                  remainingStock={offer.remainingStock}
                  totalStock={offer.stockLimit}
                  showProgress
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
