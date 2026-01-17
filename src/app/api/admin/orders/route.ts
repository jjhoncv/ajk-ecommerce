// app/api/admin/orders/route.ts
import orderModel from '@/backend/order'
import paymentTransactionModel from '@/backend/payment-transaction'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar sesión admin
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Obtener todas las órdenes
    let orders = await orderModel.getAllOrders()

    if (!orders) {
      return NextResponse.json({
        orders: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 }
      })
    }

    // Filtrar por estado
    if (status && status !== 'all') {
      orders = orders.filter((order) => order.status === status)
    }

    // Filtrar por estado de pago
    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((order) => order.paymentStatus === paymentStatus)
    }

    // Filtrar por búsqueda (número de orden)
    if (search) {
      const searchLower = search.toLowerCase()
      orders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar por fecha (más recientes primero)
    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Paginación
    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedOrders = orders.slice(startIndex, startIndex + limit)

    // Formatear órdenes con información adicional
    const formattedOrders = await Promise.all(
      paginatedOrders.map(async (order) => {
        // Obtener transacción de pago para la comisión
        const transactions = await paymentTransactionModel.getTransactionsByOrderId(order.id)
        const processingFee = transactions?.[0]?.processingFee ? Number(transactions[0].processingFee) : 0

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount || 0,
          shippingCost: order.shippingCost || 0,
          processingFee,
          taxAmount: order.taxAmount || 0,
          totalAmount: order.totalAmount + processingFee,
          shippingMethod: order.shippingMethod,
          createdAt: order.createdAt,
          customerId: order.customerId,
          customerName: order.customerName || 'Cliente',
          customerEmail: order.customerEmail || '',
          itemCount: order.itemCount || 0
        }
      })
    )

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
    console.error('Error en GET /api/admin/orders:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
