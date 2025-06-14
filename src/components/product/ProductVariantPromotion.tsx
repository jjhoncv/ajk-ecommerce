import { getPriceIfHasPromotion } from "@/components/product/ProductVariant.helpers"
import { ProductVariants } from "@/types/domain"
import { FC } from "react"

interface ProductVariantPromotionProps {
  variant: ProductVariants
}
export const ProductVariantPromotion: FC<ProductVariantPromotionProps> = ({ variant }) => {
  const { hasPromotion, currentPromotion } = getPriceIfHasPromotion(variant)

  return (
    <>
      {hasPromotion && (
        <div className="text-sm flex items-center p-3 bg-gradient-to-r from-red-500 to-red-700 ">
          <p className="font-bold text-[17px] leading-[17px] text-white">
            {currentPromotion?.promotion?.name}: {currentPromotion?.promotion?.description}
          </p>
        </div>
      )}
    </>
  )
}
