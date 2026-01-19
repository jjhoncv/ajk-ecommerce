// 📄 app/order/[orderNumber]/confirmation/page.tsx
import { Calendar, CheckCircle, Package, Truck } from 'lucide-react'
import { notFound } from 'next/navigation'

// Models - importar directamente los modelos
import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel, orderItemsModel } from '@/module/orders/core'
import { paymentTransactionModel } from '@/module/payments/core'

// Usar tipos del dominio
import {
  type Customers,
  type CustomersAddresses,
  type OrderItems,
  type Orders,
  type PaymentTransactions
} from '@/types/domain'

// Components
import ActionButtons from './ActionButtons'

interface OrderConfirmationData {
  order: Orders
  customer: Customers
  shippingAddress: CustomersAddresses
  orderItems: OrderItems[]
  paymentTransaction?: PaymentTransactions
}

async function getOrderConfirmationData(
  orderNumber: string
): Promise<OrderConfirmationData> {
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
    const shippingAddress = await customerAddressModel.getAddress(
      order.shippingAddressId
    )
    if (!shippingAddress) {
      throw new Error('Dirección de envío no encontrada')
    }

    // 5. Obtener transacción de pago para la comisión
    const paymentTransactions = await paymentTransactionModel.getTransactionsByOrderId(order.id)
    const paymentTransaction = paymentTransactions?.[0]

    return {
      order,
      customer,
      shippingAddress,
      orderItems,
      paymentTransaction
    }
  } catch (error) {
    console.error('Error fetching order confirmation data:', error)
    notFound()
  }
}

export default async function OrderConfirmationPage({
  params
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  const data = await getOrderConfirmationData(orderNumber)

  const { order, customer, shippingAddress, orderItems, paymentTransaction } = data
  const estimatedDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery)
    : null
  const processingFee = paymentTransaction?.processingFee ? Number(paymentTransaction.processingFee) : 0
  // El total real pagado por el cliente incluye la comisión de procesamiento
  const totalPaid = order.totalAmount + processingFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header Success */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600">
            Tu pedido #{order.orderNumber} ha sido confirmado y será procesado
            pronto.
          </p>
        </div>

        {/* Order Status Card */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Pago Confirmado</h3>
              <p className="text-sm text-gray-600">
                S/ {totalPaid.toFixed(2)}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Procesando</h3>
              <p className="text-sm capitalize text-gray-600">{order.status}</p>
            </div>

            <div className="text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Entrega Estimada</h3>
              <p className="text-sm text-gray-600">
                {estimatedDate
                  ? estimatedDate.toLocaleDateString('es-PE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Por determinar'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Detalles del Pedido
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de pedido:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha del pedido:</span>
                  <span className="font-medium">
                    {new Date((order as any).createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado de pago:</span>
                  <span className="font-medium capitalize text-green-600">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Desglose de totales */}
              <div className="mt-4 border-t pt-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Resumen de pago</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>S/ {order.subtotal.toFixed(2)}</span>
                  </div>
                  {(order.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento:</span>
                      <span>-S/ {(order.discountAmount ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span>{(order.shippingCost ?? 0) > 0 ? `S/ ${(order.shippingCost ?? 0).toFixed(2)}` : 'Gratis'}</span>
                  </div>
                  {processingFee > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Comisión de pago:</span>
                      <span>S/ {processingFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGV (18%):</span>
                    <span>S/ {(order.taxAmount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        S/ {totalPaid.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Información del Cliente
              </h3>

              <div className="space-y-2">
                <p className="font-medium">
                  {customer.name || ''} {customer.lastname}
                </p>
                <p className="text-gray-600">{customer.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                <Truck className="mr-2 h-5 w-5" />
                Dirección de Envío
              </h3>

              <div className="space-y-1">
                <p className="font-medium">{shippingAddress.alias}</p>
                <p className="text-gray-700">
                  {shippingAddress.streetName} {shippingAddress.streetNumber}
                  {shippingAddress.apartment &&
                    `, ${shippingAddress.apartment}`}
                </p>
                <p className="text-gray-700">
                  {shippingAddress.district}, {shippingAddress.province}
                </p>
                <p className="text-gray-700">{shippingAddress.department}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Productos Pedidos
            </h3>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Precio unitario: S/ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      S/ {item.totalPrice.toFixed(2)}
                    </p>
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
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-medium text-blue-800">
              ¿Necesitas ayuda?
            </h4>
            <p className="mb-3 text-sm text-blue-700">
              Si tienes alguna pregunta sobre tu pedido, no dudes en
              contactarnos.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <a
                href="mailto:soporte@tutienda.com"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                soporte@tutienda.com
              </a>
              <span className="hidden text-blue-600 sm:inline">•</span>
              <a
                href="tel:+51999999999"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
