import { categoryModel } from '@/module/categories/core'
import { hydrateCategories } from './hydrators'
import { type MainCategory } from './types'

export const getAllCategories = async (): Promise<MainCategory[]> => {
  try {
    // Obtener todas las categorías
    const categoriesData = await categoryModel.getCategories()

    if (categoriesData == null || categoriesData.length === 0) {
      return []
    }

    return hydrateCategories(categoriesData)
  } catch (error) {
    throw new Error(
      `Error al obtener getAllCategories ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
