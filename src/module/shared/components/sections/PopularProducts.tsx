import { type ProductComplete } from '@/module/products/core'
import { ProductCard } from '@/module/products/components'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface PopularProductsProps {
  products: ProductComplete[]
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  // No mostrar la sección si no hay productos populares
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-screen-4xl px-12 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos Populares</h2>
        <Link
          href="/populares"
          className="flex items-center gap-1 text-primary hover:text-secondary"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-6">
        {products.map((item) => (
          <ProductCard key={item.variantId} product={item} />
        ))}
      </div>
    </section>
  )
}

export default PopularProducts
