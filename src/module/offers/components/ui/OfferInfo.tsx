'use client'

import { type VariantActiveOffer } from '@/module/offers/core'
import { OfferBadge } from './OfferBadge'
import { OfferCountdown } from './OfferCountdown'
import { OfferPrice } from './OfferPrice'
import { OfferStockIndicator } from './OfferStockIndicator'

interface OfferInfoProps {
  offer: VariantActiveOffer
  showBadge?: boolean
  showCountdown?: boolean
  showStock?: boolean
  showPrice?: boolean
  showSavings?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'card' | 'inline' | 'compact'
  onExpire?: () => void
  className?: string
}

export function OfferInfo({
  offer,
  showBadge = true,
  showCountdown,
  showStock,
  showPrice = true,
  showSavings,
  size = 'md',
  layout = 'card',
  onExpire,
  className = ''
}: OfferInfoProps) {
  // Use offer settings as defaults
  const displayCountdown = showCountdown ?? offer.showCountdown
  const displayStock = showStock ?? offer.showStockIndicator
  const displaySavings = showSavings ?? offer.showSavings

  if (layout === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showBadge && offer.badgeText && (
          <OfferBadge
            text={offer.badgeText}
            color={offer.badgeColor}
            size="sm"
          />
        )}
        {showPrice && (
          <OfferPrice
            originalPrice={offer.originalPrice}
            offerPrice={offer.offerPrice}
            showSavings={false}
            size="sm"
            layout="horizontal"
          />
        )}
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {showBadge && offer.badgeText && (
          <OfferBadge
            text={offer.badgeText}
            color={offer.badgeColor}
            size={size}
          />
        )}
        {displayCountdown && (
          <OfferCountdown
            endDate={offer.endDate}
            size={size}
            onExpire={onExpire}
          />
        )}
        {displayStock && offer.remainingStock !== null && (
          <OfferStockIndicator
            remainingStock={offer.remainingStock}
            totalStock={offer.stockLimit}
            showProgress={false}
          />
        )}
      </div>
    )
  }

  // Card layout (default)
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Badge and Title */}
      <div className="flex items-start justify-between">
        {showBadge && offer.badgeText && (
          <OfferBadge
            text={offer.badgeText}
            color={offer.badgeColor}
            size={size}
            showIcon
          />
        )}
        {displayCountdown && (
          <OfferCountdown
            endDate={offer.endDate}
            size="sm"
            showIcon
            onExpire={onExpire}
          />
        )}
      </div>

      {/* Price */}
      {showPrice && (
        <OfferPrice
          originalPrice={offer.originalPrice}
          offerPrice={offer.offerPrice}
          showSavings={displaySavings}
          size={size}
        />
      )}

      {/* Stock */}
      {displayStock && offer.remainingStock !== null && (
        <OfferStockIndicator
          remainingStock={offer.remainingStock}
          totalStock={offer.stockLimit}
          showProgress
        />
      )}
    </div>
  )
}
