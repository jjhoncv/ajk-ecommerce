// 📄 app/order/[orderNumber]/confirmation/page.tsx
import { Calendar, CheckCircle, Package, Truck } from 'lucide-react'
import { notFound } from 'next/navigation'

// Models - importar directamente los modelos
import customerModel from '@/backend/customer'
import customerAddressModel from '@/backend/customer-address'
import orderModel from '@/backend/order'
import orderItemsModel from '@/backend/order-item'

// Usar tipos del dominio
import { Customers, CustomersAddresses, OrderItems, Orders } from '@/types/domain'

// Components
import ActionButtons from './ActionButtons'

interface OrderConfirmationData {
  order: Orders
  customer: Customers
  shippingAddress: CustomersAddresses
  orderItems: OrderItems[]
}

async function getOrderConfirmationData(orderNumber: string): Promise<OrderConfirmationData> {
  try {
    // 1. Obtener la orden por número
    const order = await orderModel.getOrderByNumber(orderNumber)
    if (!order) {
      notFound()
    }

    // 2. Obtener items de la orden
    const orderItems = await orderItemsModel.getOrderItemsByOrderId(order.id)
    if (!orderItems) {
      throw new Error('Items de orden no encontrados')
    }

    // 3. Obtener cliente
    const customer = await customerModel.getCustomer(order.customerId)
    if (!customer) {
      throw new Error('Cliente no encontrado')
    }

    // 4. Obtener dirección de envío
    const shippingAddress = await customerAddressModel.getAddress(order.shippingAddressId)
    if (!shippingAddress) {
      throw new Error('Dirección de envío no encontrada')
    }

    return {
      order,
      customer,
      shippingAddress,
      orderItems
    }
  } catch (error) {
    console.error('Error fetching order confirmation data:', error)
    notFound()
  }
}

export default async function OrderConfirmationPage({
  params
}: {
  params: { orderNumber: string }
}) {
  const { orderNumber } = params

  const data = await getOrderConfirmationData(orderNumber)

  const { order, customer, shippingAddress, orderItems } = data
  const estimatedDate = order.estimatedDelivery ? new Date(order.estimatedDelivery) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header Success */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-600">
            Tu pedido #{order.orderNumber} ha sido confirmado y será procesado pronto.
          </p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Pago Confirmado</h3>
              <p className="text-sm text-gray-600">S/ {order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Procesando</h3>
              <p className="text-sm text-gray-600 capitalize">{order.status}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Entrega Estimada</h3>
              <p className="text-sm text-gray-600">
                {estimatedDate ? estimatedDate.toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Por determinar'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Pedido</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de pedido:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha del pedido:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado de pago:</span>
                  <span className="font-medium capitalize text-green-600">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-lg">S/ {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>

              <div className="space-y-2">
                <p className="font-medium">{customer.name || ''} {customer.lastname}</p>
                <p className="text-gray-600">{customer.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Dirección de Envío
              </h3>

              <div className="space-y-1">
                <p className="font-medium">{shippingAddress.alias}</p>
                <p className="text-gray-700">
                  {shippingAddress.streetName} {shippingAddress.streetNumber}
                  {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                </p>
                <p className="text-gray-700">
                  {shippingAddress.district}, {shippingAddress.province}
                </p>
                <p className="text-gray-700">{shippingAddress.department}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Pedidos</h3>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Precio unitario: S/ {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">S/ {item.totalPrice.toFixed(2)}</p>
                    {item.discountAmount && item.discountAmount > 0 && (
                      <p className="text-xs text-green-600">
                        -S/ {item.discountAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Client Component */}
        <ActionButtons orderNumber={order.orderNumber} />

        {/* Help Section */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">¿Necesitas ayuda?</h4>
            <p className="text-sm text-blue-700 mb-3">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="mailto:soporte@tutienda.com"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                soporte@tutienda.com
              </a>
              <span className="hidden sm:inline text-blue-600">•</span>
              <a
                href="tel:+51999999999"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                +51 999 999 999
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}