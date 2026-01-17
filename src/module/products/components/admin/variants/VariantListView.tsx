'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { type ProductVariants } from '@/types/domain'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface VariantListViewProps {
  variants: ProductVariants[]
  productId: number
}

export const VariantListView: FC<VariantListViewProps> = ({
  variants,
  productId
}) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'variantImages',
      label: 'Imagen',
      priority: 'high',
      sortable: false,
      render: (variantImages: any, row: any) => {
        // Buscar imagen principal o primera imagen
        const primaryImage = variantImages?.find((img: any) => img.isPrimary)
        const displayImage = primaryImage || variantImages?.[0]

        if (!displayImage) {
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
              <ImageIcon size={20} className="text-gray-400" />
            </div>
          )
        }

        // Determinar si es imagen base o de atributo
        const isBaseImage = !row.imageAttributeId

        return (
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-200">
              <Image
                src={displayImage.imageUrlThumb}
                alt={displayImage.altText || 'Imagen de variante'}
                fill
                className="object-contain"
              />
            </div>
            {isBaseImage ? (
              <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Base
              </span>
            ) : (
              <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                Atributo
              </span>
            )}
          </div>
        )
      },
      width: '100px'
    },
    {
      key: 'sku',
      label: 'SKU',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '250px'
    },
    {
      key: 'price',
      label: 'Precio',
      priority: 'high',
      sortable: true,
      render: (price: number) => {
        return (
          <span className="text-sm font-medium text-gray-900">
            S/ {price.toFixed(2)}
          </span>
        )
      },
      width: '150px'
    },
    {
      key: 'stock',
      label: 'Stock',
      priority: 'high',
      sortable: true,
      render: (stock: number) => {
        const stockColor = stock === 0 ? 'text-red-600' : stock < 10 ? 'text-orange-600' : 'text-green-600'
        return (
          <span className={`text-sm font-medium ${stockColor}`}>
            {stock} unidades
          </span>
        )
      },
      width: '150px'
    },
    {
      key: 'variantAttributeOptions',
      label: 'Atributos',
      priority: 'medium',
      sortable: false,
      render: (variantAttributeOptions: any) => {
        if (!variantAttributeOptions || variantAttributeOptions.length === 0) {
          return <span className="text-sm text-gray-400">Sin atributos</span>
        }

        const attributesText = variantAttributeOptions
          .map((vao: any) => {
            const attributeName = vao.productAttributeOption?.attribute?.name || 'N/A'
            const optionValue = vao.productAttributeOption?.value || 'N/A'
            return `${attributeName}: ${optionValue}`
          })
          .join(', ')

        return (
          <span className="text-sm text-gray-700">
            {attributesText}
          </span>
        )
      },
      width: '300px'
    }
  ]

  const handleRemoveVariant = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: `/api/admin/products/${productId}/variants`
      })

      ToastSuccess(message)
      router.push(`/admin/products/${productId}/variants`)
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
        message="¿Estás seguro de eliminar esta variante?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveVariant(id)
        }}
        onCancel={() => {
          router.replace(`/admin/products/${productId}/variants`)
        }}
      />
      <DynamicTable
        columns={columns}
        data={variants}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/products/${productId}/variants/${id}`}
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
              <RemoveAction id={id} baseURL={`/admin/products/${productId}/variants`} />
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
