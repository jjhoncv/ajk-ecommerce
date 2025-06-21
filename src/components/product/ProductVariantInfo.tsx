import { ProductVariantPrice } from '@/components/product/ProductVariantPrice'
import { ProductVariantPromotion } from '@/components/product/ProductVariantPromotion'
import { ProductVariantRating } from '@/components/product/ProductVariantRating'
import { getVariantTitle } from '@/helpers/productVariant.helpers'
import {
  type Products as Product,
  type ProductVariants as ProductVariant
} from '@/types/domain'
import { type FC } from 'react'

interface ProductVariantInfoProps {
  product: Product
  variant: ProductVariant
}

export const ProductVariantInfo: FC<ProductVariantInfoProps> = ({
  product,
  variant
}) => {
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <ProductVariantPromotion variant={variant} />
        <ProductVariantPrice variant={variant} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold leading-4 text-gray-900">
            {getVariantTitle(product.name, variant)}
          </h1>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-900">
              {product.description}
            </p>
          )}
        </div>
        <ProductVariantRating variant={variant} />
      </div>
    </>
  )
}
