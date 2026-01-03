'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { type Products } from '@/types/domain'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface ProductListViewProps {
  products: Products[]
}

export const ProductListView: FC<ProductListViewProps> = ({ products }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px'
    },
    {
      key: 'brand',
      label: 'Marca',
      priority: 'high',
      sortable: false,
      render: (brand: any) => {
        if (!brand || !brand.name) return <span className="text-sm text-gray-400">Sin marca</span>
        return (
          <span className="text-sm text-gray-600">
            {brand.name}
          </span>
        )
      },
      width: '130px'
    },
    {
      key: 'productCategories',
      label: 'Categorías',
      priority: 'medium',
      sortable: false,
      render: (productCategories: any) => {
        if (!productCategories || productCategories.length === 0) {
          return <span className="text-sm text-gray-400">Sin categorías</span>
        }
        const categoryNames = productCategories[0]?.categories
          ?.map((cat: any) => cat.name)
          .join(', ') || ''
        return (
          <span className="text-sm text-gray-600">
            {categoryNames.length > 50 ? `${categoryNames.substring(0, 50)}...` : categoryNames}
          </span>
        )
      },
      width: '180px'
    },
    {
      key: 'description',
      label: 'Descripción',
      priority: 'low',
      sortable: false,
      searchable: true,
      width: '200px',
      render: (description: string) => {
        if (!description) return <span className="text-sm text-gray-400">Sin descripción</span>
        return (
          <span className="text-sm text-gray-600">
            {description.length > 80 ? `${description.substring(0, 80)}...` : description}
          </span>
        )
      }
    },
    {
      key: 'basePrice',
      label: 'Precio Base',
      priority: 'high',
      sortable: true,
      render: (basePrice: number) => {
        if (!basePrice) return <span className="text-sm text-gray-400">-</span>
        return (
          <span className="text-sm font-medium text-gray-900">
            S/ {basePrice.toFixed(2)}
          </span>
        )
      },
      width: '130px'
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
