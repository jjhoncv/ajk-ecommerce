import { userModel } from '@/module/users/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

// POST - Actualizar contraseña del usuario
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validaciones
    if (!currentPassword || currentPassword.trim().length === 0) {
      return NextResponse.json(
        { error: 'La contraseña actual es requerida' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.trim().length === 0) {
      return NextResponse.json(
        { error: 'La nueva contraseña es requerida' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }

    // Obtener el usuario actual con su password
    const user = await userModel.getUser(Number(session.user.id))

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la contraseña actual sea correcta
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      )
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña
    const updatedUser = await userModel.updateUser(
      {
        password: hashedPassword
      },
      Number(session.user.id)
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente.'
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la contraseña' },
      { status: 500 }
    )
  }
}
