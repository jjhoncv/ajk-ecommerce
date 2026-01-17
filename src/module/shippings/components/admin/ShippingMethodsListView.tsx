'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Check, MapPin, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface ShippingZone {
  id: number
  shippingZoneId: number
  cost: number
  zoneName: string
}

interface ShippingMethod {
  id: number
  name: string
  description: string | null
  baseCost: number
  estimatedDaysMin: number | null
  estimatedDaysMax: number | null
  isActive: number
  zones?: ShippingZone[]
}

interface ShippingMethodsListViewProps {
  methods: ShippingMethod[]
}

export const ShippingMethodsListView: FC<ShippingMethodsListViewProps> = ({ methods }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px',
      render: (name: string, item: ShippingMethod) => (
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
          )}
        </div>
      )
    },
    {
      key: 'baseCost',
      label: 'Costo Base',
      priority: 'high',
      sortable: true,
      width: '120px',
      render: (baseCost: number) => (
        <span className="font-medium text-gray-900">S/ {baseCost.toFixed(2)}</span>
      )
    },
    {
      key: 'estimatedDaysMin',
      label: 'Días Estimados',
      priority: 'medium',
      sortable: false,
      width: '130px',
      render: (min: number | null, item: ShippingMethod) => {
        if (!min && !item.estimatedDaysMax) {
          return <span className="text-gray-400">-</span>
        }
        if (min === item.estimatedDaysMax) {
          return <span className="text-gray-600">{min} día{min !== 1 ? 's' : ''}</span>
        }
        return (
          <span className="text-gray-600">
            {min ?? '?'} - {item.estimatedDaysMax ?? '?'} días
          </span>
        )
      }
    },
    {
      key: 'zones',
      label: 'Zonas',
      priority: 'medium',
      sortable: false,
      width: '150px',
      render: (zones: ShippingZone[] | undefined) => {
        if (!zones || zones.length === 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
              Sin zonas
            </span>
          )
        }
        return (
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-purple-500" />
            <span className="text-sm text-gray-600">{zones.length} zona{zones.length !== 1 ? 's' : ''}</span>
          </div>
        )
      }
    },
    {
      key: 'isActive',
      label: 'Estado',
      priority: 'high',
      sortable: true,
      width: '100px',
      render: (isActive: number) => {
        if (isActive === 1) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <Check size={12} />
              Activo
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            <X size={12} />
            Inactivo
          </span>
        )
      }
    }
  ]

  const handleRemove = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id: Number(id) },
        method: 'DELETE',
        url: '/api/admin/shippings/methods'
      })

      ToastSuccess(message)
      router.push('/admin/shippings/methods')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este método de envío?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemove(id)
        }}
        onCancel={() => {
          router.replace('/admin/shippings/methods')
        }}
      />
      <DynamicTable
        columns={columns}
        data={methods}
        renderActions={(id: string) => (
          <>
            <Link
              href={`/admin/shippings/methods/${id}`}
              className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </Link>
            <RemoveAction id={id} baseURL="/admin/shippings/methods" />
          </>
        )}
        enableSearch
        enablePagination
        enableSort
        enableReorder={false}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
      />
    </>
  )
}
