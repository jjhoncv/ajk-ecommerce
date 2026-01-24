'use client'

import { Button } from '@/module/shared/components/Form/Input/Button'
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface OrderItem {
  id: number
  productName: string
  variantSku: string
  variantAttributes: any
  quantity: number
  unitPrice: number
  totalPrice: number
  discountAmount: number
}

interface TrackingEvent {
  id: number
  status: string
  currentLocation?: string
  courierCompany?: string
  trackingNumber?: string
  deliveryNotes?: string
  createdAt: Date
}

interface OrderData {
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
  estimatedDelivery?: Date
  customerNotes?: string
  adminNotes?: string
  createdAt: Date
  paidAt?: Date
  customer: {
    id: number
    name: string
    email: string
    phone?: string
  } | null
  shippingAddress: {
    alias: string
    streetName: string
    streetNumber: string
    apartment?: string
    district: string
    province: string
    department: string
  } | null
  items: OrderItem[]
  trackingHistory: TrackingEvent[]
  transaction: any
}

interface OrderDetailAdminProps {
  order: OrderData
}

const statusLabels: Record<string, { label: string, color: string, bgColor: string, icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
  processing: { label: 'Procesando', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Package },
  shipped: { label: 'Enviado', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
  delivered: { label: 'Entregado', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100', icon: X }
}

const paymentStatusLabels: Record<string, { label: string, color: string }> = {
  pending: { label: 'Pendiente', color: 'text-orange-600' },
  paid: { label: 'Pagado', color: 'text-green-600' },
  failed: { label: 'Fallido', color: 'text-red-600' },
  refunded: { label: 'Reembolsado', color: 'text-blue-600' }
}

export function OrderDetailAdmin({ order }: OrderDetailAdminProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState(order.status)
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '')

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatPrice = (price: number) => `S/ ${price.toFixed(2)}`

  const handleUpdateStatus = async () => {
    if (newStatus === order.status && adminNotes === order.adminNotes) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes
        })
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdating(false)
    }
  }

  const StatusIcon = statusLabels[order.status]?.icon || Package

  return (
    <div className="space-y-6">
      {/* Header con estado */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Creada el {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                statusLabels[order.status]?.bgColor
              } ${statusLabels[order.status]?.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              {statusLabels[order.status]?.label}
            </span>
            <span
              className={`rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold ${
                paymentStatusLabels[order.paymentStatus]?.color
              }`}
            >
              {paymentStatusLabels[order.paymentStatus]?.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Productos */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Productos ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">SKU: {item.variantSku}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity} x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </p>
                    {item.discountAmount > 0 && (
                      <p className="text-sm text-green-600">
                        -{formatPrice(item.discountAmount)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actualizar estado */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Actualizar orden</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Estado de la orden
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notas del administrador
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Agregar notas internas sobre esta orden..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <Button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating || (newStatus === order.status && adminNotes === order.adminNotes)}
              >
                {updating ? 'Actualizando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>

          {/* Historial de seguimiento */}
          {order.trackingHistory.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Historial de seguimiento</h3>
              <div className="space-y-4">
                {order.trackingHistory.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                      {index < order.trackingHistory.length - 1 && (
                        <div className="mt-1 h-full w-px bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {statusLabels[event.status]?.label || event.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(event.createdAt)}
                        </span>
                      </div>
                      {event.currentLocation && (
                        <p className="mt-1 text-sm text-gray-600">
                          {event.currentLocation}
                        </p>
                      )}
                      {event.deliveryNotes && (
                        <p className="mt-1 text-sm text-gray-500">
                          {event.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Resumen de pago */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Resumen</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span>
                  {order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'Gratis'}
                </span>
              </div>
              {order.processingFee > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Comisión de pago</span>
                  <span>{formatPrice(order.processingFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IGV (18%)</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalWithFee)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          {order.customer && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5" />
                Cliente
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-sm text-gray-600">{order.customer.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Dirección de envío */}
          {order.shippingAddress && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Envío
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress.alias}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.streetName} {order.shippingAddress.streetNumber}
                  {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
                <p className="text-gray-600">{order.shippingAddress.department}</p>
              </div>
              {order.shippingMethod && (
                <div className="mt-4 flex items-center gap-2 border-t pt-4">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{order.shippingMethod}</span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="mt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Entrega: {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Información de pago */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5" />
              Pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Método</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado</span>
                <span className={paymentStatusLabels[order.paymentStatus]?.color}>
                  {paymentStatusLabels[order.paymentStatus]?.label}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pagado</span>
                  <span>{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          {(order.customerNotes || order.adminNotes) && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Notas</h3>
              {order.customerNotes && (
                <div className="mb-4">
                  <p className="mb-1 text-xs font-medium text-gray-500">Del cliente:</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">{order.customerNotes}</p>
                </div>
              )}
              {order.adminNotes && (
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Internas:</p>
                  <p className="rounded-lg bg-blue-50 p-3 text-sm">{order.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
