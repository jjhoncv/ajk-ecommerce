// 📄 app/api/payment/[transactionId]/fail/route.ts
import { orderModel } from '@/module/orders/core'
import { paymentTransactionModel } from '@/module/payments/core'
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
    if (
      transaction.status !== 'pending' &&
      transaction.status !== 'processing'
    ) {
      return NextResponse.json(
        { error: 'La transacción ya ha sido procesada' },
        { status: 400 }
      )
    }

    // 3. Marcar transacción como fallida
    const updatedTransaction = await paymentTransactionModel.markAsFailed(
      transactionId,
      gatewayResponse
    )

    if (!updatedTransaction) {
      throw new Error('Error al actualizar la transacción')
    }

    // 4. Actualizar estado de pago de la orden
    const updatedOrder = await orderModel.updatePaymentStatus(
      transaction.orderId,
      'failed'
    )

    if (!updatedOrder) {
      throw new Error('Error al actualizar el estado de la orden')
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
      order: updatedOrder,
      message: 'Pago rechazado'
    })
  } catch (error) {
    console.error('Error failing payment:', error)
    return NextResponse.json(
      { error: 'Error al procesar el rechazo del pago' },
      { status: 500 }
    )
  }
}
