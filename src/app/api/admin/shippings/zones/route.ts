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
    const { name, districtIds, isActive } = body

    if (!name) {
      return createResponse(
        { error: 'El nombre es requerido', success: false },
        400
      )
    }

    if (!districtIds || !Array.isArray(districtIds) || districtIds.length === 0) {
      return createResponse(
        { error: 'Debe seleccionar al menos un distrito', success: false },
        400
      )
    }

    try {
      // Create zone with empty districts JSON (we'll use pivot table)
      const zone = await shippingZoneModel.createShippingZone({
        name,
        districts: '[]',
        is_active: isActive ?? 1
      })

      if (zone) {
        // Set district IDs in pivot table
        await shippingZoneModel.setDistrictIdsForZone(zone.id, districtIds)
      }

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
    const { id, name, districtIds, isActive } = body

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (isActive !== undefined) updateData.is_active = isActive

      const zone = await shippingZoneModel.updateShippingZone(updateData, Number(id))

      // Update district IDs in pivot table if provided
      if (districtIds !== undefined && Array.isArray(districtIds)) {
        await shippingZoneModel.setDistrictIdsForZone(Number(id), districtIds)
      }

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
