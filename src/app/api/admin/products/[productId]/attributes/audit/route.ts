import { productAttributeOptionModel } from '@/module/products/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string }>
}

/**
 * GET: Auditoría de atributos del producto
 * Muestra estadísticas de uso y opciones sin usar
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params

    try {
      const [usageStats, unusedOptions] = await Promise.all([
        productAttributeOptionModel.getUsageStats(Number(productId)),
        productAttributeOptionModel.getUnusedOptions(Number(productId))
      ])

      // Agrupar por atributo
      const attributeGroups = new Map<number, any>()

      usageStats?.forEach((stat: any) => {
        if (!attributeGroups.has(stat.attribute_id)) {
          attributeGroups.set(stat.attribute_id, {
            attributeId: stat.attribute_id,
            attributeName: stat.attribute_name,
            displayType: stat.display_type,
            options: [],
            totalOptions: 0,
            usedOptions: 0,
            unusedOptions: 0
          })
        }

        const group = attributeGroups.get(stat.attribute_id)
        group.options.push({
          id: stat.id,
          optionValue: stat.option_value,
          variantsUsing: stat.variants_using,
          isUsed: stat.variants_using > 0
        })
        group.totalOptions++
        if (stat.variants_using > 0) {
          group.usedOptions++
        } else {
          group.unusedOptions++
        }
      })

      const summary = {
        totalAttributes: attributeGroups.size,
        totalOptions: usageStats?.length || 0,
        unusedOptions: unusedOptions?.length || 0,
        attributeGroups: Array.from(attributeGroups.values())
      }

      return createResponse(
        {
          success: true,
          data: summary
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

/**
 * DELETE: Limpiar opciones no usadas
 * Elimina todas las opciones que no están siendo usadas por ninguna variante
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params

    try {
      const deletedCount = await productAttributeOptionModel.cleanUnusedOptions(
        Number(productId)
      )

      return createResponse(
        {
          message: `Se eliminaron ${deletedCount} opciones no usadas`,
          success: true,
          data: { deletedCount }
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
