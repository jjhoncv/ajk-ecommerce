import { type ProductVariantData } from '@/module/products/services/productVariant'
import { type ProductVariants } from '@/types/domain'
import React from 'react'
import ProductVariantInteractive from './ProductVariantInteractive'

interface ProductVariantViewProps {
  data: ProductVariantData
  allVariants: ProductVariants[]
  variant: ProductVariants
}

const ProductVariantView: React.FC<ProductVariantViewProps> = ({
  data,
  allVariants,
  variant
}) => {
  return (
    <main className="mx-auto max-w-screen-4xl px-12 py-6">
      <ProductVariantInteractive
        initialData={data}
        allVariants={allVariants}
        variant={variant}
      />
    </main>
  )
}

export default ProductVariantView
