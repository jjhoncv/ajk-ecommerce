// src/module/tags/components/admin/TagListView.tsx
'use client'
import { type Tags as Tag } from '@/types/domain'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface TagListViewProps {
  items: Tag[]
}

export const TagListView: FC<TagListViewProps> = ({ items }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'displayOrder',
      label: '#',
      priority: 'high',
      sortable: true,
      width: '5%',
      render: (order: number) => (
        <span className="text-sm font-medium text-gray-500">{order}</span>
      )
    },
    {
      key: 'color',
      label: 'Color',
      priority: 'high',
      sortable: false,
      width: '10%',
      render: (color: string) => (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-gray-500">{color}</span>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '35%',
      render: (name: string, row: Tag) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: row.color }}
          >
            {name}
          </span>
        </div>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      priority: 'medium',
      sortable: true,
      width: '25%',
      render: (slug: string) => (
        <span className="text-sm text-gray-500">{slug}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      priority: 'medium',
      sortable: true,
      width: '10%',
      render: (isActive: number) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ]

  const handleRemove = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar')
      }

      ToastSuccess('Tag eliminado correctamente')
      router.push('/admin/tags')
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
        message="¿Estas seguro de eliminar este tag?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemove(id)
        }}
        onCancel={() => {
          router.replace('/admin/tags')
        }}
      />
      <DynamicTable
        columns={columns}
        data={items}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/tags/${id}`}
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
              <RemoveAction id={id} baseURL="/admin/tags" />
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
