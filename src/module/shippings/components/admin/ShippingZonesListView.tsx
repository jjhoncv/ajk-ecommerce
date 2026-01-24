'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Check, MapPin, Truck, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface ShippingZoneMethod {
  id: number
  shippingMethodId: number
  methodName?: string
  cost: number
}

interface ShippingZone {
  id: number
  name: string
  districtCount?: number
  isActive: number
  methods?: ShippingZoneMethod[]
}

interface ShippingZonesListViewProps {
  zones: ShippingZone[]
}

export const ShippingZonesListView: FC<ShippingZonesListViewProps> = ({ zones }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Zona',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px',
      render: (name: string) => (
        <p className="font-medium text-gray-900">{name}</p>
      )
    },
    {
      key: 'districtCount',
      label: 'Distritos',
      priority: 'high',
      sortable: true,
      width: '120px',
      render: (count: number | undefined) => {
        if (!count || count === 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
              Sin distritos
            </span>
          )
        }
        return (
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-purple-500" />
            <span className="text-sm text-gray-600">{count} distrito{count !== 1 ? 's' : ''}</span>
          </div>
        )
      }
    },
    {
      key: 'methods',
      label: 'Métodos',
      priority: 'medium',
      sortable: false,
      width: '150px',
      render: (methods: ShippingZoneMethod[] | undefined) => {
        if (!methods || methods.length === 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
              Sin métodos
            </span>
          )
        }
        return (
          <div className="flex items-center gap-1">
            <Truck size={14} className="text-blue-500" />
            <span className="text-sm text-gray-600">{methods.length} método{methods.length !== 1 ? 's' : ''}</span>
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
              Activa
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            <X size={12} />
            Inactiva
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
        url: '/api/admin/shippings/zones'
      })

      ToastSuccess(message)
      router.push('/admin/shippings/zones')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar esta zona de envío?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemove(id)
        }}
        onCancel={() => {
          router.replace('/admin/shippings/zones')
        }}
      />
      <DynamicTable
        columns={columns}
        data={zones}
        renderActions={(id: string) => (
          <>
            <Link
              href={`/admin/shippings/zones/${id}`}
              className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </Link>
            <RemoveAction id={id} baseURL="/admin/shippings/zones" />
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
