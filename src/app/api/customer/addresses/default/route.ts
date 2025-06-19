// app/api/customer/addresses/default/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Aquí obtendrías la dirección por defecto del cliente autenticado
    // const userId = await getUserFromSession();
    // const defaultAddress = await getDefaultAddress(userId);

    // Ejemplo de respuesta
    const defaultAddress = {
      id: 1,
      id_customer: 1,
      alias: 'Casa',
      street_name: 'Av. Javier Prado Este',
      street_number: '1234',
      apartment: 'Dpto 501',
      district: 'San Isidro',
      province: 'Lima',
      department: 'Lima',
      is_default: 1,
      latitude: -12.0464,
      longitude: -77.0428,
      created_at: new Date(),
      updated_at: new Date()
    }

    return NextResponse.json({ address: defaultAddress })
  } catch (error) {
    console.error('Error loading default address:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
