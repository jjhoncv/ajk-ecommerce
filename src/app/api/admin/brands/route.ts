import oBrand from '@/module/brands/core/Brand.model'
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

// Función helper para procesar la request (JSON o FormData)
const processRequestData = async (req: NextRequest) => {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const json = await req.json()
    return {
      id: json.id,
      name: json.name,
      image_url: json.image_url || null
    }
  } else {
    const formData = await req.formData()
    return {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      image_url: formData.get('image_url') as string | null
    }
  }
}

export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const { name, image_url } = await processRequestData(req)

    if (name === '' || name == null) {
      return createResponse(
        { error: 'Nombre es requerido', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const brand = await oBrand.createBrand({
        name,
        image_url: image_url || null,
        created_at: new Date() as any,
        updated_at: new Date() as any,
        created_by: userId,
        updated_by: userId
      })

      return createResponse(
        {
          message: 'Marca creada',
          success: true,
          brand
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest) {
  return await apiHandler(async () => {
    const { id, name, image_url } = await processRequestData(req)

    if (name === '' || name == null || id === '' || id == null) {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const brand = await oBrand.updateBrand(
        {
          name,
          image_url: image_url || null,
          created_at: new Date() as any,
          updated_at: new Date() as any,
          created_by: undefined as any,
          updated_by: userId
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Marca actualizada',
          success: true,
          brand
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(req: NextRequest) {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      await oBrand.deleteBrand(Number(id))
      return createResponse(
        {
          message: 'Marca eliminada',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
