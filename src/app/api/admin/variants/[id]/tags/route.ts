import variantTagService from '@/module/tags/service/variantTags'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/variants/[id]/tags
 * Get all tags assigned to a variant
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await params

    if (!id) {
      return createResponse(
        { error: 'Variant ID is required', success: false },
        400
      )
    }

    try {
      const tags = await variantTagService.getTagsByVariantId(Number(id))
      const tagIds = await variantTagService.getTagIdsByVariantId(Number(id))

      return createResponse(
        {
          data: { tags, tagIds },
          message: 'Tags obtenidos',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * PUT /api/admin/variants/[id]/tags
 * Assign tags to a variant (replaces existing)
 * Body: { tagIds: number[] }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const { tagIds } = body as { tagIds: number[] }

    if (!id) {
      return createResponse(
        { error: 'Variant ID is required', success: false },
        400
      )
    }

    if (!Array.isArray(tagIds)) {
      return createResponse(
        { error: 'tagIds must be an array', success: false },
        400
      )
    }

    try {
      await variantTagService.assignTagsToVariant(Number(id), tagIds)

      return createResponse(
        {
          message: 'Tags asignados correctamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * POST /api/admin/variants/[id]/tags
 * Add a single tag to a variant
 * Body: { tagId: number, displayOrder?: number }
 */
export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const { tagId, displayOrder = 0 } = body as {
      tagId: number
      displayOrder?: number
    }

    if (!id) {
      return createResponse(
        { error: 'Variant ID is required', success: false },
        400
      )
    }

    if (!tagId) {
      return createResponse(
        { error: 'Tag ID is required', success: false },
        400
      )
    }

    try {
      await variantTagService.addTagToVariant(Number(id), tagId, displayOrder)

      return createResponse(
        {
          message: 'Tag agregado correctamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * DELETE /api/admin/variants/[id]/tags
 * Remove a single tag from a variant
 * Body: { tagId: number }
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const { tagId } = body as { tagId: number }

    if (!id) {
      return createResponse(
        { error: 'Variant ID is required', success: false },
        400
      )
    }

    if (!tagId) {
      return createResponse(
        { error: 'Tag ID is required', success: false },
        400
      )
    }

    try {
      await variantTagService.removeTagFromVariant(Number(id), tagId)

      return createResponse(
        {
          message: 'Tag removido correctamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
