'use client'

import { Button, Input } from '@/module/shared/components/ui'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { type Order } from '../../service/order/types'

interface OrdersListViewProps {
  orders: Order[]
}

const statusLabels: Record<string, { label: string, color: string, bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  processing: { label: 'Procesando', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  shipped: { label: 'Enviado', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Entregado', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100' }
}

const paymentStatusLabels: Record<string, { label: string, color: string, bgColor: string }> = {
  pending: { label: 'Pend.', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  paid: { label: 'Pagado', color: 'text-green-700', bgColor: 'bg-green-100' },
  failed: { label: 'Fallido', color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Reemb.', color: 'text-blue-700', bgColor: 'bg-blue-100' }
}

export function OrdersListView({ orders }: OrdersListViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName?.toLowerCase().includes(search) ||
          order.customerEmail?.toLowerCase().includes(search)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (paymentFilter) {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter)
    }

    return filtered
  }, [orders, searchTerm, statusFilter, paymentFilter])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending').length
    const processing = orders.filter((o) => o.status === 'processing').length
    const shipped = orders.filter((o) => o.status === 'shipped').length
    const delivered = orders.filter((o) => o.status === 'delivered').length
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalWithFee || o.totalAmount), 0)

    return { pending, processing, shipped, delivered, totalRevenue }
  }, [orders])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const formatPrice = (price: number) => `S/${price.toFixed(2)}`

  return (
    <div className="space-y-4">
      {/* Estadísticas compactas */}
      <div className="grid grid-cols-5 gap-3">
        <div className="rounded-lg border bg-yellow-50 p-3">
          <div className="text-xl font-bold text-yellow-700">{stats.pending}</div>
          <div className="text-xs text-yellow-600">Pendientes</div>
        </div>
        <div className="rounded-lg border bg-blue-50 p-3">
          <div className="text-xl font-bold text-blue-700">{stats.processing}</div>
          <div className="text-xs text-blue-600">Procesando</div>
        </div>
        <div className="rounded-lg border bg-purple-50 p-3">
          <div className="text-xl font-bold text-purple-700">{stats.shipped}</div>
          <div className="text-xs text-purple-600">Enviados</div>
        </div>
        <div className="rounded-lg border bg-green-50 p-3">
          <div className="text-xl font-bold text-green-700">{stats.delivered}</div>
          <div className="text-xs text-green-600">Entregados</div>
        </div>
        <div className="rounded-lg border bg-emerald-50 p-3">
          <div className="text-xl font-bold text-emerald-700">{formatPrice(stats.totalRevenue)}</div>
          <div className="text-xs text-emerald-600">Ingresos</div>
        </div>
      </div>

      {/* Filtros compactos */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 pl-8 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Estado</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Pago</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="failed">Fallido</option>
          <option value="refunded">Reembolsado</option>
        </select>
      </div>

      {/* Tabla compacta */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Orden
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Cliente
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Estado
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Pago
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium uppercase text-gray-500">
                Total
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Fecha
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">

              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-900 text-xs">
                    {order.orderNumber.replace('ORD-2026-', '')}
                  </div>
                  <div className="text-xs text-gray-400">
                    {order.itemCount || 0} item{(order.itemCount || 0) !== 1 && 's'}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="max-w-[150px] truncate text-xs font-medium text-gray-900">
                    {order.customerName || '-'}
                  </div>
                  <div className="max-w-[150px] truncate text-xs text-gray-400">
                    {order.customerEmail || '-'}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                      statusLabels[order.status]?.bgColor || 'bg-gray-100'
                    } ${statusLabels[order.status]?.color || 'text-gray-700'}`}
                  >
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                      paymentStatusLabels[order.paymentStatus]?.bgColor || 'bg-gray-100'
                    } ${paymentStatusLabels[order.paymentStatus]?.color || 'text-gray-700'}`}
                  >
                    {paymentStatusLabels[order.paymentStatus]?.label || order.paymentStatus}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="text-xs font-semibold text-gray-900">
                    {formatPrice(order.totalWithFee || order.totalAmount)}
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-3 py-2 text-center">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación compacta */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
            <div className="text-xs text-gray-500">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="px-2 text-xs text-gray-600">
                {currentPage}/{totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {paginatedOrders.length === 0 && (
          <div className="py-8 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No se encontraron órdenes</p>
          </div>
        )}
      </div>
    </div>
  )
}
