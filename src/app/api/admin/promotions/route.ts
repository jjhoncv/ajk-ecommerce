// app/api/admin/promotions/route.ts
import { promotionModel, promotionRepository, promotionVariantModel } from '@/module/promotions/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const promotions = await promotionModel.getPromotions()

    if (!promotions) {
      return NextResponse.json({ promotions: [] })
    }

    // Get variant counts for each promotion
    const promotionsWithCounts = await Promise.all(
      promotions.map(async (promotion) => {
        const metrics = await promotionVariantModel.getPromotionMetrics(promotion.id)
        return {
          ...promotion,
          variantCount: metrics?.totalVariants || 0,
          variantsWithStock: metrics?.variantsWithStock || 0
        }
      })
    )

    return NextResponse.json({ promotions: promotionsWithCounts })
  } catch (error) {
    console.error('Error en GET /api/admin/promotions:', error)
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
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      minPurchaseAmount,
      imageUrl,
      isActive,
      type,
      displayOrder
    } = body

    if (!name || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const userId = session.user.id ? Number(session.user.id) : null

    const promotionData = {
      name,
      description: description || null,
      discount_type: discountType,
      discount_value: discountValue,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      min_purchase_amount: minPurchaseAmount || null,
      image_url: imageUrl || null,
      is_active: isActive ? 1 : 0,
      type: type || null,
      display_order: displayOrder || 0,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: userId,
      updated_by: userId
    }

    const promotion = await promotionRepository.createPromotion(promotionData)

    return NextResponse.json({
      message: 'Promoción creada correctamente',
      promotion
    })
  } catch (error) {
    console.error('Error en POST /api/admin/promotions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
