'use client'

import { useOffer } from '@/module/offers/hooks/useOffer'
import { OfferInfo } from '@/module/offers/components/ui'
import { type ProductVariants } from '@/types/domain'
import { type FC } from 'react'

interface ProductVariantOfferProps {
  variant: ProductVariants
  onOfferExpire?: () => void
}

export const ProductVariantOffer: FC<ProductVariantOfferProps> = ({
  variant,
  onOfferExpire
}) => {
  const { offer, loading } = useOffer(variant.id)

  if (loading || !offer) {
    return null
  }

  return (
    <OfferInfo
      offer={offer}
      showBadge
      showPrice={false}
      layout="inline"
      size="md"
      onExpire={onOfferExpire}
    />
  )
}
