// 📄 app/api/checkout/validate-coupon/route.ts
import couponModel from '@/backend/coupon'
import customerModel from '@/backend/customer'
import { authOptions } from '@/lib/auth/auth'
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

    // Usar el método validateCoupon del modelo que hace todas las validaciones
    console.log('Validating coupon:', { couponCode: couponCode.toUpperCase(), customerId: customer.id, totalAmount: Number(totalAmount) })

    const validation = await couponModel.validateCoupon(
      couponCode.toUpperCase(),
      customer.id,
      Number(totalAmount)
    )

    console.log('Validation result:', validation)

    if (!validation.isValid) {
      return NextResponse.json({
        isValid: false,
        error: validation.error || 'Cupón no válido',
        discountAmount: 0
      })
    }

    return NextResponse.json({
      isValid: true,
      coupon: validation.coupon,
      discountAmount: validation.discountAmount,
      message: `Descuento aplicado: S/ ${validation.discountAmount.toFixed(2)}`
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { isValid: false, error: 'Error interno del servidor', discountAmount: 0 },
      { status: 500 }
    )
  }
}
