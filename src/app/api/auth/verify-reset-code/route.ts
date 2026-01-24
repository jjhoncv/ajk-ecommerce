import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

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
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      )
    }

    // Verify the code
    const codes = await executeQuery<CodeRecord[]>({
      query: `
        SELECT * FROM verification_codes
        WHERE email = ?
          AND code = ?
          AND type = 'password_reset'
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
      `,
      values: [email, code]
    })

    if (!codes || codes.length === 0) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      )
    }

    // Code is valid - don't mark as used yet, that happens when password is reset
    return NextResponse.json({
      message: 'Código verificado correctamente',
      success: true
    })
  } catch (error) {
    console.error('Error in verify-reset-code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
