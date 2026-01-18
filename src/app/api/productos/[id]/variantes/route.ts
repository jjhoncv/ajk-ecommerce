import { type NextRequest, NextResponse } from 'next/server'
import { productVariantModel } from '@/module/products/core'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    // Usar el modelo existente para obtener todas las variantes del producto con atributos
    const variants =
      await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
        productId
      )

    if (!variants) {
      return NextResponse.json(
        { error: 'No se encontraron variantes para este producto' },
        { status: 404 }
      )
    }

    return NextResponse.json(variants)
  } catch (error) {
    console.error('Error fetching product variants:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
