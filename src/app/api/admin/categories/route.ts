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

// Helper para generar slug desde el nombre
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Función helper para procesar el formData
const processFormData = async (formData: FormData) => {
  // Basic fields
  const stringFileURL = formData.get('image_url') as string
  const name = formData.get('name') as string
  const slugInput = formData.get('slug') as string
  const description = formData.get('description') as string
  const parentId = formData.get('parent_id') as string
  const displayOrder = (formData.get('display_order') as string) ?? '1'
  const showNav = formData.get('show_nav') === '1'
  const id = formData.get('id') as string

  // Generate slug from name if not provided
  const slug = slugInput && slugInput.trim() !== ''
    ? generateSlug(slugInput)
    : generateSlug(name)

  // Banner fields
  const bannerImage = formData.get('banner_image') as string
  const bannerImageMobile = formData.get('banner_image_mobile') as string
  const bannerTitle = formData.get('banner_title') as string
  const bannerSubtitle = formData.get('banner_subtitle') as string
  const bannerDescription = formData.get('banner_description') as string
  const bannerCtaText = formData.get('banner_cta_text') as string
  const bannerCtaLink = formData.get('banner_cta_link') as string

  // SEO fields
  const metaTitle = formData.get('meta_title') as string
  const metaDescription = formData.get('meta_description') as string

  // Build file objects for images
  const itemFile =
    stringFileURL !== '' && stringFileURL != null
      ? { image_url: stringFileURL }
      : {}

  const bannerImageFile =
    bannerImage !== '' && bannerImage != null
      ? { banner_image: bannerImage }
      : {}

  const bannerImageMobileFile =
    bannerImageMobile !== '' && bannerImageMobile != null
      ? { banner_image_mobile: bannerImageMobile }
      : {}

  return {
    id,
    name,
    slug,
    description: description ?? '',
    parentId: parentId !== '' && parentId != null ? Number(parentId) : null,
    displayOrder: Number(displayOrder),
    showNav: showNav ? 1 : 0,
    // Banner fields
    bannerTitle: bannerTitle ?? null,
    bannerSubtitle: bannerSubtitle ?? null,
    bannerDescription: bannerDescription ?? null,
    bannerCtaText: bannerCtaText ?? null,
    bannerCtaLink: bannerCtaLink ?? null,
    // SEO fields
    metaTitle: metaTitle ?? null,
    metaDescription: metaDescription ?? null,
    // Image files
    itemFile,
    bannerImageFile,
    bannerImageMobileFile
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const {
      name,
      slug,
      description,
      parentId,
      displayOrder,
      showNav,
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      bannerCtaText,
      bannerCtaLink,
      metaTitle,
      metaDescription,
      itemFile,
      bannerImageFile,
      bannerImageMobileFile
    } = await processFormData(formData)

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
        slug,
        description,
        parent_id: parentId,
        display_order: displayOrder,
        show_nav: showNav,
        // Banner fields
        banner_title: bannerTitle,
        banner_subtitle: bannerSubtitle,
        banner_description: bannerDescription,
        banner_cta_text: bannerCtaText,
        banner_cta_link: bannerCtaLink,
        // SEO fields
        meta_title: metaTitle,
        meta_description: metaDescription,
        // Audit fields
        created_by: userId,
        updated_by: userId,
        // Image files
        ...itemFile,
        ...bannerImageFile,
        ...bannerImageMobileFile
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
    const {
      id,
      name,
      slug,
      description,
      parentId,
      displayOrder,
      showNav,
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      bannerCtaText,
      bannerCtaLink,
      metaTitle,
      metaDescription,
      itemFile,
      bannerImageFile,
      bannerImageMobileFile
    } = await processFormData(formData)

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
          slug,
          description,
          parent_id: parentId,
          display_order: displayOrder,
          show_nav: showNav,
          // Banner fields
          banner_title: bannerTitle,
          banner_subtitle: bannerSubtitle,
          banner_description: bannerDescription,
          banner_cta_text: bannerCtaText,
          banner_cta_link: bannerCtaLink,
          // SEO fields
          meta_title: metaTitle,
          meta_description: metaDescription,
          // Audit fields
          updated_by: userId,
          // Image files
          ...itemFile,
          ...bannerImageFile,
          ...bannerImageMobileFile
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
