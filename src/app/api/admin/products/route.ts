import { categoryModel } from '@/module/categories/core'
import { productModel } from '@/module/products/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

// Helper para obtener el ID del usuario actual de la sesión admin
const getCurrentUserId = async (): Promise<number | null> => {
  const session = await getServerSession(adminAuthOptions)
  if (session?.user?.id) {
    return Number(session.user.id)
  }
  return null
}

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const products = await productModel.getProductsForAdmin()
      return createResponse(
        {
          message: 'Productos obtenidos',
          success: true,
          data: products
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

// Función helper para procesar el formData
const processFormData = async (formData: FormData) => {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const basePriceStr = formData.get('base_price') as string
  const brandIdStr = formData.get('brand_id') as string
  const id = formData.get('id') as string

  const basePrice = basePriceStr !== '' && basePriceStr != null
    ? parseFloat(basePriceStr)
    : null

  const brandId = brandIdStr !== '' && brandIdStr != null
    ? parseInt(brandIdStr, 10)
    : null

  // Extraer categorías (vienen como categories[])
  const categories: number[] = []
  formData.forEach((value, key) => {
    if (key === 'categories[]' && value !== '') {
      categories.push(parseInt(value as string, 10))
    }
  })

  return {
    id,
    name,
    description: description ?? '',
    basePrice,
    brandId,
    categories
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { name, description, basePrice, brandId, categories } = await processFormData(formData)

    if (name === '') {
      return createResponse(
        { error: 'El nombre del producto es requerido', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const product = await productModel.createProduct({
        name,
        description,
        base_price: basePrice,
        brand_id: brandId,
        created_by: userId,
        updated_by: userId
      })

      // Asignar categorías al producto
      if (product && categories.length > 0) {
        await Promise.all(
          categories.map(async (categoryId) => { await categoryModel.addProductToCategory(product.id, categoryId) }
          )
        )
      }

      return createResponse(
        {
          message: 'Producto creado exitosamente',
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
    const { id, name, description, basePrice, brandId, categories } = await processFormData(formData)

    if (name === '' || id === '') {
      return createResponse(
        { error: 'Faltan campos requeridos', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await productModel.updateProduct(
        {
          name,
          description,
          base_price: basePrice,
          brand_id: brandId,
          updated_by: userId
        },
        Number(id)
      )

      // Actualizar categorías: primero obtenemos las categorías actuales
      const currentCategories = await categoryModel.getCategoriesByProductId(Number(id))
      const currentCategoryIds = currentCategories?.map((cat) => cat.id) || []

      // Remover categorías que ya no están seleccionadas
      const categoriesToRemove = currentCategoryIds.filter(
        (catId) => !categories.includes(catId)
      )
      await Promise.all(
        categoriesToRemove.map(async (categoryId) => { await categoryModel.removeProductFromCategory(Number(id), categoryId) }
        )
      )

      // Agregar nuevas categorías seleccionadas
      const categoriesToAdd = categories.filter(
        (catId) => !currentCategoryIds.includes(catId)
      )
      await Promise.all(
        categoriesToAdd.map(async (categoryId) => { await categoryModel.addProductToCategory(Number(id), categoryId) }
        )
      )

      return createResponse(
        {
          message: 'Producto actualizado exitosamente',
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
        { error: 'ID de producto es requerido', success: false },
        400
      )
    }

    try {
      await productModel.deleteProduct(id)
      return createResponse(
        {
          message: 'Producto eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
