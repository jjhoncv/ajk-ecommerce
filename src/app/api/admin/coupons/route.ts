// app/api/admin/coupons/route.ts
import { couponModel } from '@/module/coupons/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const coupons = await couponModel.getCouponsWithStats()

    return NextResponse.json({ coupons: coupons || [] })
  } catch (error) {
    console.error('Error en GET /api/admin/coupons:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      minPurchaseAmount,
      maxDiscountAmount,
      usageLimit,
      usageLimitPerCustomer,
      isActive,
      applicableTo,
      applicableIds
    } = body

    if (!name || !code || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const codeExists = await couponModel.codeExists(code)
    if (codeExists) {
      return NextResponse.json(
        { error: 'El código de cupón ya existe' },
        { status: 400 }
      )
    }

    const couponData = {
      name,
      code: code.toUpperCase(),
      description: description || null,
      discountType,
      discountValue: parseFloat(discountValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : null,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      usageLimitPerCustomer: usageLimitPerCustomer ? parseInt(usageLimitPerCustomer) : null,
      isActive: isActive ? 1 : 0,
      usedCount: 0,
      applicableTo: applicableTo || 'all',
      applicableIds: applicableIds || null
    }

    const coupon = await couponModel.createCoupon(couponData)

    return NextResponse.json({
      message: 'Cupón creado correctamente',
      coupon
    })
  } catch (error) {
    console.error('Error en POST /api/admin/coupons:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
