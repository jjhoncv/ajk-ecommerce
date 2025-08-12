'use client'
import { type Banner } from '@/module/banners/service/banner/types'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { PreviewImageList } from '@/module/shared/components/PreviewImageList'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface BannerListViewProps {
  banners: Banner[]
}

export const BannerListView: FC<BannerListViewProps> = ({ banners }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'title',
      label: 'Titulo',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '100px'
    },
    {
      key: 'image_url',
      label: 'Imagen',
      priority: 'high',
      sortable: true,
      searchable: true,
      render: (imageURL: string) => <PreviewImageList imageURL={imageURL} />,
      width: '100px'
    },
    {
      key: 'ctaLink',
      label: 'Link',
      priority: 'medium',
      sortable: true,
      render: (linkURL: string) => {
        return (
          <Link
            className="inline-block w-[250px] overflow-hidden text-ellipsis text-nowrap hover:underline"
            href={linkURL}
            target="_blank"
          >
            {linkURL}
          </Link>
        )
      }
    }
  ]

  const handleRemoveRole = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/banners'
      })

      ToastSuccess(message)
      router.push('/admin/banners')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  const handleReorder = async (
    reorderedItems: Array<Record<string, unknown>>
  ): Promise<void> => {
    try {
      // Crear array con los IDs y sus nuevos órdenes
      const orderUpdates = reorderedItems.map((item, index) => ({
        id: item.id as number,
        display_order: index + 1
      }))

      await FetchCustomBody({
        data: { orders: orderUpdates },
        method: 'PUT',
        url: '/api/admin/banners'
      })

      ToastSuccess('Orden actualizado correctamente')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar el orden'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este banner?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveRole(id)
        }}
        onCancel={() => {
          router.replace('/admin/banners')
        }}
      />
      <DynamicTable
        columns={columns}
        data={banners}
        renderActions={(id: string) => {
          return (
            <>
              <EditAction id={id} baseURL="/admin/banners" />
              <RemoveAction id={id} baseURL="/admin/banners" />
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        enableReorder
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        onReorder={handleReorder}
      />
    </>
  )
}
