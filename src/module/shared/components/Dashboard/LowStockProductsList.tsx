'use client'

import { type LowStockProduct } from '@/module/shared/services/dashboard'
import { AlertTriangle, ExternalLink, Package } from 'lucide-react'
import Link from 'next/link'
import { type JSX } from 'react'

interface LowStockProductsListProps {
  products: LowStockProduct[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

function getStockColor(stock: number): string {
  if (stock === 0) return 'bg-red-100 text-red-800'
  if (stock <= 2) return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}

export function LowStockProductsList({ products }: LowStockProductsListProps): JSX.Element {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
        </div>
        <div className="py-8 text-center text-gray-500">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">Todos los productos tienen stock suficiente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
        </div>
        <Link
          href="/admin/products?filter=low-stock"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Ver todos
        </Link>
      </div>
      <div className="divide-y">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{product.productName}</p>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatCurrency(product.price)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStockColor(
                  product.stock
                )}`}
              >
                {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
              </span>
              <Link
                href={`/admin/products/${product.productId}`}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
