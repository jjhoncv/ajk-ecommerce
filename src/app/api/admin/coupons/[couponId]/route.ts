// app/api/admin/coupons/[couponId]/route.ts
import { couponModel } from '@/module/coupons/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ couponId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { couponId } = await params
    const couponIdNum = parseInt(couponId)

    if (isNaN(couponIdNum)) {
      return NextResponse.json({ error: 'ID de cupón inválido' }, { status: 400 })
    }

    const coupon = await couponModel.getCouponById(couponIdNum)
    if (!coupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    // Get usage history
    const usages = await couponModel.getCouponUsages(couponIdNum)

    return NextResponse.json({
      coupon,
      usages: usages || []
    })
  } catch (error) {
    console.error('Error en GET /api/admin/coupons/[couponId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { couponId } = await params
    const couponIdNum = parseInt(couponId)

    if (isNaN(couponIdNum)) {
      return NextResponse.json({ error: 'ID de cupón inválido' }, { status: 400 })
    }

    const existingCoupon = await couponModel.getCouponById(couponIdNum)
    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
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

    // Check if code already exists (excluding current coupon)
    if (code && code !== existingCoupon.code) {
      const codeExists = await couponModel.codeExists(code, couponIdNum)
      if (codeExists) {
        return NextResponse.json(
          { error: 'El código de cupón ya existe' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (code !== undefined) updateData.code = code.toUpperCase()
    if (description !== undefined) updateData.description = description
    if (discountType !== undefined) updateData.discountType = discountType
    if (discountValue !== undefined) updateData.discountValue = parseFloat(discountValue)
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (minPurchaseAmount !== undefined) {
      updateData.minPurchaseAmount = minPurchaseAmount ? parseFloat(minPurchaseAmount) : null
    }
    if (maxDiscountAmount !== undefined) {
      updateData.maxDiscountAmount = maxDiscountAmount ? parseFloat(maxDiscountAmount) : null
    }
    if (usageLimit !== undefined) {
      updateData.usageLimit = usageLimit ? parseInt(usageLimit) : null
    }
    if (usageLimitPerCustomer !== undefined) {
      updateData.usageLimitPerCustomer = usageLimitPerCustomer ? parseInt(usageLimitPerCustomer) : null
    }
    if (isActive !== undefined) updateData.isActive = isActive ? 1 : 0
    if (applicableTo !== undefined) updateData.applicableTo = applicableTo
    if (applicableIds !== undefined) updateData.applicableIds = applicableIds

    const updatedCoupon = await couponModel.updateCoupon(updateData, couponIdNum)

    return NextResponse.json({
      message: 'Cupón actualizado correctamente',
      coupon: updatedCoupon
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/coupons/[couponId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { couponId } = await params
    const couponIdNum = parseInt(couponId)

    if (isNaN(couponIdNum)) {
      return NextResponse.json({ error: 'ID de cupón inválido' }, { status: 400 })
    }

    const existingCoupon = await couponModel.getCouponById(couponIdNum)
    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    await couponModel.deleteCoupon(couponIdNum)

    return NextResponse.json({
      message: 'Cupón eliminado correctamente'
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/coupons/[couponId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
