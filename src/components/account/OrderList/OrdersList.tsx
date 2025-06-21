'use client'

import OrderDetailModal from '@/components/account/OrderDetail'
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
  Truck
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Order {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  estimatedDelivery?: string
  itemCount: number
  shippingMethod?: string
  trackingAvailable: boolean
}

interface OrdersResponse {
  orders: Order[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const statusLabels: Record<
  string,
  { label: string, color: string, bgColor: string }
> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100'
  },
  processing: {
    label: 'Procesando',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  shipped: {
    label: 'Enviado',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100'
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  }
}

const paymentStatusLabels: Record<string, { label: string, color: string }> = {
  pending: { label: 'Pendiente', color: 'text-orange-600' },
  paid: { label: 'Pagado', color: 'text-green-600' },
  failed: { label: 'Falló', color: 'text-red-600' },
  refunded: { label: 'Reembolsado', color: 'text-blue-600' }
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const fetchOrders = async (page: number = 1, status: string = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (status) {
        params.append('status', status)
      }

      const response = await fetch(`/api/customer/orders?${params}`)
      if (response.ok) {
        const data: OrdersResponse = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, statusFilter)
  }, [currentPage, statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId.toString())
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrderId(null)
  }

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8 flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-bold">Mis compras</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border p-6">
              <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-bold">Mis compras</h2>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por número de orden..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value) }}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => { handleStatusFilter(e.target.value) }}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No tienes órdenes aún
            </h3>
            <p className="mb-6 text-gray-500">
              Cuando realices tu primera compra, aparecerá aquí.
            </p>
            <Button asChild>
              <Link href="/products">Explorar productos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">
                      Orden {order.orderNumber}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span>
                        {order.itemCount}{' '}
                        {order.itemCount === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-2 text-xl font-bold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${statusLabels[order.status]?.color} ${statusLabels[order.status]?.bgColor}`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Estado de pago
                      </div>
                      <div
                        className={`text-sm font-medium ${paymentStatusLabels[order.paymentStatus]?.color}`}
                      >
                        {paymentStatusLabels[order.paymentStatus]?.label ||
                          order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {order.shippingMethod && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Envío</div>
                        <div className="text-sm font-medium">
                          {order.shippingMethod}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">
                          Entrega estimada
                        </div>
                        <div className="text-sm font-medium">
                          {formatDate(order.estimatedDelivery)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4">
                    {order.trackingAvailable && (
                      <span className="text-sm font-medium text-green-600">
                        ✓ Seguimiento disponible
                      </span>
                    )}
                  </div>

                  <Button variant="outline" asChild>
                    <button
                      onClick={() => { handleViewOrder(order.id) }}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver detalles
                    </button>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * pagination.limit + 1} -{' '}
              {Math.min(currentPage * pagination.limit, pagination.total)} de{' '}
              {pagination.total} órdenes
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { handlePageChange(currentPage - 1) }}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { handlePageChange(page) }}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => { handlePageChange(currentPage + 1) }}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        orderId={selectedOrderId}
      />
    </>
  )
}
