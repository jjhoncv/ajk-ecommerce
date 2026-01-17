import shippingMethodModel from '@/backend/shipping-method'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const methods = await shippingMethodModel.getShippingMethodsWithZones()
      return createResponse(
        {
          message: 'Métodos de envío obtenidos',
          success: true,
          data: methods
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
    const { name, description, baseCost, estimatedDaysMin, estimatedDaysMax, isActive } = body

    if (!name) {
      return createResponse(
        { error: 'El nombre es requerido', success: false },
        400
      )
    }

    try {
      const method = await shippingMethodModel.createShippingMethod({
        name,
        description: description ?? null,
        base_cost: baseCost ?? 0,
        estimated_days_min: estimatedDaysMin ?? 1,
        estimated_days_max: estimatedDaysMax ?? 7,
        is_active: isActive ?? 1
      })

      return createResponse(
        {
          message: 'Método de envío creado exitosamente',
          success: true,
          data: method
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
    const { id, name, description, baseCost, estimatedDaysMin, estimatedDaysMax, isActive } = body

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      const method = await shippingMethodModel.updateShippingMethod(
        {
          name,
          description,
          base_cost: baseCost,
          estimated_days_min: estimatedDaysMin,
          estimated_days_max: estimatedDaysMax,
          is_active: isActive
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Método de envío actualizado exitosamente',
          success: true,
          data: method
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
      await shippingMethodModel.deleteShippingMethod(id)
      return createResponse(
        {
          message: 'Método de envío eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
