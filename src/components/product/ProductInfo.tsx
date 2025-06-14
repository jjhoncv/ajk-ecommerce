import { ProductVariantPrice } from "@/components/product/ProductVariantPrice"
import { ProductVariantPromotion } from "@/components/product/ProductVariantPromotion"
import { ProductVariantRating } from "@/components/product/ProductVariantRating"
import { getVariantTitle } from "@/helpers/productVariant.helpers"
import { Products as Product, ProductVariants as ProductVariant } from "@/types/domain"
import { FC } from "react"

interface ProductInfoProps {
  product: Product
  variant: ProductVariant
}

export const ProductInfo: FC<ProductInfoProps> = ({ product, variant }) => {
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <ProductVariantPromotion variant={variant} />
        <ProductVariantPrice variant={variant} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base leading-4 font-bold text-gray-900 ">
            {getVariantTitle(product.name, variant)}
          </h1>

          {product.description && (
            <p className="text-gray-900 text-sm leading-relaxed">{product.description}</p>
          )}
        </div>
        <ProductVariantRating variant={variant} />
      </div>
    </>
  )
}
