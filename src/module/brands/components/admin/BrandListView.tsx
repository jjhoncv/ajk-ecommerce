'use client'
import { type Brand } from '@/module/brands/service/brand/types'
import { Alert } from '@/module/shared/components/Alert/Alert'
import {
  EditAction,
  RemoveAction
} from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface BrandListViewProps {
  brands: Brand[]
}

export const BrandListView: FC<BrandListViewProps> = ({ brands }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'imageUrl',
      label: 'Logo',
      width: '80px',
      imageField: true,
      render: (value: string | null) => {
        if (!value) {
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
              Sin logo
            </div>
          )
        }
        return (
          <Image
            src={value}
            alt="Logo"
            width={48}
            height={48}
            className="rounded object-cover"
          />
        )
      }
    },
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true
    }
  ]

  const handleRemoveBrand = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/brands'
      })

      ToastSuccess(message)
      router.push('/admin/brands')
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
        message="¿Estás seguro de eliminar esta marca?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveBrand(id)
        }}
        onCancel={() => {
          router.replace('/admin/brands')
        }}
      />
      <DynamicTable
        columns={columns}
        data={brands}
        renderActions={(id: string) => {
          return (
            <>
              <EditAction id={id} baseURL="/admin/brands" />
              <RemoveAction id={id} baseURL="/admin/brands" />
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </>
  )
}
