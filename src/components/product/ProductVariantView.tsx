import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductVariantData } from '@/services/product/productVariant'
import { ProductVariants } from '@/types/domain'
import React from 'react'
import ProductVariantInteractive from './ProductVariantInteractive'

interface ProductVariantViewProps {
  data: ProductVariantData
  allVariants: ProductVariants[]
  variant: ProductVariants
}

const ProductVariantView: React.FC<ProductVariantViewProps> = ({ data, allVariants, variant }) => {
  const { product } = data

  return (
    <main className="max-w-[1920px] mx-auto px-12 py-8">
      <Breadcrumb product={product} variant={variant} />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <ProductVariantInteractive initialData={data} allVariants={allVariants} variant={variant} />
      </div>
    </main>
  )
}

export default ProductVariantView
