import { NextRequest, NextResponse } from 'next/server'

// Models
import customerModel from '@/backend/customer'
import customerAddressModel from '@/backend/customer-address'
import orderModel from '@/backend/order'
import orderItemsModel from '@/backend/order-item'
import paymentMethodModel from '@/backend/payment-method'
import paymentTransactionModel from '@/backend/payment-transaction'

// Usar tipos del dominio
import {
  Customers,
  CustomersAddresses,
  OrderItems,
  Orders,
  PaymentMethods,
  PaymentTransactions
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
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = parseInt(params.transactionId)

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
