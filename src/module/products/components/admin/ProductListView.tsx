'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { AlertTriangle, ImageIcon, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface ProductAdmin {
  id: number
  name: string
  description: string | null
  basePrice: number | null
  brand: { id: number; name: string } | null
  variantsCount: number
  totalStock: number
  minPrice: number
  maxPrice: number
  mainImage: string | null
  createdAt: string | null
}

interface ProductListViewProps {
  products: ProductAdmin[]
}

const LOW_STOCK_THRESHOLD = 10

export const ProductListView: FC<ProductListViewProps> = ({ products }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'mainImage',
      label: '',
      priority: 'high',
      sortable: false,
      width: '60px',
      render: (mainImage: string | null, item: ProductAdmin) => {
        if (!mainImage) {
          return (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
              <ImageIcon size={18} className="text-gray-400" />
            </div>
          )
        }
        return (
          <div className="relative h-10 w-10 overflow-hidden rounded">
            <Image
              src={mainImage}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )
      }
    },
    {
      key: 'name',
      label: 'Producto',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px',
      render: (name: string, item: ProductAdmin) => (
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          {item.brand && (
            <p className="text-xs text-gray-500">{item.brand.name}</p>
          )}
        </div>
      )
    },
    {
      key: 'variantsCount',
      label: 'Variantes',
      priority: 'high',
      sortable: true,
      width: '100px',
      render: (variantsCount: number) => {
        if (variantsCount === 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
              Sin variantes
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            <Package size={12} />
            {variantsCount}
          </span>
        )
      }
    },
    {
      key: 'totalStock',
      label: 'Stock',
      priority: 'high',
      sortable: true,
      width: '100px',
      render: (totalStock: number, item: ProductAdmin) => {
        if (item.variantsCount === 0) {
          return <span className="text-sm text-gray-400">-</span>
        }
        const isLowStock = totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD
        const isOutOfStock = totalStock === 0

        if (isOutOfStock) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
              <AlertTriangle size={12} />
              Agotado
            </span>
          )
        }

        if (isLowStock) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              <AlertTriangle size={12} />
              {totalStock}
            </span>
          )
        }

        return (
          <span className="text-sm font-medium text-gray-900">{totalStock}</span>
        )
      }
    },
    {
      key: 'minPrice',
      label: 'Precio',
      priority: 'high',
      sortable: true,
      width: '130px',
      render: (minPrice: number, item: ProductAdmin) => {
        if (item.variantsCount === 0 && !item.basePrice) {
          return <span className="text-sm text-gray-400">-</span>
        }

        // Si no hay variantes, mostrar precio base
        if (item.variantsCount === 0) {
          return (
            <span className="text-sm font-medium text-gray-900">
              S/ {item.basePrice?.toFixed(2)}
            </span>
          )
        }

        // Si hay variantes y los precios son diferentes, mostrar rango
        if (item.minPrice !== item.maxPrice && item.maxPrice > 0) {
          return (
            <div className="text-sm">
              <span className="font-medium text-gray-900">S/ {item.minPrice.toFixed(2)}</span>
              <span className="text-gray-400"> - </span>
              <span className="font-medium text-gray-900">S/ {item.maxPrice.toFixed(2)}</span>
            </div>
          )
        }

        // Si todos tienen el mismo precio
        return (
          <span className="text-sm font-medium text-gray-900">
            S/ {minPrice.toFixed(2)}
          </span>
        )
      }
    },
    {
      key: 'brand',
      label: 'Marca',
      priority: 'medium',
      sortable: false,
      width: '120px',
      render: (brand: { id: number; name: string } | null) => {
        if (!brand) return <span className="text-sm text-gray-400">-</span>
        return <span className="text-sm text-gray-600">{brand.name}</span>
      }
    }
  ]

  const handleRemoveProduct = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/products'
      })

      ToastSuccess(message)
      router.push('/admin/products')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este producto?"
        dependenciesUrl="/api/admin/products/{id}/dependencies"
        blockOnDependencies
        blockedMessage="No se puede eliminar este producto porque tiene:"
        dependenciesMap={{
          variants: 'Variantes'
        }}
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveProduct(id)
        }}
        onCancel={() => {
          router.replace('/admin/products')
        }}
      />
      <DynamicTable
        columns={columns}
        data={products}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/products/${id}`}
                className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar
              </Link>
              <Link
                href={`/admin/products/${id}/variants`}
                className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Variantes
              </Link>
              <Link
                href={`/admin/products/${id}/attributes`}
                className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Atributos
              </Link>
              <RemoveAction id={id} baseURL="/admin/products" />
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        enableReorder={false}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </>
  )
}
