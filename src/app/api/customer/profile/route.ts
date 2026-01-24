// app/api/customer/profile/route.ts
import { customerModel } from '@/module/customers/core'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json()
    const { name, lastname, email, phone, dni } = body

    // Validaciones básicas
    if (!name || !lastname || !email) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe (si es diferente al actual)
    const currentCustomer = await customerModel.getCustomer(
      parseInt(session.user.id)
    )
    if (!currentCustomer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    if (email !== currentCustomer.email) {
      const existingCustomer = await customerModel.getCustomerByEmail(email)
      if (
        existingCustomer &&
        existingCustomer.id !== parseInt(session.user.id)
      ) {
        return NextResponse.json(
          { error: 'El email ya está en uso' },
          { status: 400 }
        )
      }
    }

    // Actualizar datos del cliente
    const updatedCustomer = await customerModel.updateCustomer(
      {
        name,
        lastname,
        email,
        phone: phone || null,
        dni: dni || null
      },
      parseInt(session.user.id)
    )

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Perfil actualizado correctamente',
      customer: {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        lastname: updatedCustomer.lastname,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        dni: updatedCustomer.dni
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/customer/profile:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
