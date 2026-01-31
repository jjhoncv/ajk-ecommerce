import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

// Helper para obtener el ID del usuario actual de la sesion admin
const getCurrentUserId = async (): Promise<number | null> => {
  const session = await getServerSession(adminAuthOptions)
  if (session?.user?.id) {
    return Number(session.user.id)
  }
  return null
}

// Helper para generar slug desde el nombre
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Funcion helper para procesar la request (JSON o FormData)
const processRequestData = async (req: NextRequest) => {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const json = await req.json()
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      description: json.description || '',
      color: json.color || '#6B7280',
      is_active: json.is_active ?? true,
      display_order: json.display_order ?? 0
    }
  } else {
    const formData = await req.formData()
    const name = formData.get('name') as string
    const slugInput = formData.get('slug') as string
    const isActiveStr = formData.get('is_active') as string

    return {
      id: formData.get('id') as string,
      name,
      slug:
        slugInput && slugInput.trim() !== ''
          ? generateSlug(slugInput)
          : generateSlug(name),
      description: (formData.get('description') as string) || '',
      color: (formData.get('color') as string) || '#6B7280',
      is_active: isActiveStr === 'false' ? 0 : 1,
      display_order: Number(formData.get('display_order') || '0')
    }
  }
}

export async function GET() {
  return await apiHandler(async () => {
    try {
      const items = await oTag.getTags()
      return createResponse(
        {
          message: 'Tags obtenidos',
          success: true,
          tags: items ?? []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const { name, slug, description, color, is_active, display_order } =
      await processRequestData(req)

    if (name === '' || name == null) {
      return createResponse(
        { error: 'Nombre es requerido', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const tag = await oTag.createTag({
        name,
        slug,
        description,
        color,
        is_active,
        display_order,
        created_by: userId,
        updated_by: userId
      })

      return createResponse(
        {
          message: 'Tag creado',
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

export async function PATCH(req: NextRequest) {
  return await apiHandler(async () => {
    const { id, name, slug, description, color, is_active, display_order } =
      await processRequestData(req)

    if (name === '' || name == null || id === '' || id == null) {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const tag = await oTag.updateTag(
        {
          name,
          slug,
          description,
          color,
          is_active,
          display_order,
          created_by: undefined as any,
          updated_by: userId
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Tag actualizado',
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
