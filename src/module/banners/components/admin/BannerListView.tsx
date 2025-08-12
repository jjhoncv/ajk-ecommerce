'use client'
import { Banner } from '@/module/banners/service/banner/types'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { PreviewImageList } from '@/module/shared/components/PreviewImageList'
import {
  EditAction,
  RemoveAction
} from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

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

  const handleRemoveRole = async (id: string | null) => {
    if (!id) return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/banners'
      })

      ToastSuccess(message)
      router.push('/dashboard/banners')
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message)
    }
  }

  const handleReorder = (reorderedItems: any[]) => {
    // Actualizar el orden en la base de datos
    console.log('Nuevo orden:', reorderedItems)
  }

  const handleSearch = (q: string) => {}

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este banner?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          handleRemoveRole(id)
        }}
        onCancel={() => {
          router.replace('/dashboard/banners')
        }}
      />
      <DynamicTable
        columns={columns}
        data={banners}
        renderActions={(id: string) => {
          return (
            <>
              <EditAction id={id} baseURL="/dashboard/banners" />
              <RemoveAction id={id} baseURL="/dashboard/banners" />
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
