import { getPriceIfHasPromotion } from "@/components/product/ProductVariant.helpers"
import { ProductVariants } from "@/types/domain"
import { FC } from "react"

interface ProductVariantPriceProps {
  variant: ProductVariants
}

export const ProductVariantPrice: FC<ProductVariantPriceProps> = ({ variant }) => {
  const { finalPrice, hasPromotion, originalPrice, currentPromotion } = getPriceIfHasPromotion(variant)

  return (
    <div className="flex flex-col gap-1 ml-1">
      <div className="text-4xl font-bold ">
        S/ {finalPrice.toFixed(2)}
      </div>
      {hasPromotion && (
        <div className="flex items-center">
          <span className="text-lg leading-5 text-gray-500 line-through">
            S/ {originalPrice.toFixed(2)}
          </span>
          <span className="text-base leading-4 font-semibold items-center flex flex-col text-red-600 px-2  ">
            {currentPromotion?.promotion?.discountType === 'percentage'
              ? `-${currentPromotion.promotion.discountValue}%`
              : `- S/ ${currentPromotion?.promotion?.discountValue}`}
            {' '}dscto.
          </span>
        </div>
      )}
    </div>
  )
}
