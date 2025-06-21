// 📄 app/api/payment/[transactionId]/complete/route.ts
import orderModel from '@/backend/order'
import paymentTransactionModel from '@/backend/payment-transaction'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = parseInt(params.transactionId)
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
