import attributeModel from '@/backend/attribute'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const attributes = await attributeModel.getAttributes()
      return createResponse(
        {
          message: 'Atributos obtenidos',
          success: true,
          data: attributes || []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

const processFormData = async (formData: FormData) => {
  const name = formData.get('name') as string
  const displayType = formData.get('display_type') as string
  const id = formData.get('id') as string

  return {
    id,
    name,
    display_type: displayType as 'radio' | 'pills' | 'select' | 'color' | 'custom'
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { name, display_type } = await processFormData(formData)

    if (name === '') {
      return createResponse(
        { error: 'El nombre del atributo es requerido', success: false },
        400
      )
    }

    try {
      await attributeModel.createAttribute({
        name,
        display_type
      })

      return createResponse(
        {
          message: 'Atributo creado exitosamente',
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
    const { id, name, display_type } = await processFormData(formData)

    if (name === '' || id === '') {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      await attributeModel.updateAttribute(
        {
          name,
          display_type
        },
        Number(id)
      )

      return createResponse(
        {
          message: 'Atributo actualizado exitosamente',
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
        { error: 'ID de atributo es requerido', success: false },
        400
      )
    }

    try {
      await attributeModel.deleteAttribute(id)
      return createResponse(
        {
          message: 'Atributo eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
