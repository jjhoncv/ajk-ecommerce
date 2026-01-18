// app/api/admin/promotions/[promotionId]/route.ts
import { promotionModel, promotionRepository, promotionVariantModel } from '@/module/promotions/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ promotionId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { promotionId } = await params
    const promotionIdNum = parseInt(promotionId)

    if (isNaN(promotionIdNum)) {
      return NextResponse.json({ error: 'ID de promoción inválido' }, { status: 400 })
    }

    const promotion = await promotionModel.getPromotionById(promotionIdNum)
    if (!promotion) {
      return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 })
    }

    // Get promotion variants with product info
    const variants = await promotionVariantModel.getPromotionVariantsByPromotionId(promotionIdNum)
    const metrics = await promotionVariantModel.getPromotionMetrics(promotionIdNum)

    return NextResponse.json({
      promotion: {
        ...promotion,
        variants: variants || [],
        metrics
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin/promotions/[promotionId]:', error)
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

    const { promotionId } = await params
    const promotionIdNum = parseInt(promotionId)

    if (isNaN(promotionIdNum)) {
      return NextResponse.json({ error: 'ID de promoción inválido' }, { status: 400 })
    }

    const existingPromotion = await promotionModel.getPromotionById(promotionIdNum)
    if (!existingPromotion) {
      return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 })
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

    const promotionData = {
      name: name || existingPromotion.name,
      description: description !== undefined ? description : existingPromotion.description,
      discount_type: discountType || existingPromotion.discountType,
      discount_value: discountValue !== undefined ? discountValue : existingPromotion.discountValue,
      start_date: startDate ? new Date(startDate) : existingPromotion.startDate,
      end_date: endDate ? new Date(endDate) : existingPromotion.endDate,
      min_purchase_amount: minPurchaseAmount !== undefined ? minPurchaseAmount : existingPromotion.minPurchaseAmount,
      image_url: imageUrl !== undefined ? imageUrl : existingPromotion.imageUrl,
      is_active: isActive !== undefined ? (isActive ? 1 : 0) : existingPromotion.isActive,
      type: type !== undefined ? type : existingPromotion.type,
      display_order: displayOrder !== undefined ? displayOrder : existingPromotion.displayOrder,
      created_at: new Date(),
      updated_at: new Date()
    }

    const updatedPromotion = await promotionRepository.updatePromotion(promotionData, promotionIdNum)

    return NextResponse.json({
      message: 'Promoción actualizada correctamente',
      promotion: updatedPromotion
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/promotions/[promotionId]:', error)
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

    const { promotionId } = await params
    const promotionIdNum = parseInt(promotionId)

    if (isNaN(promotionIdNum)) {
      return NextResponse.json({ error: 'ID de promoción inválido' }, { status: 400 })
    }

    const existingPromotion = await promotionModel.getPromotionById(promotionIdNum)
    if (!existingPromotion) {
      return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 })
    }

    // Delete all promotion variants first
    await promotionVariantModel.deletePromotionVariantsByPromotionId(promotionIdNum)

    // Then delete the promotion
    await promotionModel.deletePromotion(promotionIdNum)

    return NextResponse.json({
      message: 'Promoción eliminada correctamente'
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/promotions/[promotionId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
