import { type NextRequest, NextResponse } from 'next/server'

// Models
import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel, orderItemsModel } from '@/module/orders/core'
import { paymentMethodModel, paymentTransactionModel } from '@/module/payments/core'

// Usar tipos del dominio
import {
  type Customers,
  type CustomersAddresses,
  type OrderItems,
  type Orders,
  type PaymentMethods,
  type PaymentTransactions
} from '@/types/domain'

interface PaymentPageData {
  transaction: PaymentTransactions
  order: Orders
  orderItems: OrderItems[]
  customer: Customers
  shippingAddress: CustomersAddresses
  paymentMethod: PaymentMethods
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId: transactionIdParam } = await params
    const transactionId = parseInt(transactionIdParam)

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: 'ID de transacción inválido' },
        { status: 400 }
      )
    }

    // 1. Obtener la transacción
    const transaction =
      await paymentTransactionModel.getTransactionById(transactionId)
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    // 2. Obtener la orden
    const order = await orderModel.getOrderById(transaction.orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // 3. Obtener items de la orden
    const orderItems = await orderItemsModel.getOrderItemsByOrderId(order.id)
    if (!orderItems) {
      return NextResponse.json(
        { error: 'Items de orden no encontrados' },
        { status: 404 }
      )
    }

    // 4. Obtener cliente
    const customer = await customerModel.getCustomer(order.customerId)
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // 5. Obtener dirección de envío
    const shippingAddress = await customerAddressModel.getAddress(
      order.shippingAddressId
    )
    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Dirección de envío no encontrada' },
        { status: 404 }
      )
    }

    // 6. Obtener método de pago
    const paymentMethod = await paymentMethodModel.getPaymentMethodById(
      transaction.paymentMethodId
    )
    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Método de pago no encontrado' },
        { status: 404 }
      )
    }

    // 7. Construir respuesta usando directamente los objetos del dominio
    const paymentData: PaymentPageData = {
      transaction,
      order,
      orderItems,
      customer,
      shippingAddress,
      paymentMethod
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error('Error fetching payment data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
