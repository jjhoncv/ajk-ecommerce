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

// Validar cupón
async function validateCoupon(
  couponCode: string,
  customerId: number,
  totalAmount: number
): Promise<CouponValidation> {
  try {
    const coupon = await couponModel.getCouponByCode(couponCode)

    if (!coupon) {
      return { isValid: false, discountAmount: 0, error: 'Cupón no válido' }
    }

    if (!coupon.isActive) {
      return { isValid: false, discountAmount: 0, error: 'Cupón no activo' }
    }

    const now = new Date()
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return { isValid: false, discountAmount: 0, error: 'Cupón expirado' }
    }

    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        error: `Monto mínimo requerido: S/ ${coupon.minPurchaseAmount}`
      }
    }

    // Calcular descuento
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (totalAmount * coupon.discountValue) / 100
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount
      }
    } else {
      discountAmount = coupon.discountValue
    }

    return {
      isValid: true,
      coupon,
      discountAmount
    }
  } catch (error) {
    return { isValid: false, discountAmount: 0, error: 'Error validando cupón' }
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
      (pv: any) =>
        pv.promotion.isActive === 1 &&
        new Date() >= new Date(pv.promotion.startDate) &&
        new Date() <= new Date(pv.promotion.endDate)
    )

    if (activePromotion) {
      finalPrice = parseFloat(activePromotion.promotionPrice)
    }
  }

  // Retornar precio final (promocional o base) + costos adicionales
  return finalPrice + additionalCost
}

// Calcular totales de la orden
async function calculateOrderTotals(
  items: any[],
  shippingCost: number,
  couponCode?: string,
  customerId?: number
): Promise<OrderCalculation> {
  // Calcular subtotal considerando promociones y costos adicionales
  let subtotal = 0

  for (const item of items) {
    const itemPrice = calculateItemFinalPrice(item)
    subtotal += itemPrice * item.quantity
  }

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
      discountAmount = couponValidation.discountAmount
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
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    totalAmount,
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

    // 7. Aplicar cupón si existe
    if (orderData.couponCode && calculation.appliedCoupon) {
      await couponModel.applyCoupon({
        couponCode: orderData.couponCode,
        customerId: user.id,
        orderId: newOrder.id,
        orderTotal: calculation.discountAmount
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
