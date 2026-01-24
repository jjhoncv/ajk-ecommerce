import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { customerModel } from '@/module/customers/core'
import emailService from '@/module/shared/services/email'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const customer = await customerModel.getCustomerByEmail(email)

    if (!customer) {
      // Don't reveal if the email exists or not for security
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un código de verificación' },
        { status: 200 }
      )
    }

    // Generate 6-digit code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Invalidate any existing password reset codes for this email
    await executeQuery({
      query: "UPDATE verification_codes SET used_at = NOW() WHERE email = ? AND type = 'password_reset' AND used_at IS NULL",
      values: [email]
    })

    // Store the new code
    await executeQuery({
      query: "INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, 'password_reset', ?)",
      values: [email, code, expiresAt]
    })

    // Send email with code
    const emailSent = await emailService.sendPasswordResetCodeEmail(email, code)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Error al enviar el correo. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Código enviado correctamente',
      success: true
    })
  } catch (error) {
    console.error('Error in forgot-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
