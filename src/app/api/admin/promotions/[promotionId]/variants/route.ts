// app/api/admin/promotions/[promotionId]/variants/route.ts
import promotionModel from '@/backend/promotion/Promotion.model'
import promotionVariantModel from '@/backend/promotion-variant/PromotionVariant.model'
import productVariantModel from '@/backend/product-variant/ProductVariant.model'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ promotionId: string }>
}

interface VariantWithProduct {
  variantId: number
  promotionPrice: number | null
  stockLimit: number
  createdAt: Date
  variant: {
    id: number
    sku: string
    price: number
    stock: number
    productId: number
    productName: string
  } | null
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

    // Get promotion variants with product info using a JOIN query
    const variantsWithInfo = await executeQuery<any[]>({
      query: `
        SELECT
          pv.promotion_id,
          pv.variant_id,
          pv.promotion_price,
          pv.stock_limit,
          pv.created_at,
          v.id as variant_id,
          v.sku,
          v.price as variant_price,
          v.stock as variant_stock,
          v.product_id,
          p.name as product_name
        FROM promotion_variants pv
        JOIN product_variants v ON pv.variant_id = v.id
        JOIN products p ON v.product_id = p.id
        WHERE pv.promotion_id = ?
        ORDER BY p.name, v.sku
      `,
      values: [promotionIdNum]
    })

    const formattedVariants: VariantWithProduct[] = variantsWithInfo.map((row) => ({
      variantId: row.variant_id,
      promotionPrice: row.promotion_price ? Number(row.promotion_price) : null,
      stockLimit: row.stock_limit,
      createdAt: row.created_at,
      variant: {
        id: row.variant_id,
        sku: row.sku,
        price: Number(row.variant_price),
        stock: row.variant_stock,
        productId: row.product_id,
        productName: row.product_name
      }
    }))

    return NextResponse.json({ variants: formattedVariants })
  } catch (error) {
    console.error('Error en GET /api/admin/promotions/[promotionId]/variants:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json()
    const { variantId, promotionPrice, stockLimit } = body

    if (!variantId) {
      return NextResponse.json(
        { error: 'El ID de variante es requerido' },
        { status: 400 }
      )
    }

    // Verify variant exists
    const variant = await productVariantModel.getVariantById(variantId)
    if (!variant) {
      return NextResponse.json({ error: 'Variante no encontrada' }, { status: 404 })
    }

    // Check if already exists
    const exists = await promotionVariantModel.hasPromotionForVariant(promotionIdNum, variantId)
    if (exists) {
      return NextResponse.json(
        { error: 'Esta variante ya está en la promoción' },
        { status: 400 }
      )
    }

    const promotionVariant = await promotionVariantModel.createPromotionVariant({
      promotion_id: promotionIdNum,
      variant_id: variantId,
      promotion_price: promotionPrice || null,
      stock_limit: stockLimit || variant.stock
    })

    return NextResponse.json({
      message: 'Variante agregada a la promoción',
      promotionVariant
    })
  } catch (error) {
    console.error('Error en POST /api/admin/promotions/[promotionId]/variants:', error)
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

    const { searchParams } = new URL(request.url)
    const variantId = searchParams.get('variantId')

    if (!variantId) {
      return NextResponse.json(
        { error: 'El ID de variante es requerido' },
        { status: 400 }
      )
    }

    const variantIdNum = parseInt(variantId)

    await promotionVariantModel.deletePromotionVariant(promotionIdNum, variantIdNum)

    return NextResponse.json({
      message: 'Variante eliminada de la promoción'
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/promotions/[promotionId]/variants:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
