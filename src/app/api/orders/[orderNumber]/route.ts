import { customerModel } from '@/module/customers/core'
import { orderModel, orderItemsModel, orderTrackingModel } from '@/module/orders/core'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface Params {
  orderNumber: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const customer = await customerModel.getCustomerByEmail(session.user.email)
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    const order = await orderModel.getOrderByNumber(params.orderNumber)
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la orden pertenece al cliente
    if (order.customerId !== customer.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener items de la orden
    const orderItems = await orderItemsModel.getOrderItemsByOrderId(order.id)

    // Obtener seguimiento de la orden
    const tracking = await orderTrackingModel.getOrderTrackingsByOrderId(
      order.id
    )

    return NextResponse.json({
      order,
      items: orderItems || [],
      tracking: tracking || []
    })
  } catch (error) {
    console.error('Error getting order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
