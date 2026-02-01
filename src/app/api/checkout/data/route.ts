// 📄 app/api/checkout/data/route.ts
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

// Models
import { customerModel, customerAddressModel } from '@/module/customers/core'
import { paymentMethodModel } from '@/module/payments/core'
import { shippingZoneMethodModel } from '@/module/shippings/core'

// Types
import { authOptions } from '@/lib/auth/auth'
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

    // Helper para calcular el precio final de un item (precio base/promocional + costos adicionales)
    const calculateItemFinalPrice = (item: any): number => {
      // Calcular costos adicionales de los atributos
      const additionalCost = item.variantAttributeOptions?.reduce((total: number, vao: any) => {
        return total + (Number(vao?.additionalCost) || 0)
      }, 0) || 0

      // Precio base del item
      const basePrice = Number(item.price || 0)

      let finalPrice = basePrice

      // Aplicar precio promocional si existe
      if (item.promotionVariants && item.promotionVariants.length > 0) {
        const activePromotion = item.promotionVariants.find(
          (pv: any) => {
            // Verificar que pv.promotion exista antes de acceder a sus propiedades
            if (!pv?.promotion) return false

            const now = new Date()
            const startDate = pv.promotion.startDate ? new Date(pv.promotion.startDate) : null
            const endDate = pv.promotion.endDate ? new Date(pv.promotion.endDate) : null

            const isActive = pv.promotion.isActive === 1
            const hasStarted = startDate ? now >= startDate : true
            const hasNotEnded = endDate ? now <= endDate : true

            return isActive && hasStarted && hasNotEnded
          }
        )

        if (activePromotion?.promotionPrice) {
          const promoPrice = Number(activePromotion.promotionPrice)
          if (!isNaN(promoPrice) && promoPrice > 0) {
            finalPrice = promoPrice
          }
        }
      }

      // Retornar precio final (promocional o base) + costos adicionales
      const result = finalPrice + additionalCost
      return isNaN(result) ? basePrice : result
    }

    // 3. Calcular subtotal considerando costos adicionales
    let subtotal = 0
    let itemCount = 0
    let totalQuantity = 0

    for (const item of items) {
      const itemPrice = calculateItemFinalPrice(item)
      subtotal += itemPrice * item.quantity
      itemCount++
      totalQuantity += item.quantity
    }

    // 4. Obtener opciones de envío
    // Note: selectedAddress.district is typed as Districts object but at runtime it's a string
    // This is a type mismatch between domain types and the actual mapper output
    const districtName = selectedAddress.district as unknown as string
    const shippingCalculations =
      districtName && selectedAddress.province && selectedAddress.department
        ? await shippingZoneMethodModel.calculateShippingOptions(
            districtName,
            selectedAddress.province,
            selectedAddress.department,
            subtotal
          )
        : undefined

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
    const initialShippingCost = Number(shippingOptions[0]?.cost) || 0
    const safeSubtotal = Number(subtotal) || 0
    const taxAmount = (safeSubtotal + initialShippingCost) * 0.18
    const totalAmount = safeSubtotal + initialShippingCost + taxAmount

    const calculation = {
      subtotal: safeSubtotal,
      discountAmount: 0,
      shippingCost: initialShippingCost,
      taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
      totalAmount: isNaN(totalAmount) ? safeSubtotal : totalAmount,
      estimatedDelivery: null
    }

    // 7. Preparar usuario para checkout
    const checkoutUser: CheckoutUser = {
      id: user.id,
      name: user.name || '',
      lastname: user.lastname || '',
      email: user.email,
      phone: user.phone ?? '',
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
      lastname: user.lastname || '',
      email: user.email,
      phone: user.phone ?? '',
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
