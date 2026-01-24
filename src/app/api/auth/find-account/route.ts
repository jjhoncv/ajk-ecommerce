import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface CustomerRecord {
  id: number
  email: string
  name: string
  lastname: string
  phone: string | null
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  return `${localPart.slice(0, 2)}***@${domain}`
}

export async function POST(request: Request) {
  try {
    const { search } = await request.json()

    if (!search || search.length < 3) {
      return NextResponse.json(
        { error: 'Ingresa al menos 3 caracteres para buscar' },
        { status: 400 }
      )
    }

    // Search by email or phone
    const customers = await executeQuery<CustomerRecord[]>({
      query: `
        SELECT id, email, name, lastname, phone
        FROM customers
        WHERE email = ? OR phone = ?
        LIMIT 1
      `,
      values: [search, search]
    })

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ninguna cuenta con esos datos' },
        { status: 404 }
      )
    }

    const customer = customers[0]

    // Return masked data for security
    return NextResponse.json({
      account: {
        id: customer.id,
        email: customer.email,
        maskedEmail: maskEmail(customer.email),
        name: `${customer.name} ${customer.lastname}`.trim()
      }
    })
  } catch (error) {
    console.error('Error in find-account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
