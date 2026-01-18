// 📄 app/api/checkout/route.ts
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

// Models
import couponModel from '@/backend/coupon'
import customerModel from '@/backend/customer'
import customerAddressModel from '@/backend/customer-address'
import orderModel from '@/backend/order'
import orderItemsModel from '@/backend/order-item'
import paymentMethodModel from '@/backend/payment-method'
import paymentTransactionModel from '@/backend/payment-transaction'
import productVariantModel from '@/backend/product-variant'
import shippingZoneMethodModel from '@/backend/shipping-zone-method'

// Types
import { authOptions } from '@/lib/auth/auth'
import {
  type CheckoutResponse,
  type CouponValidation,
  type CreateOrderData,
  type OrderCalculation,
  type StockValidation
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

// Validar stock de los items
async function validateStock(items: any[]): Promise<StockValidation> {
  const errors: any[] = []

  for (const item of items) {
    const variant = await productVariantModel.getProductVariantById(item.id)

    if (!variant) {
      errors.push({
        variantId: item.id,
        requestedQuantity: item.quantity,
        availableStock: 0,
        message: 'Producto no encontrado'
      })
      continue
    }

    if (variant.stock < item.quantity) {
      errors.push({
        variantId: item.id,
        requestedQuantity: item.quantity,
        availableStock: variant.stock,
        message: `Stock insuficiente. Disponible: ${variant.stock}`
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validar cupón usando el método del modelo
async function validateCoupon(
  couponCode: string,
  customerId: number,
  totalAmount: number
): Promise<CouponValidation> {
  const validation = await couponModel.validateCoupon(
    couponCode,
    customerId,
    totalAmount
  )

  return {
    isValid: validation.isValid,
    coupon: validation.coupon,
    discountAmount: validation.discountAmount,
    error: validation.error
  }
}

// Helper para calcular el precio final de un item (precio base/promocional + costos adicionales)
function calculateItemFinalPrice(item: any): number {
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

// Calcular totales de la orden
async function calculateOrderTotals(
  items: any[],
  shippingCostInput: number | string,
  couponCode?: string,
  customerId?: number
): Promise<OrderCalculation> {
  // Asegurar que shippingCost sea un número
  const shippingCost = Number(shippingCostInput) || 0

  // Calcular subtotal considerando promociones y costos adicionales
  let subtotal = 0

  for (const item of items) {
    const itemPrice = calculateItemFinalPrice(item)
    subtotal += itemPrice * item.quantity
  }

  // Asegurar que subtotal sea un número válido
  subtotal = Number(subtotal) || 0

  let discountAmount = 0
  let appliedCoupon

  // Aplicar cupón si existe
  if (couponCode && customerId) {
    const couponValidation = await validateCoupon(
      couponCode,
      customerId,
      subtotal
    )
    if (couponValidation.isValid) {
      discountAmount = Number(couponValidation.discountAmount) || 0
      appliedCoupon = couponValidation.coupon
    }
  }

  // Calcular IGV (18% en Perú)
  const taxAmount = (subtotal - discountAmount + shippingCost) * 0.18

  const totalAmount = subtotal - discountAmount + shippingCost + taxAmount

  // Estimar entrega (ejemplo: 3-7 días)
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingCost: Number(shippingCost.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    estimatedDelivery,
    appliedCoupon
  }
}

// Generar número de orden único
function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${new Date().getFullYear()}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const orderData: CreateOrderData = await request.json()

    // 1. Validar stock
    const stockValidation = await validateStock(orderData.items)
    if (!stockValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stock insuficiente',
          validationErrors: stockValidation.errors.map((error) => ({
            field: `item_${error.variantId}`,
            message: error.message
          }))
        },
        { status: 400 }
      )
    }

    // 2. Calcular costo de envío
    const address = await customerAddressModel.getAddress(
      orderData.shippingAddressId
    )
    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dirección de envío no válida'
        },
        { status: 400 }
      )
    }

    const shippingCost = await shippingZoneMethodModel.getShippingCost(
      orderData.shippingMethodId,
      address.district,
      address.province,
      address.department,
      orderData.items.reduce(
        (total, item) => total + calculateItemFinalPrice(item) * item.quantity,
        0
      )
    )

    if (!shippingCost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Método de envío no disponible para esta dirección'
        },
        { status: 400 }
      )
    }

    // 3. Calcular totales
    const calculation = await calculateOrderTotals(
      orderData.items,
      shippingCost.finalCost,
      orderData.couponCode,
      user.id
    )

    // 4. Crear la orden
    const orderNumber = generateOrderNumber()

    const newOrder = await orderModel.createOrder({
      customerId: user.id,
      orderNumber,
      shippingAddressId: orderData.shippingAddressId,
      paymentMethod:
        (
          await paymentMethodModel.getPaymentMethodById(
            orderData.paymentMethodId
          )
        )?.code || '',
      shippingMethod: shippingCost.methodName,
      shippingCost: calculation.shippingCost,
      subtotal: calculation.subtotal,
      discountAmount: calculation.discountAmount,
      taxAmount: calculation.taxAmount,
      totalAmount: calculation.totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      customerNotes: orderData.customerNotes || null,
      adminNotes: null,
      estimatedDelivery: calculation.estimatedDelivery,
      paidAt: null
    })

    if (!newOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error creando la orden'
        },
        { status: 500 }
      )
    }

    // 5. Crear items de la orden
    const orderItems = orderData.items.map((item) => {
      // Usar la función helper para calcular el precio final (base/promocional + adicionales)
      const unitPrice = calculateItemFinalPrice(item)

      return {
        orderId: newOrder.id,
        variantId: item.id,
        productName: item.name,
        variantSku: `SKU-${item.id}`, // Esto debería venir de la variant real
        variantAttributes: {}, // Esto también debería venir de la variant
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        discountAmount: 0
      }
    })

    await orderItemsModel.createOrderItems(orderItems)

    // 6. Crear transacción de pago
    const transaction = await paymentTransactionModel.createTransaction({
      orderId: newOrder.id,
      paymentMethodId: orderData.paymentMethodId,
      amount: calculation.totalAmount,
      currency: 'PEN',
      paymentData: orderData.paymentData
    })

    // 7. Aplicar cupón si existe (registrar el uso)
    if (orderData.couponCode && calculation.appliedCoupon) {
      await couponModel.applyCoupon({
        couponCode: orderData.couponCode,
        customerId: user.id,
        orderId: newOrder.id,
        orderTotal: calculation.subtotal
      })
    }

    // 8. Reducir stock
    for (const item of orderData.items) {
      await productVariantModel.updateStock(item.id, -item.quantity)
    }

    const response: CheckoutResponse = {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      paymentUrl: transaction ? `/payment/${transaction.id}` : undefined
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error en checkout:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
