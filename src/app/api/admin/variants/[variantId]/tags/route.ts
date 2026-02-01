import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ variantId: string }>
}

/**
 * GET /api/admin/variants/[variantId]/tags
 * Get all tags for a variant
 */
export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { variantId } = await context.params
    const id = Number(variantId)

    if (isNaN(id)) {
      return createResponse(
        { error: 'Invalid variant ID', success: false },
        400
      )
    }

    try {
      const tags = await oTag.getTagsByVariantId(id)
      return createResponse(
        {
          data: tags ?? [],
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
 * PUT /api/admin/variants/[variantId]/tags
 * Set tags for a variant (replaces all existing tags)
 * Body: { tagIds: number[] }
 */
export async function PUT(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { variantId } = await context.params
    const id = Number(variantId)

    if (isNaN(id)) {
      return createResponse(
        { error: 'Invalid variant ID', success: false },
        400
      )
    }

    try {
      const body = await req.json()
      const tagIds: number[] = body.tagIds ?? []

      await oTag.setTagsForVariant(id, tagIds)

      return createResponse(
        {
          message: 'Tags actualizados',
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
 * POST /api/admin/variants/[variantId]/tags
 * Add a tag to a variant
 * Body: { tagId: number }
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { variantId } = await context.params
    const id = Number(variantId)

    if (isNaN(id)) {
      return createResponse(
        { error: 'Invalid variant ID', success: false },
        400
      )
    }

    try {
      const body = await req.json()
      const tagId = Number(body.tagId)

      if (isNaN(tagId)) {
        return createResponse(
          { error: 'Invalid tag ID', success: false },
          400
        )
      }

      await oTag.addTagToVariant(id, tagId)

      return createResponse(
        {
          message: 'Tag agregado',
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
 * DELETE /api/admin/variants/[variantId]/tags
 * Remove a tag from a variant
 * Body: { tagId: number }
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { variantId } = await context.params
    const id = Number(variantId)

    if (isNaN(id)) {
      return createResponse(
        { error: 'Invalid variant ID', success: false },
        400
      )
    }

    try {
      const body = await req.json()
      const tagId = Number(body.tagId)

      if (isNaN(tagId)) {
        return createResponse(
          { error: 'Invalid tag ID', success: false },
          400
        )
      }

      await oTag.removeTagFromVariant(id, tagId)

      return createResponse(
        {
          message: 'Tag eliminado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
