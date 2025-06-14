import { getPriceIfHasPromotion } from "@/components/product/ProductVariant.helpers"
import ProductVariantButtonAddToCart from "@/components/product/ProductVariantButtonAddToCart"
import { ProductVariantButtonPlusMinus } from "@/components/product/ProductVariantButtonPlusMinus"
import { ProductVariantShipping } from "@/components/product/ProductVariantShipping"
import { getVariantImages } from "@/helpers/image.helpers"
import { getVariantTitle } from "@/helpers/productVariant.helpers"
import { Products, ProductVariants as ProductVariant } from "@/types/domain"
import { FC, useState } from "react"

interface ProductVariantPurchaseProps {
  variant: ProductVariant
  product: Products
}

export const ProductVariantPurchase: FC<ProductVariantPurchaseProps> = ({ product, variant }) => {
  const [quantity, setQuantity] = useState(1)
  const { finalPrice } = getPriceIfHasPromotion(variant)

  const baseShippingCost = 21.65
  const shippingCost = baseShippingCost * quantity

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  return (
    <div className="bg-white sticky top-40 shadow-sm border border-gray-200 overflow-hidden w-full xl:max-w-96">
      <ProductVariantShipping shippingCost={shippingCost} />
      <div className="px-6 py-4">
        <h3 className="font-medium text-gray-900 mb-2 text-sm">Cantidad</h3>
        <div className="flex items-center space-x-4 mb-3">
          <ProductVariantButtonPlusMinus
            variant={variant}
            initialQuantity={1}
            onQuantityChange={handleQuantityChange}
            size="md"
          />
        </div>
        <div className="text-sm text-gray-600 mb-6">
          {variant?.stock || 0} disponible(s)
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 mb-6">
          <button
            className="w-full bg-slate-700 text-white py-3 px-4 font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={(variant?.stock || 0) === 0}
          >
            Comprar
          </button>
          <ProductVariantButtonAddToCart quantity={quantity} stock={variant.stock} price={finalPrice} id={variant.id} name={getVariantTitle(product.name, variant)} image={getVariantImages(variant)[0].imageUrlThumb} />
        </div>
      </div>
    </div>
  )
}