import CustomerService from '@/services/customer'
import { type CustomerData } from '@/services/customer/types'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CustomerData = await request.json()
    const { name, lastname, email, password } = body

    // Validaciones básicas
    if (name === '' || lastname === '' || email === '' || password === '') {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    try {
      const newCustomer = await CustomerService.register({
        name,
        lastname,
        email,
        password
      })

      // Retornar el cliente creado (sin la contraseña)
      return NextResponse.json(newCustomer, { status: 201 })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 409 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error al registrar cliente:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
