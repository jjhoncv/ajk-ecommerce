import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const checkEmailSchema = z.object({
  email: z.string().email()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = checkEmailSchema.parse(body)

    // Verificar si el email existe en la tabla de customers
    const customers = await executeQuery<Array<{ id: number }>>({
      query: 'SELECT id FROM customers WHERE email = ? LIMIT 1',
      values: [email.toLowerCase()]
    })

    const exists = customers && customers.length > 0

    return NextResponse.json({ exists })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    console.error('Error checking email:', error)
    return NextResponse.json(
      { error: 'Error al verificar email' },
      { status: 500 }
    )
  }
}
