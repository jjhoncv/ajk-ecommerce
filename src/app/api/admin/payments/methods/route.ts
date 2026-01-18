import { paymentMethodModel } from '@/module/payments/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const methods = await paymentMethodModel.getAllPaymentMethods()
      return createResponse(
        {
          message: 'Métodos de pago obtenidos',
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
    const {
      name,
      code,
      description,
      iconUrl,
      processingFeeType,
      processingFeeValue,
      minAmount,
      maxAmount,
      isActive,
      requiresVerification,
      displayOrder,
      settings
    } = body

    if (!name || !code) {
      return createResponse(
        { error: 'Nombre y código son requeridos', success: false },
        400
      )
    }

    try {
      const method = await paymentMethodModel.createPaymentMethod({
        name,
        code,
        description: description ?? null,
        icon_url: iconUrl ?? null,
        processing_fee_type: processingFeeType ?? 'fixed',
        processing_fee_value: processingFeeValue ?? 0,
        min_amount: minAmount ?? 0,
        max_amount: maxAmount ?? null,
        is_active: isActive ?? 1,
        requires_verification: requiresVerification ?? 0,
        display_order: displayOrder ?? 0,
        settings: settings ? JSON.stringify(settings) : null
      })

      return createResponse(
        {
          message: 'Método de pago creado exitosamente',
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
    const {
      id,
      name,
      code,
      description,
      iconUrl,
      processingFeeType,
      processingFeeValue,
      minAmount,
      maxAmount,
      isActive,
      requiresVerification,
      displayOrder,
      settings
    } = body

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (code !== undefined) updateData.code = code
      if (description !== undefined) updateData.description = description
      if (iconUrl !== undefined) updateData.icon_url = iconUrl
      if (processingFeeType !== undefined) updateData.processing_fee_type = processingFeeType
      if (processingFeeValue !== undefined) updateData.processing_fee_value = processingFeeValue
      if (minAmount !== undefined) updateData.min_amount = minAmount
      if (maxAmount !== undefined) updateData.max_amount = maxAmount
      if (isActive !== undefined) updateData.is_active = isActive
      if (requiresVerification !== undefined) updateData.requires_verification = requiresVerification
      if (displayOrder !== undefined) updateData.display_order = displayOrder
      if (settings !== undefined) updateData.settings = JSON.stringify(settings)

      const method = await paymentMethodModel.updatePaymentMethod(updateData, Number(id))

      return createResponse(
        {
          message: 'Método de pago actualizado exitosamente',
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
      await paymentMethodModel.deletePaymentMethod(id)
      return createResponse(
        {
          message: 'Método de pago eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
