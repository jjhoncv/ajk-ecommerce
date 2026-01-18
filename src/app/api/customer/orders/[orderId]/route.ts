// app/api/customer/orders/[orderId]/route.ts
import { customerAddressModel } from '@/module/customers/core'
import { orderModel, orderItemsModel, orderTrackingModel } from '@/module/orders/core'
import { paymentTransactionModel } from '@/module/payments/core'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    orderId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const customerId = parseInt(session.user.id)
    const orderId = parseInt(params.orderId)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de orden inválido' },
        { status: 400 }
      )
    }

    // Obtener la orden
    const order = await orderModel.getOrderById(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la orden pertenece al cliente autenticado
    if (order.customerId !== customerId) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta orden' },
        { status: 403 }
      )
    }

    // Obtener items de la orden
    const orderItems = await orderItemsModel.getOrderItemsByOrderId(orderId)

    // Obtener historial de seguimiento
    const trackingHistory = await orderTrackingModel.getTrackingHistory(orderId)

    // Obtener último seguimiento
    const latestTracking =
      await orderTrackingModel.getLatestTrackingByOrderId(orderId)

    // Obtener dirección de envío
    let shippingAddress = null
    if (order.shippingAddressId) {
      shippingAddress = await customerAddressModel.getAddress(
        order.shippingAddressId
      )
    }

    // Obtener transacción de pago para la comisión
    const paymentTransactions = await paymentTransactionModel.getTransactionsByOrderId(orderId)
    const paymentTransaction = paymentTransactions?.[0]
    const processingFee = paymentTransaction?.processingFee ? Number(paymentTransaction.processingFee) : 0

    // Formatear items de la orden
    const formattedItems =
      orderItems?.map((item) => ({
        id: item.id,
        productName: item.productName,
        variantSku: item.variantSku,
        variantAttributes: item.variantAttributes,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        discountAmount: item.discountAmount || 0
      })) || []

    // Formatear historial de seguimiento
    const formattedTrackingHistory =
      trackingHistory?.map((tracking) => ({
        id: tracking.id,
        status: tracking.status,
        currentLocation: tracking.currentLocation,
        courierCompany: tracking.courierCompany,
        trackingNumber: tracking.trackingNumber,
        deliveryNotes: tracking.deliveryNotes,
        createdAt: tracking.createdAt,
        shippedAt: tracking.shippedAt,
        deliveredAt: tracking.deliveredAt,
        deliveredTo: tracking.deliveredTo
      })) || []

    // Formatear dirección de envío
    const formattedShippingAddress = shippingAddress
      ? {
          alias: shippingAddress.alias,
          streetName: shippingAddress.streetName,
          streetNumber: shippingAddress.streetNumber,
          apartment: shippingAddress.apartment,
          district: shippingAddress.district,
          province: shippingAddress.province,
          department: shippingAddress.department
        }
      : null

    // Calcular totales
    const subtotalCalculated = formattedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )
    const totalDiscounts = formattedItems.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    )

    const orderDetail = {
      // Información básica de la orden
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      paidAt: order.paidAt,

      // Fechas importantes
      estimatedDelivery: order.estimatedDelivery,

      // Montos
      subtotal: order.subtotal,
      discountAmount: order.discountAmount || 0,
      shippingCost: order.shippingCost || 0,
      processingFee,
      taxAmount: order.taxAmount || 0,
      totalAmount: order.totalAmount,

      // Calculados
      subtotalCalculated,
      totalDiscounts,

      // Envío
      shippingMethod: order.shippingMethod,
      shippingAddress: formattedShippingAddress,

      // Notas
      customerNotes: order.customerNotes,
      adminNotes: order.adminNotes,

      // Items
      items: formattedItems,
      itemCount: formattedItems.length,

      // Seguimiento
      trackingHistory: formattedTrackingHistory,
      latestTracking: latestTracking
        ? {
            status: latestTracking.status,
            currentLocation: latestTracking.currentLocation,
            courierCompany: latestTracking.courierCompany,
            trackingNumber: latestTracking.trackingNumber,
            deliveryNotes: latestTracking.deliveryNotes,
            updatedAt: latestTracking.updatedAt
          }
        : null,

      // Estados útiles para UI
      canCancel: order.status === 'pending' || order.status === 'processing',
      hasTracking: trackingHistory && trackingHistory.length > 0,
      isDelivered: order.status === 'delivered',
      needsPayment:
        order.paymentStatus === 'pending' || order.paymentStatus === 'failed'
    }

    return NextResponse.json({ order: orderDetail })
  } catch (error) {
    console.error('Error en GET /api/customer/orders/[orderId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const customerId = parseInt(session.user.id)
    const orderId = parseInt(params.orderId)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de orden inválido' },
        { status: 400 }
      )
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json()
    const { action, customerNotes } = body

    // Obtener la orden
    const order = await orderModel.getOrderById(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la orden pertenece al cliente autenticado
    if (order.customerId !== customerId) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta orden' },
        { status: 403 }
      )
    }

    let updatedOrder = null

    switch (action) {
      case 'cancel':
        // Solo se puede cancelar si está en pending o processing
        if (order.status !== 'pending' && order.status !== 'processing') {
          return NextResponse.json(
            { error: 'No se puede cancelar esta orden en su estado actual' },
            { status: 400 }
          )
        }

        updatedOrder = await orderModel.updateOrderStatus(
          orderId,
          'cancelled',
          `Cancelada por el cliente: ${customerNotes || 'Sin motivo especificado'}`
        )
        break

      case 'update_notes':
        // Actualizar notas del cliente
        updatedOrder = await orderModel.updateOrder({ customerNotes }, orderId)
        break

      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Error al actualizar la orden' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Orden actualizada correctamente',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        customerNotes: updatedOrder.customerNotes
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/customer/orders/[orderId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
