import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { customerModel } from '@/module/customers/core'
import bcrypt from 'bcryptjs'

interface CodeRecord {
  id: number
  email: string
  code: string
  type: string
  expires_at: Date
  used_at: Date | null
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Validate password requirements
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos una mayúscula' },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos una minúscula' },
        { status: 400 }
      )
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos un número' },
        { status: 400 }
      )
    }

    // Get customer
    const customer = await customerModel.getCustomerByEmail(email)

    if (!customer) {
      return NextResponse.json(
        { error: 'No se pudo restablecer la contraseña' },
        { status: 400 }
      )
    }

    // Verify there's a valid (verified) code for this email
    const codes = await executeQuery<CodeRecord[]>({
      query: `
        SELECT * FROM verification_codes
        WHERE email = ?
          AND type = 'password_reset'
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
      `,
      values: [email]
    })

    if (!codes || codes.length === 0) {
      return NextResponse.json(
        { error: 'Sesión de recuperación expirada. Solicita un nuevo código.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the customer's password
    await customerModel.updateCustomer(
      { password: hashedPassword },
      customer.id
    )

    // Mark the code as used
    await executeQuery({
      query: 'UPDATE verification_codes SET used_at = NOW() WHERE id = ?',
      values: [codes[0].id]
    })

    return NextResponse.json({
      message: 'Contraseña restablecida correctamente',
      success: true
    })
  } catch (error) {
    console.error('Error in reset-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
