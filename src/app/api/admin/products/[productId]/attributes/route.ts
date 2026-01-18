import { productAttributeOptionModel } from '@/module/products/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string }>
}

/**
 * GET: Obtener atributos y opciones del producto con estadísticas
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params

    try {
      const [attributes, usageStats] = await Promise.all([
        productAttributeOptionModel.getProductAttributesWithOptions(Number(productId)),
        productAttributeOptionModel.getUsageStats(Number(productId))
      ])

      return createResponse(
        {
          success: true,
          data: {
            attributes: attributes || [],
            usageStats: usageStats || []
          }
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * POST: Crear nueva opción para un atributo del producto
 * Body: { attributeId: number, value: string }
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params
    const { attributeId, value } = await req.json()

    if (!attributeId || !value) {
      return createResponse(
        { error: 'attributeId y value son requeridos', success: false },
        400
      )
    }

    try {
      const newOption = await productAttributeOptionModel.createProductAttributeOption({
        product_id: Number(productId),
        attribute_id: Number(attributeId),
        value: value.trim()
      })

      return createResponse(
        {
          message: 'Opción creada exitosamente',
          success: true,
          data: newOption
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * PATCH: Actualizar valor de una opción
 * Body: { optionId: number, value: string }
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId, value } = await req.json()

    if (!optionId || !value) {
      return createResponse(
        { error: 'optionId y value son requeridos', success: false },
        400
      )
    }

    try {
      const updated = await productAttributeOptionModel.updateProductAttributeOption(
        Number(optionId),
        { value: value.trim() }
      )

      return createResponse(
        {
          message: 'Opción actualizada exitosamente',
          success: true,
          data: updated
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * DELETE: Eliminar una opción específica del producto
 * Body: { optionId: number }
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await req.json()

    if (!optionId) {
      return createResponse(
        { error: 'optionId es requerido', success: false },
        400
      )
    }

    try {
      await productAttributeOptionModel.deleteProductAttributeOption(Number(optionId))

      return createResponse(
        {
          message: 'Opción eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
