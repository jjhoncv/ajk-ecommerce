import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import ProductVariantButtonAddToCart from '@/components/product/ProductVariantButtonAddToCart'
import { ProductVariantShipping } from '@/components/product/ProductVariantShipping/ProductVariantShipping'
import { PlusMinusButton } from '@/components/ui/PlusMinusButton'
import { getVariantImages } from '@/helpers/image.helpers'
import { getVariantTitle } from '@/helpers/productVariant.helpers'
import { cn } from '@/lib/utils'
import { useCartContext } from '@/providers/cart'
import { Products, ProductVariants as ProductVariant } from '@/types/domain'
import { FC, useMemo, useState } from 'react'

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
  const { originalPrice } = getPriceIfHasPromotion(variant)
  const { items } = useCartContext()

  // Información del carrito
  const existingItem = items.find((item) => item.id === variant.id)
  const currentCartQuantity = existingItem?.quantity || 0

  const baseShippingCost = 21.65
  const shippingCost = baseShippingCost * quantity

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  // Calcular valor total del pedido para envío
  const orderValue = useMemo(() => {
    return originalPrice * quantity
  }, [originalPrice, quantity])

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
            stock={variant.stock}
            maxQuantity={variant.stock} // 👈 Puedes seleccionar hasta el stock total
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            disabled={variant.stock === 0}
            size="md"
          />
        </div>
        <div className="mb-6 text-sm text-gray-600">
          {variant.stock} en stock
        </div>

        {/* Botones de acción */}
        <div className="mb-6 space-y-3">
          <button
            className="w-full bg-secondary px-4 py-3 font-medium text-white transition-colors hover:bg-secondary-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={variant.stock === 0}
          >
            {variant.stock === 0 ? 'Sin stock' : 'Comprar'}
          </button>
          <ProductVariantButtonAddToCart
            quantity={quantity}
            stock={variant.stock}
            price={originalPrice}
            id={variant.id}
            name={getVariantTitle(product.name, variant)}
            image={thumbImage}
            promotionVariants={variant.promotionVariants}
            onCartAction={onCartAction}
          />
        </div>
      </div>
    </div>
  )
}
