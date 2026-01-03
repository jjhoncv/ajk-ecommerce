'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface AttributeWithOptions {
  id: number
  name: string
  displayType: 'radio' | 'pills' | 'select' | 'color' | 'custom'
  options?: Array<{ id: number; value: string; additionalCost: number }>
}

interface AttributeListViewProps {
  attributes: AttributeWithOptions[]
}

const displayTypeLabels: Record<string, string> = {
  select: 'Select (Dropdown)',
  radio: 'Radio Buttons',
  pills: 'Pills (Botones)',
  color: 'Color Picker',
  custom: 'Personalizado'
}

export const AttributeListView: FC<AttributeListViewProps> = ({
  attributes
}) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '250px'
    },
    {
      key: 'displayType',
      label: 'Tipo de visualización',
      priority: 'high',
      sortable: true,
      render: (displayType: string) => {
        return (
          <span className="text-sm text-gray-600">
            {displayTypeLabels[displayType] || displayType}
          </span>
        )
      },
      width: '200px'
    },
    {
      key: 'options',
      label: 'Opciones',
      priority: 'medium',
      sortable: false,
      render: (options: any) => {
        if (!options || options.length === 0) {
          return <span className="text-sm text-gray-400">Sin opciones</span>
        }
        return (
          <span className="text-sm text-gray-600">
            {options.length} {options.length === 1 ? 'opción' : 'opciones'}
          </span>
        )
      },
      width: '150px'
    }
  ]

  const handleRemoveAttribute = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/attributes'
      })

      ToastSuccess(message)
      router.push('/admin/attributes')
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
        message="¿Estás seguro de eliminar este atributo? Se eliminarán también todas sus opciones."
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveAttribute(id)
        }}
        onCancel={() => {
          router.replace('/admin/attributes')
        }}
      />
      <DynamicTable
        columns={columns}
        data={attributes}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/attributes/${id}`}
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
                href={`/admin/attributes/${id}/options`}
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Opciones
              </Link>
              <RemoveAction id={id} baseURL="/admin/attributes" />
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
