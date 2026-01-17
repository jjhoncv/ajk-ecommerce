// app/api/admin/orders/[orderId]/route.ts
import orderModel from '@/backend/order'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { orderId } = await params
    const orderIdNum = parseInt(orderId)

    if (isNaN(orderIdNum)) {
      return NextResponse.json({ error: 'ID de orden inválido' }, { status: 400 })
    }

    const order = await orderModel.getOrderById(orderIdNum)
    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error en GET /api/admin/orders/[orderId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { orderId } = await params
    const orderIdNum = parseInt(orderId)

    if (isNaN(orderIdNum)) {
      return NextResponse.json({ error: 'ID de orden inválido' }, { status: 400 })
    }

    const body = await request.json()
    const { status, adminNotes, paymentStatus } = body

    // Verificar que la orden existe
    const existingOrder = await orderModel.getOrderById(orderIdNum)
    if (!existingOrder) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Actualizar orden
    const updateData: any = {}

    if (status && status !== existingOrder.status) {
      updateData.status = status
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    if (paymentStatus && paymentStatus !== existingOrder.paymentStatus) {
      updateData.paymentStatus = paymentStatus
      if (paymentStatus === 'paid' && !existingOrder.paidAt) {
        updateData.paidAt = new Date()
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'Sin cambios', order: existingOrder })
    }

    const updatedOrder = await orderModel.updateOrder(updateData, orderIdNum)

    return NextResponse.json({
      message: 'Orden actualizada correctamente',
      order: updatedOrder
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/orders/[orderId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
