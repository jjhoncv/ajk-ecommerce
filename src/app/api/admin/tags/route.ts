import oTag from '@/module/tags/core/Tag.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

// Helper para obtener el ID del usuario actual
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

// Funcion helper para procesar el formData
const processFormData = async (formData: FormData) => {
  const name = formData.get('name') as string
  const slugInput = formData.get('slug') as string
  const description = formData.get('description') as string
  const color = (formData.get('color') as string) ?? '#6B7280'
  const displayOrder = (formData.get('display_order') as string) ?? '0'
  const isActive = formData.get('is_active') as string
  const id = formData.get('id') as string

  const slug =
    slugInput && slugInput.trim() !== ''
      ? generateSlug(slugInput)
      : generateSlug(name)

  return {
    id,
    name,
    slug,
    description: description ?? '',
    color: color || '#6B7280',
    displayOrder: Number(displayOrder),
    isActive: isActive === 'true' || isActive === '1' ? 1 : 0
  }
}

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const items = await oTag.getTags()
      return createResponse(
        {
          data: items,
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

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { name, slug, description, color, displayOrder, isActive } =
      await processFormData(formData)

    if (name === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await oTag.createTag({
        name,
        slug,
        description,
        color,
        display_order: displayOrder,
        is_active: isActive,
        created_by: userId,
        updated_by: userId
      })

      return createResponse(
        {
          message: 'Tag creado',
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
    const { id, name, slug, description, color, displayOrder, isActive } =
      await processFormData(formData)

    if (name === '' || id === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await oTag.updateTag(
        {
          name,
          slug,
          description,
          color,
          display_order: displayOrder,
          is_active: isActive,
          updated_by: userId
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Tag actualizado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
