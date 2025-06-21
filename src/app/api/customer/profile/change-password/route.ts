// app/api/customer/change-password/route.ts
import customerModel from '@/backend/customer'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
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
    const { currentPassword, newPassword } = body

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'La contraseña actual y nueva son requeridas' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe ser diferente a la actual' },
        { status: 400 }
      )
    }

    // Obtener el cliente actual
    const customer = await customerModel.getCustomer(parseInt(session.user.id))
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      customer.password
    )
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      )
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña
    const updatedCustomer = await customerModel.updateCustomer(
      {
        password: hashedNewPassword
      },
      parseInt(session.user.id)
    )

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Contraseña actualizada correctamente'
    })
  } catch (error) {
    console.error('Error en PUT /api/customer/change-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
