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

export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    try {
      const images = await attributeOptionImageModel.getAttributeOptionImages(
        Number(optionId),
        productId ? Number(productId) : undefined
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

const processFormData = async (formData: FormData) => {
  const id = formData.get('id') as string
  const imageType = formData.get('imageType') as string
  const imageUrlThumb = formData.get('imageUrlThumb') as string
  const imageUrlNormal = formData.get('imageUrlNormal') as string
  const imageUrlZoom = formData.get('imageUrlZoom') as string
  const altText = formData.get('altText') as string
  const displayOrder = formData.get('displayOrder') as string
  const isPrimary = formData.get('isPrimary') as string
  const productId = formData.get('productId') as string

  return {
    id,
    imageType,
    imageUrlThumb,
    imageUrlNormal,
    imageUrlZoom,
    altText: altText || null,
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
    isPrimary: isPrimary === 'true' || isPrimary === '1',
    productId: productId ? parseInt(productId, 10) : null
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { optionId } = await context.params
    const formData = await req.formData()
    const {
      imageType,
      imageUrlThumb,
      imageUrlNormal,
      imageUrlZoom,
      altText,
      displayOrder,
      isPrimary,
      productId
    } = await processFormData(formData)

    if (!imageUrlThumb || !imageUrlNormal || !imageUrlZoom) {
      return createResponse(
        { error: 'Las URLs de imagen son requeridas', success: false },
        400
      )
    }

    try {
      const image = await attributeOptionImageModel.createAttributeOptionImage({
        attribute_option_id: Number(optionId),
        product_id: productId,
        image_type: imageType as any,
        image_url_thumb: imageUrlThumb,
        image_url_normal: imageUrlNormal,
        image_url_zoom: imageUrlZoom,
        alt_text: altText,
        display_order: displayOrder,
        is_primary: isPrimary ? 1 : 0
      })

      return createResponse(
        {
          message: 'Imagen creada exitosamente',
          success: true,
          data: image
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
    const {
      id,
      imageType,
      imageUrlThumb,
      imageUrlNormal,
      imageUrlZoom,
      altText,
      displayOrder,
      isPrimary
    } = await processFormData(formData)

    if (!id) {
      return createResponse(
        { error: 'ID de imagen es requerido', success: false },
        400
      )
    }

    try {
      // Construir objeto de actualización solo con campos presentes
      const updateData: any = {}

      if (imageType) updateData.image_type = imageType
      if (imageUrlThumb) updateData.image_url_thumb = imageUrlThumb
      if (imageUrlNormal) updateData.image_url_normal = imageUrlNormal
      if (imageUrlZoom) updateData.image_url_zoom = imageUrlZoom
      if (altText !== undefined) updateData.alt_text = altText
      if (displayOrder !== undefined) updateData.display_order = displayOrder
      if (isPrimary !== undefined) updateData.is_primary = isPrimary ? 1 : 0

      const updated = await attributeOptionImageModel.updateAttributeOptionImage(
        updateData,
        Number(id)
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

export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'ID de imagen es requerido', success: false },
        400
      )
    }

    try {
      await attributeOptionImageModel.deleteAttributeOptionImage(id)
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
