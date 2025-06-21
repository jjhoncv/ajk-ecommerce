// app/api/customer/orders/route.ts
import orderModel from '@/backend/order'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const customerId = parseInt(session.user.id)

    // Obtener parámetros de consulta opcionales
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // filtrar por estado
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let orders

    if (status) {
      // Si hay filtro por estado, obtener órdenes por estado del cliente
      const allOrdersByStatus = await orderModel.getOrdersByStatus(status)
      orders =
        allOrdersByStatus?.filter((order) => order.customerId === customerId) ||
        []
    } else {
      // Obtener todas las órdenes del cliente
      orders = await orderModel.getOrdersByCustomerId(customerId)
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        orders: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        }
      })
    }

    // Ordenar por fecha de creación (más recientes primero)
    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Implementar paginación
    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = orders.slice(startIndex, endIndex)

    // Formatear las órdenes para la respuesta
    const formattedOrders = paginatedOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery,
      // Campos adicionales útiles para la vista
      itemCount: order.orderItems?.length || 0,
      shippingMethod: order.shippingMethod,
      trackingAvailable:
        order.status === 'shipped' || order.status === 'delivered'
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error en GET /api/customer/orders:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
