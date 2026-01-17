'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Check, CreditCard, Percent, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface PaymentMethod {
  id: number
  name: string
  code: string
  description: string | null
  iconUrl: string | null
  processingFeeType: 'fixed' | 'percentage' | null
  processingFeeValue: number | null
  minAmount: number | null
  maxAmount: number | null
  isActive: number
  requiresVerification: number
  displayOrder: number
}

interface PaymentMethodsListViewProps {
  methods: PaymentMethod[]
}

export const PaymentMethodsListView: FC<PaymentMethodsListViewProps> = ({ methods }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'displayOrder',
      label: '#',
      priority: 'low',
      sortable: true,
      width: '60px',
      render: (order: number) => (
        <span className="text-gray-400">{order}</span>
      )
    },
    {
      key: 'name',
      label: 'Método',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '200px',
      render: (name: string, item: PaymentMethod) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            {item.iconUrl ? (
              <img src={item.iconUrl} alt={name} className="h-6 w-6 object-contain" />
            ) : (
              <CreditCard size={20} className="text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{item.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'processingFeeValue',
      label: 'Comisión',
      priority: 'high',
      sortable: true,
      width: '130px',
      render: (value: number | null, item: PaymentMethod) => {
        if (!value || value === 0) {
          return <span className="text-gray-400">Sin comisión</span>
        }
        if (item.processingFeeType === 'percentage') {
          return (
            <span className="inline-flex items-center gap-1 text-gray-700">
              <Percent size={14} className="text-orange-500" />
              {value}%
            </span>
          )
        }
        return <span className="text-gray-700">S/ {value.toFixed(2)}</span>
      }
    },
    {
      key: 'minAmount',
      label: 'Monto Mínimo',
      priority: 'medium',
      sortable: true,
      width: '120px',
      render: (minAmount: number | null) => {
        if (!minAmount || minAmount === 0) {
          return <span className="text-gray-400">-</span>
        }
        return <span className="text-gray-600">S/ {minAmount.toFixed(2)}</span>
      }
    },
    {
      key: 'maxAmount',
      label: 'Monto Máximo',
      priority: 'medium',
      sortable: true,
      width: '120px',
      render: (maxAmount: number | null) => {
        if (!maxAmount) {
          return <span className="text-gray-400">Sin límite</span>
        }
        return <span className="text-gray-600">S/ {maxAmount.toFixed(2)}</span>
      }
    },
    {
      key: 'requiresVerification',
      label: 'Verificación',
      priority: 'low',
      sortable: true,
      width: '110px',
      render: (requiresVerification: number) => {
        if (requiresVerification === 1) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
              Requerida
            </span>
          )
        }
        return (
          <span className="text-xs text-gray-400">No</span>
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
        url: '/api/admin/payments/methods'
      })

      ToastSuccess(message)
      router.push('/admin/payments/methods')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este método de pago?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemove(id)
        }}
        onCancel={() => {
          router.replace('/admin/payments/methods')
        }}
      />
      <DynamicTable
        columns={columns}
        data={methods}
        renderActions={(id: string) => (
          <>
            <Link
              href={`/admin/payments/methods/${id}`}
              className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </Link>
            <RemoveAction id={id} baseURL="/admin/payments/methods" />
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
