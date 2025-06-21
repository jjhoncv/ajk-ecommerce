// 📄 app/api/checkout/validate-coupon/route.ts
import couponModel from '@/backend/coupon'
import customerModel from '@/backend/customer'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const customer = await customerModel.getCustomerByEmail(session.user.email)
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    const { couponCode, totalAmount } = await request.json()

    if (!couponCode || !totalAmount) {
      return NextResponse.json(
        { error: 'Código de cupón y monto total requeridos' },
        { status: 400 }
      )
    }

    const coupon = await couponModel.getCouponByCode(couponCode)

    if (!coupon) {
      return NextResponse.json({
        isValid: false,
        error: 'Cupón no válido',
        discountAmount: 0
      })
    }

    if (!coupon.isActive) {
      return NextResponse.json({
        isValid: false,
        error: 'Cupón no activo',
        discountAmount: 0
      })
    }

    const now = new Date()
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return NextResponse.json({
        isValid: false,
        error: 'Cupón expirado',
        discountAmount: 0
      })
    }

    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
      return NextResponse.json({
        isValid: false,
        error: `Monto mínimo requerido: S/ ${coupon.minPurchaseAmount}`,
        discountAmount: 0
      })
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

    return NextResponse.json({
      isValid: true,
      coupon,
      discountAmount,
      message: `Descuento aplicado: S/ ${discountAmount.toFixed(2)}`
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
