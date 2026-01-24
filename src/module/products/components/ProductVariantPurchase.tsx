'use client'
import { getPriceIfHasPromotion } from './ProductVariant.helpers'
import ProductVariantButtonAddToCart from './ProductVariantButtonAddToCart'
import ProductVariantButtonBuyNow from './ProductVariantButtonBuyNow'
import { ProductVariantShipping } from './ProductVariantShipping/ProductVariantShipping'
import { PlusMinusButton } from '@/module/shared/components/ui'
import { getVariantImages } from '@/module/products/helpers/image.helpers'
import { getVariantTitle } from '@/module/products/helpers/productVariant.helpers'
import { cn } from '@/lib/utils'
import { useCartContext } from '@/module/cart/providers'
import { useOffer } from '@/module/offers/hooks/useOffer'
import { OfferStockIndicator } from '@/module/offers/components/ui'
import { type Products, type ProductVariants as ProductVariant } from '@/types/domain'
import { type FC, useMemo, useState } from 'react'

interface ProductVariantPurchaseProps {
  variant: ProductVariant
  product: Products
  preview: boolean
  onCartAction?: () => void
}

export const ProductVariantPurchase: FC<ProductVariantPurchaseProps> = ({
  product,
  variant,
  preview = false,
  onCartAction
}) => {
  const [quantity, setQuantity] = useState(1)
  const { originalPrice, finalPrice } = getPriceIfHasPromotion(variant)
  const { items } = useCartContext()
  const { offer } = useOffer(variant.id)

  // Información del carrito
  const existingItem = items.find((item) => item.id === variant.id)
  const currentCartQuantity = existingItem?.quantity || 0

  const baseShippingCost = 21.65
  const shippingCost = baseShippingCost * quantity

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  // Determinar precio efectivo (oferta > promoción > normal)
  const effectivePrice = useMemo(() => {
    if (offer) return offer.offerPrice
    return finalPrice
  }, [offer, finalPrice])

  // Determinar stock efectivo (mínimo entre stock de variante y stock de oferta)
  const effectiveStock = useMemo(() => {
    if (offer && offer.remainingStock !== null) {
      return Math.min(variant.stock, offer.remainingStock)
    }
    return variant.stock
  }, [offer, variant.stock])

  // Calcular valor total del pedido para envío
  const orderValue = useMemo(() => {
    return effectivePrice * quantity
  }, [effectivePrice, quantity])

  const images = getVariantImages(variant)

  const thumbImage = images.sort((a, b) => a.displayOrder - b.displayOrder)[0]
    .imageUrlThumb

  return (
    <div
      className={cn(
        'sticky top-24 w-full overflow-hidden border border-gray-200 bg-white shadow-sm xl:max-w-96',
        { 'top-0': preview }
      )}
    >
      <ProductVariantShipping
        productVariantId={variant.id}
        quantity={quantity}
        orderValue={orderValue}
      />
      <div className="px-6 py-4">
        <h3 className="mb-2 text-sm font-medium text-gray-900">Cantidad</h3>
        <div className="mb-3 flex items-center space-x-4">
          <PlusMinusButton
            stock={effectiveStock}
            maxQuantity={effectiveStock}
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            disabled={effectiveStock === 0}
            size="md"
          />
        </div>

        {/* Stock indicator */}
        {offer && offer.showStockIndicator && offer.remainingStock !== null ? (
          <div className="mb-6">
            <OfferStockIndicator
              remainingStock={offer.remainingStock}
              totalStock={offer.stockLimit}
              variant="badge"
            />
          </div>
        ) : (
          <div className="mb-6 text-sm text-gray-600">
            {effectiveStock} en stock
          </div>
        )}

        {/* Botones de acción */}
        <div className="mb-6 space-y-3">
          <ProductVariantButtonBuyNow
            quantity={quantity}
            stock={effectiveStock}
            price={effectivePrice}
            id={variant.id}
            slug={variant.slug}
            name={getVariantTitle(product.name, variant)}
            image={thumbImage}
            promotionVariants={variant.promotionVariants}
            variantAttributeOptions={variant.variantAttributeOptions}
          />
          <ProductVariantButtonAddToCart
            quantity={quantity}
            stock={effectiveStock}
            price={effectivePrice}
            id={variant.id}
            slug={variant.slug}
            name={getVariantTitle(product.name, variant)}
            image={thumbImage}
            promotionVariants={variant.promotionVariants}
            variantAttributeOptions={variant.variantAttributeOptions}
            onCartAction={onCartAction}
          />
        </div>
      </div>
    </div>
  )
}
