import { productModel, productVariantModel, variantAttributeOptionModel } from '@/module/products/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ productId: string }>
}

// Helper para generar slug SEO-friendly
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim()
}

// Generar slug para variante basado en nombre del producto y atributos
const generateVariantSlug = async (
  productId: number,
  variantId: number
): Promise<string> => {
  // Obtener nombre del producto
  const product = await productModel.getProductById(productId)
  if (!product) {
    return `variante-${variantId}`
  }

  // Obtener atributos de la variante
  const attributeOptions = await variantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(variantId)

  let slugParts = [product.name]

  if (attributeOptions && attributeOptions.length > 0) {
    const attributeValues = attributeOptions
      .map((opt) => opt.productAttributeOption?.value)
      .filter((value): value is string => typeof value === 'string')
    slugParts = [...slugParts, ...attributeValues]
  }

  const baseSlug = generateSlug(slugParts.join(' '))

  // Verificar si el slug ya existe y hacer único si es necesario
  const existingVariant = await productVariantModel.getProductVariantBySlug(baseSlug)
  if (existingVariant && existingVariant.id !== variantId) {
    return `${baseSlug}-${variantId}`
  }

  return baseSlug
}

export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params

    try {
      const variants = await productVariantModel.getProductVariantsByProductId(
        Number(productId)
      )
      return createResponse(
        {
          message: 'Variantes obtenidas',
          success: true,
          data: variants || []
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

const processFormData = async (formData: FormData) => {
  const sku = formData.get('sku') as string
  const priceStr = formData.get('price') as string
  const stockStr = formData.get('stock') as string
  const id = formData.get('id') as string
  const attributesStr = formData.get('attributes') as string
  const imageAttributeIdStr = formData.get('image_attribute_id') as string
  const attributeCostsStr = formData.get('attribute_costs') as string

  const price = priceStr !== '' && priceStr != null ? parseFloat(priceStr) : 0
  const stock = stockStr !== '' && stockStr != null ? parseInt(stockStr, 10) : 0

  // Parsear atributos (formato: {"1": 5, "2": 8}) - attributeId: optionId
  let attributes: Record<number, number> = {}
  if (attributesStr && attributesStr !== '') {
    try {
      attributes = JSON.parse(attributesStr)
    } catch (e) {
      // Si falla el parse, dejamos vacío
    }
  }

  // Parsear costos adicionales (formato: {"5": 100, "8": 50}) - optionId: cost
  let attributeCosts: Record<number, number> = {}
  if (attributeCostsStr && attributeCostsStr !== '') {
    try {
      attributeCosts = JSON.parse(attributeCostsStr)
    } catch (e) {
      // Si falla el parse, dejamos vacío
    }
  }

  // Parsear image_attribute_id (puede ser null o número)
  let imageAttributeId: number | null = null
  if (imageAttributeIdStr && imageAttributeIdStr !== '' && imageAttributeIdStr !== 'null') {
    imageAttributeId = parseInt(imageAttributeIdStr, 10)
  }

  return {
    id,
    sku,
    price,
    stock,
    attributes,
    attributeCosts,
    imageAttributeId
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<Response> {
  return await apiHandler(async () => {
    const { productId } = await context.params
    const formData = await req.formData()
    const { sku, price, stock, attributes, attributeCosts, imageAttributeId } = await processFormData(formData)

    if (sku === '') {
      return createResponse(
        { error: 'El SKU es requerido', success: false },
        400
      )
    }

    try {
      const variant = await productVariantModel.createProductVariant({
        product_id: Number(productId),
        sku,
        price,
        stock,
        image_attribute_id: imageAttributeId
      })

      // Asignar atributos a la variante con sus costos adicionales
      if (variant && Object.keys(attributes).length > 0) {
        await Promise.all(
          Object.entries(attributes).map(async ([attributeId, optionId]) => {
            const additionalCost = attributeCosts[Number(optionId)] || 0
            return await variantAttributeOptionModel.addAttributeOptionToVariant(
              variant.id,
              Number(optionId),
              additionalCost
            )
          })
        )
      }

      // Generar y guardar slug SEO-friendly
      if (variant) {
        const slug = await generateVariantSlug(Number(productId), variant.id)
        await productVariantModel.updateProductVariantSlug(variant.id, slug)
      }

      return createResponse(
        {
          message: 'Variante creada exitosamente',
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
    const { productId } = await context.params
    const formData = await req.formData()
    const { id, sku, price, stock, attributes, attributeCosts, imageAttributeId } = await processFormData(formData)

    if (sku === '' || id === '') {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      await productVariantModel.updateProductVariant(
        {
          sku,
          price,
          stock,
          image_attribute_id: imageAttributeId
        },
        Number(id)
      )

      // Actualizar atributos: primero eliminamos todos los existentes
      await variantAttributeOptionModel.deleteVariantAttributeOptionsByVariantId(Number(id))

      // Luego agregamos los nuevos seleccionados con sus costos adicionales
      if (Object.keys(attributes).length > 0) {
        await Promise.all(
          Object.entries(attributes).map(async ([attributeId, optionId]) => {
            const additionalCost = attributeCosts[Number(optionId)] || 0
            return await variantAttributeOptionModel.addAttributeOptionToVariant(
              Number(id),
              Number(optionId),
              additionalCost
            )
          })
        )
      }

      // Regenerar slug SEO-friendly con los nuevos atributos
      const slug = await generateVariantSlug(Number(productId), Number(id))
      await productVariantModel.updateProductVariantSlug(Number(id), slug)

      return createResponse(
        {
          message: 'Variante actualizada exitosamente',
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
        { error: 'ID de variante es requerido', success: false },
        400
      )
    }

    try {
      await productVariantModel.deleteProductVariant(id)
      return createResponse(
        {
          message: 'Variante eliminada exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
