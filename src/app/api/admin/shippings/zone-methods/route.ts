import { shippingZoneMethodModel } from '@/module/shippings/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const zoneMethods = await shippingZoneMethodModel.getAllZoneMethodsWithDetails()
      return createResponse(
        {
          message: 'Configuraciones de envío obtenidas',
          success: true,
          data: zoneMethods
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
    const {
      shippingMethodId,
      shippingZoneId,
      cost,
      freeShippingThreshold,
      estimatedDaysMin,
      estimatedDaysMax,
      isActive
    } = body

    if (!shippingMethodId || !shippingZoneId) {
      return createResponse(
        { error: 'Método y zona son requeridos', success: false },
        400
      )
    }

    try {
      const zoneMethod = await shippingZoneMethodModel.createZoneMethod({
        shipping_method_id: shippingMethodId,
        shipping_zone_id: shippingZoneId,
        cost: cost ?? 0,
        free_shipping_threshold: freeShippingThreshold ?? 0,
        estimated_days_min: estimatedDaysMin ?? 1,
        estimated_days_max: estimatedDaysMax ?? 3,
        is_active: isActive ?? 1
      })

      return createResponse(
        {
          message: 'Configuración de envío creada exitosamente',
          success: true,
          data: zoneMethod
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
    const {
      id,
      cost,
      freeShippingThreshold,
      estimatedDaysMin,
      estimatedDaysMax,
      isActive
    } = body

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      const updateData: any = {}
      if (cost !== undefined) updateData.cost = cost
      if (freeShippingThreshold !== undefined) updateData.free_shipping_threshold = freeShippingThreshold ?? 0
      if (estimatedDaysMin !== undefined) updateData.estimated_days_min = estimatedDaysMin ?? 1
      if (estimatedDaysMax !== undefined) updateData.estimated_days_max = estimatedDaysMax ?? 3
      if (isActive !== undefined) updateData.is_active = isActive

      const zoneMethod = await shippingZoneMethodModel.updateZoneMethod(updateData, Number(id))

      return createResponse(
        {
          message: 'Configuración de envío actualizada exitosamente',
          success: true,
          data: zoneMethod
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
      await shippingZoneMethodModel.deleteZoneMethod(id)
      return createResponse(
        {
          message: 'Configuración de envío eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
