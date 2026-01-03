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

interface AttributeOption {
  id: number
  value: string
  additionalCost: number
}

interface OptionListViewProps {
  options: AttributeOption[]
  attributeId: number
}

export const OptionListView: FC<OptionListViewProps> = ({
  options,
  attributeId
}) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'value',
      label: 'Valor',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '300px'
    },
    {
      key: 'additionalCost',
      label: 'Costo adicional',
      priority: 'high',
      sortable: true,
      render: (additionalCost: number) => {
        if (additionalCost === 0) {
          return <span className="text-sm text-gray-400">-</span>
        }
        return (
          <span className="text-sm font-medium text-gray-900">
            S/ {additionalCost.toFixed(2)}
          </span>
        )
      },
      width: '200px'
    }
  ]

  const handleRemoveOption = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: `/api/admin/attributes/${attributeId}/options`
      })

      ToastSuccess(message)
      router.push(`/admin/attributes/${attributeId}/options`)
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
        message="¿Estás seguro de eliminar esta opción?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveOption(id)
        }}
        onCancel={() => {
          router.replace(`/admin/attributes/${attributeId}/options`)
        }}
      />
      <DynamicTable
        columns={columns}
        data={options}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/attributes/${attributeId}/options/${id}`}
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
              <RemoveAction
                id={id}
                baseURL={`/admin/attributes/${attributeId}/options`}
              />
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
