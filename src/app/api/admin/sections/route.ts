import sectionModel from '@/backend/section'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const sections = await sectionModel.getSections()

      return createResponse(
        {
          data: sections ?? [],
          message: 'Secciones obtenidas',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
