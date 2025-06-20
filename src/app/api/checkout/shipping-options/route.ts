// 📄 app/api/checkout/shipping-options/route.ts
import shippingZoneMethodModel from '@/backend/shipping-zone-method'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { district, province, department, orderValue } = await request.json()

    if (!district || !province || !department || !orderValue) {
      return NextResponse.json(
        { error: 'Datos de dirección y valor de orden requeridos' },
        { status: 400 }
      )
    }

    const shippingOptions =
      await shippingZoneMethodModel.calculateShippingOptions(
        district,
        province,
        department,
        orderValue
      )

    if (!shippingOptions || shippingOptions.length === 0) {
      return NextResponse.json({
        options: [],
        message: 'No hay métodos de envío disponibles para esta dirección'
      })
    }

    const formattedOptions = shippingOptions.map((option) => ({
      methodId: option.methodId,
      methodName: option.methodName,
      cost: option.finalCost,
      isFree: option.isFree,
      estimatedDays: option.estimatedDays,
      description: option.isFree ? 'Envío gratis' : undefined
    }))

    return NextResponse.json({
      options: formattedOptions
    })
  } catch (error) {
    console.error('Error getting shipping options:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
