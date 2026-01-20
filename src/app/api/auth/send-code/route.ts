import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import emailService from '@/module/shared/services/email'

const sendCodeSchema = z.object({
  email: z.string().email()
})

// Generar código de 4 dígitos
const generateCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = sendCodeSchema.parse(body)

    const normalizedEmail = email.toLowerCase()

    // Generar código
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // Expira en 10 minutos

    // Eliminar códigos anteriores para este email
    await executeQuery({
      query: 'DELETE FROM verification_codes WHERE email = ?',
      values: [normalizedEmail]
    })

    // Insertar nuevo código
    await executeQuery({
      query: `
        INSERT INTO verification_codes (email, code, expires_at)
        VALUES (?, ?, ?)
      `,
      values: [normalizedEmail, code, expiresAt]
    })

    // Enviar email con el código
    const emailSent = await emailService.sendVerificationCodeEmail(normalizedEmail, code)

    if (!emailSent) {
      console.error('Error sending verification email to:', normalizedEmail)
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Código enviado correctamente'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    console.error('Error sending code:', error)
    return NextResponse.json(
      { error: 'Error al enviar código' },
      { status: 500 }
    )
  }
}
