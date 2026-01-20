import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const setPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*]/, 'Debe contener un carácter especial (!@#$%^&*)')
})

export async function POST(request: Request) {
  try {
    // Verificar que el usuario esté autenticado
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { password } = setPasswordSchema.parse(body)

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar contraseña y marcar que ya no necesita configurarla
    await executeQuery({
      query: `
        UPDATE customers
        SET password = ?, needs_password_setup = 0
        WHERE email = ?
      `,
      values: [hashedPassword, session.user.email]
    })

    return NextResponse.json({
      success: true,
      message: 'Contraseña guardada correctamente'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Contraseña inválida' },
        { status: 400 }
      )
    }

    console.error('Error setting password:', error)
    return NextResponse.json(
      { error: 'Error al guardar contraseña' },
      { status: 500 }
    )
  }
}
