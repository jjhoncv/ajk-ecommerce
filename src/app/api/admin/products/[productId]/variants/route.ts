import productVariantModel from '@/backend/product-variant'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params

    try {
      const variants = await productVariantModel.getProductVariantsByProductId(
        Number(productId)
      )
      return createResponse(
        {
          message: 'Variantes obtenidas',
          success: true,
          data: variants || []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

const processFormData = async (formData: FormData) => {
  const sku = formData.get('sku') as string
  const priceStr = formData.get('price') as string
  const stockStr = formData.get('stock') as string
  const id = formData.get('id') as string

  const price = priceStr !== '' && priceStr != null ? parseFloat(priceStr) : 0
  const stock = stockStr !== '' && stockStr != null ? parseInt(stockStr, 10) : 0

  return {
    id,
    sku,
    price,
    stock
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params
    const formData = await req.formData()
    const { sku, price, stock } = await processFormData(formData)

    if (sku === '') {
      return createResponse(
        { error: 'El SKU es requerido', success: false },
        400
      )
    }

    try {
      await productVariantModel.createProductVariant({
        product_id: Number(productId),
        sku,
        price,
        stock
      })

      return createResponse(
        {
          message: 'Variante creada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { id, sku, price, stock } = await processFormData(formData)

    if (sku === '' || id === '') {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      await productVariantModel.updateProductVariant(
        {
          sku,
          price,
          stock
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Variante actualizada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'ID de variante es requerido', success: false },
        400
      )
    }

    try {
      await productVariantModel.deleteProductVariant(id)
      return createResponse(
        {
          message: 'Variante eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
