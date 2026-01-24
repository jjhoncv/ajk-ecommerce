// app/api/admin/customers/[customerId]/route.ts
import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel } from '@/module/orders/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    // Verificar sesión admin
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { customerId: customerIdParam } = await params
    const customerId = parseInt(customerIdParam)

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'ID de cliente inválido' },
        { status: 400 }
      )
    }

    // Obtener cliente con estadísticas
    const customer = await customerModel.getCustomerWithStats(customerId)
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Obtener direcciones del cliente
    const addresses = await customerAddressModel.getAddressByCustomer(customerId)

    // Obtener órdenes del cliente
    const allOrders = await orderModel.getAllOrders()
    const customerOrders = allOrders?.filter(
      (order) => order.customerId === customerId
    ).slice(0, 10) || []

    return NextResponse.json({
      customer,
      addresses: addresses || [],
      recentOrders: customerOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      }))
    })
  } catch (error) {
    console.error('Error en GET /api/admin/customers/[customerId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    // Verificar sesión admin
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { customerId: customerIdParam } = await params
    const customerId = parseInt(customerIdParam)

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'ID de cliente inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, lastname, phone, dni, isActive } = body

    // Verificar que el cliente existe
    const existingCustomer = await customerModel.getCustomer(customerId)
    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar cliente
    const updated = await customerModel.updateCustomer(
      {
        name,
        lastname,
        phone: phone || null,
        dni: dni || null,
        is_active: isActive ? 1 : 0
      },
      customerId
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Error al actualizar el cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Cliente actualizado correctamente',
      customer: updated
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/customers/[customerId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
