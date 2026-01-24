'use client'

import { type CustomerWithStatsDTO } from '@/module/customers/core/Customer.model'
import { Button, Input, Label } from '@/module/shared/components/ui'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { type CustomersAddresses } from '@/types/domain'
import {
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingBag,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, type JSX, useState } from 'react'

interface RecentOrder {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
}

interface CustomerDetailProps {
  customer: CustomerWithStatsDTO
  addresses: CustomersAddresses[]
  recentOrders: RecentOrder[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
}

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' }
}

export const CustomerDetail: FC<CustomerDetailProps> = ({
  customer,
  addresses,
  recentOrders
}): JSX.Element => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: customer.name,
    lastname: customer.lastname,
    phone: customer.phone || '',
    dni: customer.dni || '',
    isActive: customer.isActive === 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const message = await FetchCustomBody({
        data: formData,
        method: 'PUT',
        url: `/api/admin/customers/${customer.id}`
      })
      ToastSuccess(message)
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar'
      ToastFail(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Columna principal - Formulario */}
      <div className="lg:col-span-2 space-y-6">
        {/* Información básica */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User className="h-5 w-5" />
            Información del cliente
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{customer.email}</span>
              </div>
              <p className="text-xs text-gray-500">
                El email no se puede modificar
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="999999999"
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Cliente activo
              </Label>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </div>

        {/* Direcciones */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MapPin className="h-5 w-5" />
            Direcciones ({addresses.length})
          </h3>
          {addresses.length === 0 ? (
            <p className="text-gray-500">El cliente no tiene direcciones registradas</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Home className="mt-1 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {address.alias}
                          </p>
                          {address.isDefault === 1 && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                              Por defecto
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.streetName} {address.streetNumber}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.district}, {address.province},{' '}
                          {address.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Órdenes recientes */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShoppingBag className="h-5 w-5" />
            Órdenes recientes
          </h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">El cliente no tiene órdenes</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        S/ {order.totalAmount.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusLabels[order.status]?.color || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[order.status]?.label || order.status}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            paymentStatusLabels[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {paymentStatusLabels[order.paymentStatus]?.label || order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Columna lateral - Estadísticas */}
      <div className="space-y-6">
        {/* Resumen */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingBag className="h-4 w-4" />
                <span>Total pedidos</span>
              </div>
              <span className="font-semibold text-gray-900">
                {customer.ordersCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>Total gastado</span>
              </div>
              <span className="font-semibold text-green-600">
                S/ {customer.totalSpent.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Direcciones</span>
              </div>
              <span className="font-semibold text-gray-900">
                {customer.addressesCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>Ticket promedio</span>
              </div>
              <span className="font-semibold text-gray-900">
                S/{' '}
                {customer.ordersCount > 0
                  ? (customer.totalSpent / customer.ordersCount).toFixed(2)
                  : '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Información adicional
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Fecha de registro</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date(customer.createdAt).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            {customer.lastOrderDate && (
              <div>
                <p className="text-sm text-gray-500">Última compra</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(customer.lastOrderDate).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
            {customer.phone && (
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {customer.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
