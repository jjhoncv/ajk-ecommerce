// 📄 app/api/checkout/data/route.ts
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

// Models
import customerModel from '@/backend/customer'
import customerAddressModel from '@/backend/customer-address'
import paymentMethodModel from '@/backend/payment-method'
import shippingZoneMethodModel from '@/backend/shipping-zone-method'

// Types
import { authOptions } from '@/lib/auth'
import {
  type CheckoutSummary,
  type CheckoutUser,
  type PaymentOption,
  type ShippingOption
} from '@/types/checkout'

// Función para obtener el usuario autenticado
async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  // Buscar el customer por email (ajusta según tu lógica de autenticación)
  const customer = await customerModel.getCustomerByEmail(session.user.email)
  return customer
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const { items, shippingAddressId } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items del carrito requeridos' },
        { status: 400 }
      )
    }

    // 1. Obtener direcciones del cliente
    const addresses = await customerAddressModel.getAddressByCustomer(user.id)
    if (!addresses || addresses.length === 0) {
      return NextResponse.json(
        { error: 'No hay direcciones registradas' },
        { status: 400 }
      )
    }

    // 2. Determinar dirección de envío
    let selectedAddress = addresses.find(
      (addr) => addr.id === shippingAddressId
    )
    if (!selectedAddress) {
      selectedAddress =
        addresses.find((addr) => addr.isDefault === 1) || addresses[0]
    }

    // 3. Calcular subtotal
    let subtotal = 0
    let itemCount = 0
    let totalQuantity = 0

    for (const item of items) {
      let itemPrice = item.price

      // Aplicar precio promocional si existe
      if (item.promotionVariants && item.promotionVariants.length > 0) {
        const activePromotion = item.promotionVariants.find(
          (pv: any) =>
            pv.promotion.isActive === 1 &&
            new Date() >= new Date(pv.promotion.startDate) &&
            new Date() <= new Date(pv.promotion.endDate)
        )

        if (activePromotion) {
          itemPrice = parseFloat(activePromotion.promotionPrice)
        }
      }

      subtotal += itemPrice * item.quantity
      itemCount++
      totalQuantity += item.quantity
    }

    // 4. Obtener opciones de envío
    const shippingCalculations =
      await shippingZoneMethodModel.calculateShippingOptions(
        selectedAddress.district,
        selectedAddress.province,
        selectedAddress.department,
        subtotal
      )

    const shippingOptions: ShippingOption[] =
      shippingCalculations?.map((calc) => ({
        methodId: calc.methodId,
        methodName: calc.methodName,
        cost: calc.finalCost,
        isFree: calc.isFree,
        estimatedDays: calc.estimatedDays,
        description: calc.isFree ? 'Envío gratis' : undefined
      })) || []

    // 5. Obtener métodos de pago válidos
    const paymentCalculations =
      await paymentMethodModel.getValidPaymentMethodsForAmount(subtotal)

    // Obtener los métodos de pago completos para tener toda la información
    const allPaymentMethods = await paymentMethodModel.getPaymentMethods()

    const paymentOptions: PaymentOption[] =
      paymentCalculations?.map((calc) => {
        // Buscar el método completo por ID
        const fullMethod = allPaymentMethods?.find(
          (m) => m.id === calc.methodId
        )

        return {
          methodId: calc.methodId,
          methodName: fullMethod?.name || '',
          methodCode: fullMethod?.code || '',
          baseAmount: calc.baseAmount,
          processingFee: calc.processingFee,
          finalAmount: calc.finalAmount,
          iconUrl: fullMethod?.iconUrl || undefined,
          description: fullMethod?.description || calc.reason,
          requiresVerification: fullMethod?.requiresVerification === 1
        }
      }) || []

    // 6. Cálculo inicial (sin envío ni descuentos)
    const calculation = {
      subtotal,
      discountAmount: 0,
      shippingCost: shippingOptions[0]?.cost || 0,
      taxAmount: (subtotal + (shippingOptions[0]?.cost || 0)) * 0.18,
      totalAmount:
        subtotal +
        (shippingOptions[0]?.cost || 0) +
        (subtotal + (shippingOptions[0]?.cost || 0)) * 0.18,
      estimatedDelivery: null
    }

    // 7. Preparar usuario para checkout
    const checkoutUser: CheckoutUser = {
      id: user.id,
      name: user.name || '',
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      addresses,
      defaultAddressId: addresses.find((addr) => addr.isDefault === 1)?.id
    }

    const summary: CheckoutSummary = {
      items,
      itemCount,
      totalQuantity,
      calculation,
      shippingOptions,
      paymentOptions,
      customerAddresses: addresses,
      selectedAddress
    }

    return NextResponse.json({
      user: checkoutUser,
      summary
    })
  } catch (error) {
    console.error('Error obteniendo datos de checkout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para obtener datos iniciales sin items del carrito
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Obtener direcciones del cliente
    const addresses = await customerAddressModel.getAddressByCustomer(user.id)

    // Obtener todos los métodos de pago activos
    const allPaymentMethods = await paymentMethodModel.getPaymentMethods()

    const checkoutUser: CheckoutUser = {
      id: user.id,
      name: user.name || '',
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      addresses: addresses || [],
      defaultAddressId: addresses?.find((addr) => addr.isDefault === 1)?.id
    }

    return NextResponse.json({
      user: checkoutUser,
      paymentMethods: allPaymentMethods || []
    })
  } catch (error) {
    console.error('Error obteniendo datos iniciales:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
