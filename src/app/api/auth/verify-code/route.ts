import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(4)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code } = verifyCodeSchema.parse(body)

    const normalizedEmail = email.toLowerCase()

    // Verificar código
    const codes = await executeQuery<Array<{ id: number; code: string; expires_at: Date }>>({
      query: `
        SELECT id, code, expires_at
        FROM verification_codes
        WHERE email = ? AND code = ? AND expires_at > NOW()
        LIMIT 1
      `,
      values: [normalizedEmail, code]
    })

    if (!codes || codes.length === 0) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      )
    }

    // Eliminar el código usado
    await executeQuery({
      query: 'DELETE FROM verification_codes WHERE email = ?',
      values: [normalizedEmail]
    })

    // Generar contraseña temporal
    const tempPassword = uuidv4().slice(0, 12)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Crear usuario con datos mínimos
    // name y lastname serán temporales hasta que el usuario complete su perfil
    const emailPrefix = normalizedEmail.split('@')[0]

    await executeQuery({
      query: `
        INSERT INTO customers (email, password, name, lastname, needs_password_setup)
        VALUES (?, ?, ?, ?, 1)
      `,
      values: [normalizedEmail, hashedPassword, emailPrefix, '', true]
    })

    return NextResponse.json({
      success: true,
      tempPassword, // Para iniciar sesión automáticamente
      message: 'Registro exitoso'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Si es un error de duplicado de email
    if (error instanceof Error && error.message.includes('Duplicate')) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 400 }
      )
    }

    console.error('Error verifying code:', error)
    return NextResponse.json(
      { error: 'Error al verificar código' },
      { status: 500 }
    )
  }
}
