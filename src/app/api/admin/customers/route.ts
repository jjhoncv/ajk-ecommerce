// app/api/admin/customers/route.ts
import { customerModel } from '@/module/customers/core'
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Obtener todos los clientes con estadísticas
    let customers = await customerModel.getCustomersWithStats()

    if (!customers) {
      return NextResponse.json({
        customers: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 }
      })
    }

    // Filtrar por estado
    if (status && status !== 'all') {
      const isActive = status === 'active' ? 1 : 0
      customers = customers.filter((customer) => customer.isActive === isActive)
    }

    // Filtrar por búsqueda (nombre, apellido, email, dni)
    if (search) {
      const searchLower = search.toLowerCase()
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.lastname.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          (customer.dni && customer.dni.includes(search)) ||
          (customer.phone && customer.phone.includes(search))
      )
    }

    // Paginación
    const total = customers.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedCustomers = customers.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      customers: paginatedCustomers,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin/customers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verificar sesión admin
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID de cliente requerido' },
        { status: 400 }
      )
    }

    // Actualizar estado del cliente
    const updated = await customerModel.updateCustomer(
      { is_active: isActive ? 1 : 0 },
      id
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Error al actualizar el cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: isActive ? 'Cliente activado correctamente' : 'Cliente desactivado correctamente',
      customer: updated
    })
  } catch (error) {
    console.error('Error en PATCH /api/admin/customers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
