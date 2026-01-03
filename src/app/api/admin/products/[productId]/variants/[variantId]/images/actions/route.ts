import variantImageModel from '@/backend/variant-image'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string; variantId: string }>
}

/**
 * POST /api/admin/products/[productId]/variants/[variantId]/images/actions
 * Operaciones especiales sobre imágenes:
 * - reorder: Reordenar múltiples imágenes
 * - setPrimary: Marcar imagen como principal
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { variantId } = await context.params
    const body = await req.json()
    const { action, data } = body

    try {
      switch (action) {
        case 'reorder': {
          // data: Array<{ id: number, displayOrder: number }>
          if (!Array.isArray(data)) {
            return createResponse(
              { error: 'Data debe ser un array', success: false },
              400
            )
          }

          // Actualizar el orden de cada imagen
          await Promise.all(
            data.map(async (item: { id: number; displayOrder: number }) => {
              await variantImageModel.updateImageOrder(
                item.id,
                item.displayOrder
              )
            })
          )

          return createResponse(
            {
              message: 'Imágenes reordenadas exitosamente',
              success: true
            },
            200
          )
        }

        case 'setPrimary': {
          // data: { imageId: number }
          if (!data.imageId) {
            return createResponse(
              { error: 'imageId es requerido', success: false },
              400
            )
          }

          await variantImageModel.setPrimaryImage(
            Number(variantId),
            data.imageId
          )

          return createResponse(
            {
              message: 'Imagen marcada como principal',
              success: true
            },
            200
          )
        }

        case 'deleteAll': {
          // Eliminar todas las imágenes de la variante
          await variantImageModel.deleteVariantImagesByVariantId(
            Number(variantId)
          )

          return createResponse(
            {
              message: 'Todas las imágenes eliminadas',
              success: true
            },
            200
          )
        }

        default:
          return createResponse(
            { error: 'Acción no válida', success: false },
            400
          )
      }
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
