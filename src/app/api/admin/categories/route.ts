import oCategory from '@/module/categories/core/Category.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

// Helper para obtener el ID del usuario actual de la sesión admin
const getCurrentUserId = async (): Promise<number | null> => {
  const session = await getServerSession(adminAuthOptions)
  if (session?.user?.id) {
    return Number(session.user.id)
  }
  return null
}

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const categories = await oCategory.getCategories()
      return createResponse(
        {
          message: 'Categorías obtenidas',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

// Función helper para procesar el formData
const processFormData = async (formData: FormData) => {
  const stringFileURL = formData.get('image_url') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const parentId = formData.get('parent_id') as string
  const displayOrder = (formData.get('display_order') as string) ?? '1'
  const showNav = formData.get('show_nav') === '1'
  const id = formData.get('id') as string

  const itemFile =
    stringFileURL !== '' && stringFileURL != null
      ? { image_url: stringFileURL }
      : {}

  return {
    id,
    name,
    description: description ?? '',
    parentId: parentId !== '' && parentId != null ? Number(parentId) : null,
    displayOrder: Number(displayOrder),
    showNav: showNav ? 1 : 0,
    itemFile
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { name, description, parentId, displayOrder, showNav, itemFile } =
      await processFormData(formData)

    if (name === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await oCategory.createCategory({
        name,
        description,
        parent_id: parentId,
        display_order: displayOrder,
        show_nav: showNav,
        created_by: userId,
        updated_by: userId,
        ...itemFile
      })

      return createResponse(
        {
          message: 'Categoría creada',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { id, name, description, parentId, displayOrder, showNav, itemFile } =
      await processFormData(formData)

    if (name === '' || id === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await oCategory.updateCategory(
        {
          name,
          description,
          parent_id: parentId,
          display_order: displayOrder,
          show_nav: showNav,
          updated_by: userId,
          ...itemFile
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Categoría actualizada',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PUT(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const {
        orders
      }: { orders: Array<{ id: number, display_order: number }> } =
        await req.json()

      if (orders == null || !Array.isArray(orders)) {
        return createResponse(
          { error: 'Invalid orders data', success: false },
          400
        )
      }

      // Actualizar el orden de cada categoría usando el método del modelo
      const updatePromises = orders.map(async (order) => {
        await oCategory.updateCategoryOrder(order.id, order.display_order)
      })

      await Promise.all(updatePromises)

      return createResponse(
        {
          message: 'Orden actualizado correctamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      await oCategory.deleteCategory(id)
      return createResponse(
        {
          message: 'Categoría eliminada',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
