import attributeOptionImageModel from '@/backend/attribute-option-image'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ attributeId: string; optionId: string }>
}

/**
 * POST /api/admin/attributes/[attributeId]/options/[optionId]/images/actions
 * Operaciones especiales sobre imágenes de opciones de atributo:
 * - reorder: Reordenar múltiples imágenes
 * - setPrimary: Marcar imagen como principal
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params
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
              await attributeOptionImageModel.updateAttributeOptionImage(
                { display_order: item.displayOrder },
                item.id
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
          // data: { imageId: number, productId?: number }
          if (!data.imageId) {
            return createResponse(
              { error: 'imageId es requerido', success: false },
              400
            )
          }

          // Primero, desmarcar todas las imágenes de esta opción (y producto si aplica)
          const allImages = await attributeOptionImageModel.getAttributeOptionImages(
            Number(optionId),
            data.productId ? Number(data.productId) : undefined
          )

          if (allImages) {
            await Promise.all(
              allImages.map(async (img) => {
                await attributeOptionImageModel.updateAttributeOptionImage(
                  { is_primary: 0 },
                  img.id
                )
              })
            )
          }

          // Luego, marcar la imagen seleccionada como principal
          await attributeOptionImageModel.updateAttributeOptionImage(
            { is_primary: 1 },
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
          // Eliminar todas las imágenes de la opción
          const allImages = await attributeOptionImageModel.getAttributeOptionImages(
            Number(optionId)
          )

          if (allImages) {
            await Promise.all(
              allImages.map(async (img) => {
                await attributeOptionImageModel.deleteAttributeOptionImage(img.id)
              })
            )
          }

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
