import attributeOptionModel from '@/backend/attribute-option'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ attributeId: string }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { attributeId } = await context.params

    try {
      const options = await attributeOptionModel.getAttributeOptions(
        Number(attributeId)
      )
      return createResponse(
        {
          message: 'Opciones obtenidas',
          success: true,
          data: options || []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

const processFormData = async (formData: FormData) => {
  const value = formData.get('value') as string
  const additionalCostStr = formData.get('additional_cost') as string
  const id = formData.get('id') as string

  const additionalCost =
    additionalCostStr !== '' && additionalCostStr != null
      ? parseFloat(additionalCostStr)
      : 0

  return {
    id,
    value,
    additional_cost: additionalCost
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { attributeId } = await context.params
    const formData = await req.formData()
    const { value, additional_cost } = await processFormData(formData)

    if (value === '') {
      return createResponse(
        { error: 'El valor es requerido', success: false },
        400
      )
    }

    try {
      await attributeOptionModel.createAttributeOption({
        attribute_id: Number(attributeId),
        value,
        additional_cost
      })

      return createResponse(
        {
          message: 'Opción creada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { id, value, additional_cost } = await processFormData(formData)

    if (value === '' || id === '') {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      await attributeOptionModel.updateAttributeOption(
        {
          value,
          additional_cost
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Opción actualizada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'ID de opción es requerido', success: false },
        400
      )
    }

    try {
      await attributeOptionModel.deleteAttributeOption(id)
      return createResponse(
        {
          message: 'Opción eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
