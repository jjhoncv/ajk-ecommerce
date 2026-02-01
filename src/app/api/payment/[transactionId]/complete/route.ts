// 📄 app/api/payment/[transactionId]/complete/route.ts
import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel, orderItemsModel } from '@/module/orders/core'
import { paymentTransactionModel } from '@/module/payments/core'
import emailService from '@/module/shared/services/email'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId: transactionIdParam } = await params
    const transactionId = parseInt(transactionIdParam)
    const { gatewayResponse } = await request.json()

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

    // 2. Verificar que la transacción esté pendiente
    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'La transacción ya ha sido procesada' },
        { status: 400 }
      )
    }

    // 3. Generar ID de transacción único
    const externalTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 4. Marcar transacción como completada
    const updatedTransaction = await paymentTransactionModel.markAsCompleted(
      transactionId,
      externalTransactionId,
      gatewayResponse
    )

    if (!updatedTransaction) {
      throw new Error('Error al actualizar la transacción')
    }

    // 5. Actualizar estado de la orden
    const updatedOrder = await orderModel.updatePaymentStatus(
      transaction.orderId,
      'paid',
      new Date()
    )

    if (!updatedOrder) {
      throw new Error('Error al actualizar el estado de la orden')
    }

    // 6. Actualizar estado general de la orden a 'processing'
    await orderModel.updateOrderStatus(
      transaction.orderId,
      'processing',
      'Pago confirmado - Procesando pedido'
    )

    // 7. Obtener datos completos para el email de confirmación
    const order = await orderModel.getOrderById(transaction.orderId)
    if (order) {
      try {
        const [customer, shippingAddress, orderItems] = await Promise.all([
          customerModel.getCustomer(order.customerId),
          customerAddressModel.getAddress(order.shippingAddressId),
          orderItemsModel.getOrderItemsByOrderId(order.id)
        ])

        if (customer && shippingAddress && orderItems) {
          // Obtener processingFee de la transacción
          const processingFee = Number(updatedTransaction.processingFee) || 0

          // Enviar email de confirmación (no bloquear si falla)
          emailService
            .sendOrderConfirmationEmail({
              orderNumber: order.orderNumber,
              customerName: `${customer.name || ''} ${customer.lastname || ''}`.trim(),
              customerEmail: customer.email,
              items: orderItems.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice) || 0,
                totalPrice: Number(item.totalPrice) || 0
              })),
              subtotal: Number(order.subtotal) || 0,
              discountAmount: Number(order.discountAmount) || 0,
              shippingCost: Number(order.shippingCost) || 0,
              processingFee,
              taxAmount: Number(order.taxAmount) || 0,
              totalAmount: Number(order.totalAmount) || 0,
              shippingAddress: {
                alias: shippingAddress.alias,
                streetName: shippingAddress.streetName,
                streetNumber: shippingAddress.streetNumber,
                apartment: shippingAddress.apartment,
                // Note: district is typed as Districts object but at runtime it's a string
                district: shippingAddress.district as unknown as string,
                province: shippingAddress.province,
                department: shippingAddress.department
              },
              shippingMethod: order.shippingMethod || 'Estándar',
              estimatedDelivery: order.estimatedDelivery,
              createdAt: (order as any).createdAt
            })
            .then((sent) => {
              if (sent) {
                console.log(`Email de confirmación enviado a ${customer.email}`)
              } else {
                console.error(`Error enviando email de confirmación a ${customer.email}`)
              }
            })
            .catch((err) => {
              console.error('Error enviando email de confirmación:', err)
            })
        }
      } catch (emailError) {
        // Log pero no fallar el proceso de pago
        console.error('Error preparando email de confirmación:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
      order: updatedOrder,
      message: 'Pago completado exitosamente'
    })
  } catch (error) {
    console.error('Error completing payment:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    )
  }
}
