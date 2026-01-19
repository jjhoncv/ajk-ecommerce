'use client'

import { type RecentOrder } from '@/module/shared/services/dashboard'
import { Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { type JSX } from 'react'

interface RecentOrdersListProps {
  orders: RecentOrder[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

const paymentLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado'
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

function formatDate(date: Date): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const month = months[d.getMonth()]
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month}, ${hours}:${minutes}`
}

export function RecentOrdersList({ orders }: RecentOrdersListProps): JSX.Element {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
        </div>
        <div className="py-8 text-center text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">No hay órdenes recientes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
      </div>
      <div className="divide-y">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  #{order.orderNumber}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusColors[order.status] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[order.status] ?? order.status}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    paymentStatusColors[order.paymentStatus] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{order.customerName}</p>
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
              <Link
                href={`/admin/orders/${order.id}`}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
