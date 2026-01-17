import attributeOptionImageModel from '@/backend/attribute-option-image'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string; optionId: string }>
}

/**
 * GET: Obtener imágenes de una opción de atributo específica del producto
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params

    try {
      const images = await attributeOptionImageModel.getAttributeOptionImages(
        Number(optionId)
      )

      return createResponse(
        {
          message: 'Imágenes obtenidas',
          success: true,
          data: images || []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * POST: Crear nueva imagen para una opción de atributo del producto
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params
    const formData = await req.formData()

    const imageType = formData.get('imageType') as string
    const imageUrlThumb = formData.get('imageUrlThumb') as string
    const imageUrlNormal = formData.get('imageUrlNormal') as string
    const imageUrlZoom = formData.get('imageUrlZoom') as string
    const displayOrder = formData.get('displayOrder') as string
    const isPrimary = formData.get('isPrimary') as string
    const altText = formData.get('altText') as string

    if (!imageUrlThumb || !imageUrlNormal || !imageUrlZoom) {
      return createResponse(
        { error: 'Las URLs de imagen son requeridas', success: false },
        400
      )
    }

    try {
      const newImage = await attributeOptionImageModel.createAttributeOptionImage({
        product_attribute_option_id: Number(optionId),
        image_type: imageType || 'front',
        image_url_thumb: imageUrlThumb,
        image_url_normal: imageUrlNormal,
        image_url_zoom: imageUrlZoom,
        display_order: displayOrder ? Number(displayOrder) : 0,
        is_primary: isPrimary === 'true' ? 1 : 0,
        alt_text: altText || null
      })

      return createResponse(
        {
          message: 'Imagen creada exitosamente',
          success: true,
          data: newImage
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * PATCH: Actualizar una imagen
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const imageId = formData.get('imageId') as string
    const isPrimary = formData.get('isPrimary') as string
    const displayOrder = formData.get('displayOrder') as string

    if (!imageId) {
      return createResponse(
        { error: 'imageId es requerido', success: false },
        400
      )
    }

    try {
      const updateData: any = {}
      if (isPrimary !== null) updateData.is_primary = isPrimary === 'true' ? 1 : 0
      if (displayOrder !== null) updateData.display_order = Number(displayOrder)

      const updated = await attributeOptionImageModel.updateAttributeOptionImage(
        updateData,
        Number(imageId)
      )

      return createResponse(
        {
          message: 'Imagen actualizada exitosamente',
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
 * DELETE: Eliminar una imagen
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await req.json()

    if (!id) {
      return createResponse(
        { error: 'id es requerido', success: false },
        400
      )
    }

    try {
      await attributeOptionImageModel.deleteAttributeOptionImage(Number(id))

      return createResponse(
        {
          message: 'Imagen eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
