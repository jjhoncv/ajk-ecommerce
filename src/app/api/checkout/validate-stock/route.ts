import productVariantModel from '@/backend/product-variant'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items requeridos' }, { status: 400 })
    }

    const validationErrors = []

    for (const item of items) {
      const variant = await productVariantModel.getProductVariantById(item.id)

      if (!variant) {
        validationErrors.push({
          variantId: item.id,
          message: 'Producto no encontrado',
          availableStock: 0
        })
        continue
      }

      if (variant.stock < item.quantity) {
        validationErrors.push({
          variantId: item.id,
          message: `Stock insuficiente. Disponible: ${variant.stock}`,
          availableStock: variant.stock,
          requestedQuantity: item.quantity
        })
      }
    }

    return NextResponse.json({
      isValid: validationErrors.length === 0,
      errors: validationErrors
    })
  } catch (error) {
    console.error('Error validating stock:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
