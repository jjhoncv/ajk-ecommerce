import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'

interface DeleteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(
  _req: Request,
  { params }: DeleteParams
): Promise<Response> {
  return await apiHandler(async () => {
    const { id } = await params

    if (!id) {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
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
