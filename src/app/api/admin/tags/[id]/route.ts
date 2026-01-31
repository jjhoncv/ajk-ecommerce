import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { id } = await context.params
      const tag = await oTag.getTagById(Number(id))

      if (tag == null) {
        return createResponse(
          { error: 'Tag no encontrado', success: false },
          404
        )
      }

      return createResponse(
        {
          message: 'Tag obtenido',
          success: true,
          tag
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { id } = await context.params

      if (!id) {
        return createResponse(
          { error: 'ID es requerido', success: false },
          400
        )
      }

      await oTag.deleteTag(Number(id))

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
