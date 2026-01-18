import { attributeOptionImageModel } from '@/module/attributes/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string, optionId: string }>
}

/**
 * POST: Ejecutar acciones sobre las imágenes de opciones de atributo
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params
    const body = await req.json()
    const { action, data } = body

    if (!action || !data) {
      return createResponse(
        { error: 'action y data son requeridos', success: false },
        400
      )
    }

    try {
      switch (action) {
        case 'setPrimary': {
          const { imageId } = data

          if (!imageId) {
            return createResponse(
              { error: 'imageId es requerido', success: false },
              400
            )
          }

          // Obtener todas las imágenes de esta opción
          const allImages = await attributeOptionImageModel.getAttributeOptionImages(
            Number(optionId)
          )

          if (!allImages) {
            return createResponse(
              { error: 'No se encontraron imágenes', success: false },
              404
            )
          }

          // Actualizar todas las imágenes: quitar is_primary
          for (const img of allImages) {
            await attributeOptionImageModel.updateAttributeOptionImage(
              { is_primary: 0 },
              img.id
            )
          }

          // Marcar la imagen seleccionada como principal
          await attributeOptionImageModel.updateAttributeOptionImage(
            { is_primary: 1 },
            Number(imageId)
          )

          return createResponse(
            {
              message: 'Imagen principal actualizada',
              success: true
            },
            200
          )
        }

        default:
          return createResponse(
            { error: `Acción no reconocida: ${action}`, success: false },
            400
          )
      }
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
