import productVariantModel from '@/backend/product-variant'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items del carrito requeridos' },
        { status: 400 }
      )
    }

    const syncedItems = []
    const removedItems = []

    for (const item of items) {
      const variant = await productVariantModel.getProductVariantById(item.id)

      if (!variant) {
        removedItems.push({
          ...item,
          reason: 'Producto no disponible'
        })
        continue
      }

      if (variant.stock === 0) {
        removedItems.push({
          ...item,
          reason: 'Sin stock'
        })
        continue
      }

      // Ajustar cantidad si excede el stock disponible
      const adjustedQuantity = Math.min(item.quantity, variant.stock)

      syncedItems.push({
        ...item,
        quantity: adjustedQuantity,
        stock: variant.stock,
        priceUpdated: variant.price !== item.price,
        currentPrice: variant.price
      })
    }

    return NextResponse.json({
      syncedItems,
      removedItems,
      hasChanges:
        removedItems.length > 0 ||
        syncedItems.some(
          (item) =>
            item.quantity !==
              items.find((original) => original.id === item.id)?.quantity ||
            item.priceUpdated
        )
    })
  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
