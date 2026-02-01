// 📄 app/api/shipping/calculate-user/route.ts
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

// Usar tus modelos existentes
import { customerAddressModel } from '@/module/customers/core'
import { shippingZoneMethodModel } from '@/module/shippings/core'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productVariantId, quantity = 1, orderValue } = body

    if (!productVariantId || !orderValue) {
      return NextResponse.json(
        {
          error: 'Missing required fields: productVariantId, orderValue'
        },
        { status: 400 }
      )
    }

    const customerId = parseInt(session.user.id)

    // 1. Obtener todas las direcciones del usuario usando tu modelo
    const userAddresses =
      await customerAddressModel.getAddressByCustomer(customerId)

    if (!userAddresses || userAddresses.length === 0) {
      return NextResponse.json({
        defaultAddress: null,
        allAddresses: [],
        message: 'No addresses found'
      })
    }

    // 2. Calcular opciones de envío para cada dirección
    const addressesWithShipping = []

    for (const address of userAddresses) {
      // Note: address.district is typed as Districts object but at runtime it's a string
      const districtName = address.district as unknown as string
      // Usar tu modelo existente para calcular opciones
      const shippingOptions =
        await shippingZoneMethodModel.calculateShippingOptions(
          districtName,
          address.province,
          address.department,
          orderValue
        )

      if (shippingOptions && shippingOptions.length > 0) {
        // Encontrar la opción más barata como default
        const defaultOption = shippingOptions.reduce((prev, current) =>
          prev.finalCost <= current.finalCost ? prev : current
        )

        addressesWithShipping.push({
          addressId: address.id,
          address: {
            id: address.id,
            alias: address.alias,
            streetName: address.streetName,
            streetNumber: address.streetNumber,
            district: address.district,
            province: address.province,
            department: address.department,
            apartment: address.apartment || undefined
          },
          shippingOptions,
          defaultShippingOption: defaultOption
        })
      }
    }

    // 3. Determinar dirección por defecto
    let defaultAddress = null

    // Buscar dirección marcada como default (verificar si este método existe)
    // Si no tienes este método, usaremos la primera dirección con isDefault = 1
    const defaultUserAddress = userAddresses.find(
      (addr) => addr.isDefault === 1
    )

    if (defaultUserAddress) {
      defaultAddress = addressesWithShipping.find(
        (addr) => addr.addressId === defaultUserAddress.id
      )
    }

    // Si no hay default o no tiene envío, usar la primera disponible
    if (!defaultAddress && addressesWithShipping.length > 0) {
      defaultAddress = addressesWithShipping[0]
    }

    return NextResponse.json({
      defaultAddress,
      allAddresses: addressesWithShipping,
      userId: session.user.id,
      // Información adicional para el frontend
      hasAddresses: userAddresses.length > 0,
      hasShippingOptions: addressesWithShipping.length > 0
    })
  } catch (error) {
    console.error('Error calculating shipping for user:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
