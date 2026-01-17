'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  Package,
  Search,
  Truck,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

interface Order {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  discountAmount: number
  shippingCost: number
  processingFee: number
  taxAmount: number
  totalAmount: number
  totalWithFee: number
  shippingMethod: string
  createdAt: Date
  customerId: number
  customerName: string
  customerEmail: string
  itemCount: number
}

interface OrdersListAdminProps {
  initialOrders: Order[]
}

const statusLabels: Record<string, { label: string, color: string, bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  processing: { label: 'Procesando', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  shipped: { label: 'Enviado', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Entregado', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100' }
}

const paymentStatusLabels: Record<string, { label: string, color: string, bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  paid: { label: 'Pagado', color: 'text-green-700', bgColor: 'bg-green-100' },
  failed: { label: 'Fallido', color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Reembolsado', color: 'text-blue-700', bgColor: 'bg-blue-100' }
}

export default function OrdersListAdmin({ initialOrders }: OrdersListAdminProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    let filtered = [...initialOrders]

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.customerEmail.toLowerCase().includes(search)
      )
    }

    // Filtrar por estado
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filtrar por estado de pago
    if (paymentFilter) {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter)
    }

    return filtered
  }, [initialOrders, searchTerm, statusFilter, paymentFilter])

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Estadísticas
  const stats = useMemo(() => {
    const pending = initialOrders.filter((o) => o.status === 'pending').length
    const processing = initialOrders.filter((o) => o.status === 'processing').length
    const shipped = initialOrders.filter((o) => o.status === 'shipped').length
    const delivered = initialOrders.filter((o) => o.status === 'delivered').length
    const totalRevenue = initialOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalWithFee, 0)

    return { pending, processing, shipped, delivered, totalRevenue }
  }, [initialOrders])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => `S/ ${price.toFixed(2)}`

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-yellow-50 p-4">
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pendientes</div>
        </div>
        <div className="rounded-lg border bg-blue-50 p-4">
          <div className="text-2xl font-bold text-blue-700">{stats.processing}</div>
          <div className="text-sm text-blue-600">Procesando</div>
        </div>
        <div className="rounded-lg border bg-purple-50 p-4">
          <div className="text-2xl font-bold text-purple-700">{stats.shipped}</div>
          <div className="text-sm text-purple-600">Enviados</div>
        </div>
        <div className="rounded-lg border bg-green-50 p-4">
          <div className="text-2xl font-bold text-green-700">{stats.delivered}</div>
          <div className="text-sm text-green-600">Entregados</div>
        </div>
        <div className="rounded-lg border bg-emerald-50 p-4">
          <div className="text-2xl font-bold text-emerald-700">{formatPrice(stats.totalRevenue)}</div>
          <div className="text-sm text-emerald-600">Ingresos totales</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por número, cliente o email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Estado: Todos</option>
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pago: Todos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="failed">Fallido</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Método
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.itemCount} producto{order.itemCount !== 1 && 's'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customerEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        statusLabels[order.status]?.bgColor || 'bg-gray-100'
                      } ${statusLabels[order.status]?.color || 'text-gray-700'}`}
                    >
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        paymentStatusLabels[order.paymentStatus]?.bgColor || 'bg-gray-100'
                      } ${paymentStatusLabels[order.paymentStatus]?.color || 'text-gray-700'}`}
                    >
                      {paymentStatusLabels[order.paymentStatus]?.label || order.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CreditCard className="mr-1 h-3 w-3" />
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.totalWithFee)}
                    </div>
                    {order.processingFee > 0 && (
                      <div className="text-xs text-orange-500">
                        +{formatPrice(order.processingFee)} comisión
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-white px-6 py-4">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de{' '}
              {filteredOrders.length} órdenes
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="px-3 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {paginatedOrders.length === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">No se encontraron órdenes</p>
          </div>
        )}
      </div>
    </div>
  )
}
