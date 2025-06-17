import { getPriceIfHasPromotion } from "@/components/product/ProductVariant.helpers"
import ProductVariantButtonAddToCart from "@/components/product/ProductVariantButtonAddToCart"
import { ProductVariantShipping } from "@/components/product/ProductVariantShipping"
import { PlusMinusButton } from "@/components/ui/PlusMinusButton"
import { getVariantImages } from "@/helpers/image.helpers"
import { getVariantTitle } from "@/helpers/productVariant.helpers"
import { useCartContext } from "@/providers/cart"
import { Products, ProductVariants as ProductVariant } from "@/types/domain"
import { FC, useState } from "react"

interface ProductVariantPurchaseProps {
  variant: ProductVariant
  product: Products
}

export const ProductVariantPurchase: FC<ProductVariantPurchaseProps> = ({ product, variant }) => {
  const [quantity, setQuantity] = useState(1)
  const { originalPrice } = getPriceIfHasPromotion(variant)
  const { items } = useCartContext()

  // Información del carrito
  const existingItem = items.find(item => item.id === variant.id)
  const currentCartQuantity = existingItem?.quantity || 0

  const baseShippingCost = 21.65
  const shippingCost = baseShippingCost * quantity

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const images = getVariantImages(variant)

  const thumbImage = images.sort((a, b) => a.displayOrder - b.displayOrder)[0].imageUrlThumb

  return (
    <div className="bg-white sticky top-40 shadow-sm border border-gray-200 overflow-hidden w-full xl:max-w-96">
      <ProductVariantShipping shippingCost={shippingCost} />
      <div className="px-6 py-4">
        <h3 className="font-medium text-gray-900 mb-2 text-sm">Cantidad</h3>
        <div className="flex items-center space-x-4 mb-3">
          <PlusMinusButton
            stock={variant.stock}
            maxQuantity={variant.stock} // 👈 Puedes seleccionar hasta el stock total
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            disabled={variant.stock === 0}
            size="md"
          />
        </div>
        <div className="text-sm text-gray-600 mb-6">
          {variant.stock} en stock
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 mb-6">
          <button
            className="w-full bg-secondary text-white py-3 px-4 font-medium hover:bg-secondary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          />
        </div>
      </div>
    </div>
  )
}