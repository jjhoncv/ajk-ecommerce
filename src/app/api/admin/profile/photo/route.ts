import userModel from '@/backend/user'
import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

// POST - Actualizar foto de perfil del usuario
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { photoUrl } = body

    // Validación
    if (!photoUrl || photoUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'La URL de la foto es requerida' },
        { status: 400 }
      )
    }

    // Actualizar la foto del usuario
    const updatedUser = await userModel.updateUser(
      {
        photo: photoUrl.trim()
      },
      Number(session.user.id)
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar la foto de perfil' },
        { status: 500 }
      )
    }

    // No enviar el password al frontend
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Foto de perfil actualizada correctamente',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Error updating profile photo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la foto de perfil' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar foto de perfil del usuario
export async function DELETE() {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Actualizar la foto a null
    const updatedUser = await userModel.updateUser(
      {
        photo: null
      },
      Number(session.user.id)
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al eliminar la foto de perfil' },
        { status: 500 }
      )
    }

    // No enviar el password al frontend
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Foto de perfil eliminada correctamente',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Error deleting profile photo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la foto de perfil' },
      { status: 500 }
    )
  }
}
