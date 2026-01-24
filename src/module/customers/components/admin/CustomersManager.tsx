'use client'

import { type CustomerWithStatsDTO } from '@/module/customers/core/Customer.model'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { EditAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import {
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  UserCheck,
  UserX
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, type JSX } from 'react'

interface CustomersManagerProps {
  customers: CustomerWithStatsDTO[]
}

export const CustomersManager: FC<CustomersManagerProps> = ({
  customers
}): JSX.Element => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Cliente',
      priority: 'high',
      sortable: true,
      searchable: true,
      render: (_: string, item: Record<string, unknown>) => {
        const customer = item as unknown as CustomerWithStatsDTO
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {customer.name.charAt(0).toUpperCase()}
              {customer.lastname.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {customer.name} {customer.lastname}
              </p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
        )
      },
      width: '250px'
    },
    {
      key: 'phone',
      label: 'Teléfono',
      priority: 'medium',
      sortable: true,
      searchable: true,
      render: (phone: string | null) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{phone || '-'}</span>
        </div>
      ),
      width: '130px'
    },
    {
      key: 'dni',
      label: 'DNI',
      priority: 'low',
      sortable: true,
      searchable: true,
      render: (dni: string | null) => (
        <span className="text-sm text-gray-600">{dni || '-'}</span>
      ),
      width: '100px'
    },
    {
      key: 'ordersCount',
      label: 'Pedidos',
      priority: 'high',
      sortable: true,
      render: (ordersCount: number, item: Record<string, unknown>) => {
        const customer = item as unknown as CustomerWithStatsDTO
        return (
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gray-400" />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {ordersCount}
              </span>
              {customer.totalSpent > 0 && (
                <p className="text-xs text-gray-500">
                  S/ {customer.totalSpent.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        )
      },
      width: '120px'
    },
    {
      key: 'addressesCount',
      label: 'Direcciones',
      priority: 'low',
      sortable: true,
      render: (addressesCount: number) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{addressesCount}</span>
        </div>
      ),
      width: '100px'
    },
    {
      key: 'createdAt',
      label: 'Registro',
      priority: 'medium',
      sortable: true,
      render: (createdAt: string) => (
        <span className="text-sm text-gray-600">
          {new Date(createdAt).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'isActive',
      label: 'Estado',
      priority: 'high',
      sortable: true,
      render: (isActive: number) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? (
            <>
              <UserCheck className="h-3 w-3" />
              Activo
            </>
          ) : (
            <>
              <UserX className="h-3 w-3" />
              Inactivo
            </>
          )}
        </span>
      ),
      width: '100px'
    }
  ]

  const handleToggleActive = async (
    id: number,
    currentActive: number
  ): Promise<void> => {
    try {
      const message = await FetchCustomBody({
        data: { id, isActive: !currentActive },
        method: 'PATCH',
        url: '/api/admin/customers'
      })
      ToastSuccess(message)
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de realizar esta acción?"
        onSuccess={() => {
          router.replace('/admin/customers')
        }}
        onCancel={() => {
          router.replace('/admin/customers')
        }}
      />
      <DynamicTable
        columns={columns}
        data={customers}
        renderActions={(id: string) => {
          const customer = customers.find((c) => c.id === parseInt(id))
          if (!customer) return null

          return (
            <>
              <EditAction id={id} baseURL="/admin/customers" />
              <a
                href={`mailto:${customer.email}`}
                className="flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <Mail size={18} strokeWidth={1} />
                Enviar email
              </a>
              <button
                onClick={() => void handleToggleActive(customer.id, customer.isActive)}
                className="flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                {customer.isActive ? (
                  <>
                    <UserX size={18} strokeWidth={1} />
                    Desactivar
                  </>
                ) : (
                  <>
                    <UserCheck size={18} strokeWidth={1} />
                    Activar
                  </>
                )}
              </button>
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        enableReorder={false}
        pageSize={10}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </>
  )
}
