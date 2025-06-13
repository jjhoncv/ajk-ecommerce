import { ProductVariantData } from '@/services/product/productVariant'
import { ProductVariants } from '@/types/domain'
import Link from 'next/link'
import React from 'react'
import ProductVariantInteractive from './ProductVariantInteractive'

interface ProductVariantViewProps {
  data: ProductVariantData
  allVariants: ProductVariants[]
  currentVariantId: number
}

const ProductVariantView: React.FC<ProductVariantViewProps> = ({ data, allVariants, currentVariantId }) => {
  const { product } = data

  return (
    <main className="max-w-[1920px] mx-auto px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
          <li>/</li>
          <li><Link href="/search" className="hover:text-primary">Productos</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      {/* Layout de 3 columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Componente interactivo que maneja el estado */}
        <ProductVariantInteractive initialData={data} allVariants={allVariants} currentVariantId={currentVariantId} />
      </div>
    </main>
  )
}

export default ProductVariantView
