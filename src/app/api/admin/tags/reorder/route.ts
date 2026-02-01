import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface ReorderItem {
  id: number
  display_order: number
}

export async function PATCH(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { items }: { items: ReorderItem[] } = await req.json()

      if (!items || !Array.isArray(items)) {
        return createResponse(
          { error: 'Invalid items array', success: false },
          400
        )
      }

      // Update display_order for each item
      await Promise.all(
        items.map(item => oTag.updateDisplayOrder(item.id, item.display_order))
      )

      return createResponse(
        {
          message: 'Orden actualizado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
