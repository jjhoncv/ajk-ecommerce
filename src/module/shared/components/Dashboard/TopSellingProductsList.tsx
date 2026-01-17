'use client'

import { type TopSellingProduct } from '@/services/dashboard'
import { TrendingUp, Trophy } from 'lucide-react'
import { type JSX } from 'react'

interface TopSellingProductsListProps {
  products: TopSellingProduct[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

export function TopSellingProductsList({ products }: TopSellingProductsListProps): JSX.Element {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
        </div>
        <div className="py-8 text-center text-gray-500">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">No hay datos de ventas disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
      </div>
      <div className="divide-y">
        {products.map((product, index) => (
          <div
            key={`${product.variantId}-${index}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  index === 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : index === 1
                      ? 'bg-gray-200 text-gray-700'
                      : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.productName}</p>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {product.totalSold} {product.totalSold === 1 ? 'vendido' : 'vendidos'}
              </p>
              <p className="text-sm text-green-600">{formatCurrency(product.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
