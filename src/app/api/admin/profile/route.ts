import { userModel } from '@/module/users/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

// GET - Obtener perfil del usuario actual
export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await userModel.getUser(Number(session.user.id))

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // No enviar el password al frontend
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar perfil del usuario (sin password)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { name, lastname, email } = body

    // Validaciones
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    if (!lastname || lastname.trim().length === 0) {
      return NextResponse.json(
        { error: 'El apellido es requerido' },
        { status: 400 }
      )
    }

    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe para otro usuario
    if (email !== session.user.email) {
      const existingUser = await userModel.getUserByEmail(email)
      if (existingUser && existingUser.id !== Number(session.user.id)) {
        return NextResponse.json(
          { error: 'El email ya está en uso' },
          { status: 400 }
        )
      }
    }

    // Actualizar usuario
    const updatedUser = await userModel.updateUser(
      {
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim()
      },
      Number(session.user.id)
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      )
    }

    // No enviar el password al frontend
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    )
  }
}
