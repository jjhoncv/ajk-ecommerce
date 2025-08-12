import oBanner from '@/module/banners/core/Banner.model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

// Función helper para procesar el formData
const processFormData = async (formData: FormData) => {
  const stringFileURL = formData.get('image_url') as string
  const title = formData.get('title') as string
  const buttonText = formData.get('buttonText') as string
  const displayOrder = (formData.get('displayOrder') as string) ?? 9999
  const subtitle = formData.get('subtitle') as string
  const description = formData.get('description') as string
  const link = formData.get('link') as string
  const id = formData.get('id') as string

  const itemFile = stringFileURL ? { image_url: stringFileURL } : {}

  return {
    id,
    title,
    subtitle,
    description,
    link,
    buttonText,
    itemFile,
    displayOrder
  }
}

export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const {
      title,
      link,
      description,
      subtitle,
      itemFile,
      buttonText,
      displayOrder
    } = await processFormData(formData)

    if (title === '' || link === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const banner = await oBanner.createBanner({
        title,
        button_text: buttonText,
        description,
        display_order: Number(displayOrder),
        link,
        subtitle,
        ...itemFile
      })

      return createResponse(
        {
          message: 'Banner creado',
          success: true,
          banner
        },
        200
      )
    } catch (error: any) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest) {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const {
      id,
      title,
      link,
      description,
      subtitle,
      itemFile,
      buttonText,
      displayOrder
    } = await processFormData(formData)

    if (title === '' || link === '' || id === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const banner = await oBanner.updateBanner(
        {
          title,
          button_text: buttonText,
          description,
          display_order: Number(displayOrder),
          link,
          subtitle,
          ...itemFile
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Banner actualizado',
          success: true,
          banner
        },
        200
      )
    } catch (error: any) {
      return handleError(error, 400)
    }
  })
}

export async function PUT(req: NextRequest) {
  return await apiHandler(async () => {
    try {
      const {
        orders
      }: { orders: Array<{ id: number; display_order: number }> } =
        await req.json()

      if (orders == null || !Array.isArray(orders)) {
        return createResponse(
          { error: 'Invalid orders data', success: false },
          400
        )
      }

      // Actualizar el orden de cada banner usando el método del modelo
      const updatePromises = orders.map(async (order) => {
        await oBanner.updateBannerOrder(order.id, order.display_order)
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

export async function DELETE(req: NextRequest) {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      await oBanner.deleteBanner(id)
      return createResponse(
        {
          message: 'Banner eliminado',
          success: true
        },
        200
      )
    } catch (error: any) {
      return handleError(error, 400)
    }
  })
}
