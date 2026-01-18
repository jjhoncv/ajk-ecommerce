import { shippingZoneModel } from '@/module/shippings/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const zones = await shippingZoneModel.getShippingZonesWithMethods()
      return createResponse(
        {
          message: 'Zonas de envío obtenidas',
          success: true,
          data: zones
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
    const body = await req.json()
    const { name, districts, isActive } = body

    if (!name) {
      return createResponse(
        { error: 'El nombre es requerido', success: false },
        400
      )
    }

    try {
      const zone = await shippingZoneModel.createShippingZone({
        name,
        districts: districts ? JSON.stringify(districts) : '[]',
        is_active: isActive ?? 1
      })

      return createResponse(
        {
          message: 'Zona de envío creada exitosamente',
          success: true,
          data: zone
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
    const body = await req.json()
    const { id, name, districts, isActive } = body

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (districts !== undefined) updateData.districts = JSON.stringify(districts)
      if (isActive !== undefined) updateData.is_active = isActive

      const zone = await shippingZoneModel.updateShippingZone(updateData, Number(id))

      return createResponse(
        {
          message: 'Zona de envío actualizada exitosamente',
          success: true,
          data: zone
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
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      await shippingZoneModel.deleteShippingZone(id)
      return createResponse(
        {
          message: 'Zona de envío eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
