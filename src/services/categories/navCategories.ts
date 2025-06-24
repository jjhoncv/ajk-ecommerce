import categoryModel from '@/backend/category'
import { hydrateCategories } from './hydrators'
import { type MainCategory } from './types'

export const getNavCategories = async (): Promise<MainCategory[]> => {
  try {
    // Obtener todas las categorías
    const categoriesData = await categoryModel.getCategoriesToNav()

    if (categoriesData == null || categoriesData.length === 0) {
      console.log('No se encontraron categorías para la navegacion')
      return []
    }

    return hydrateCategories(categoriesData)
  } catch (error) {
    throw new Error(
      `Error al obtener getNavCategories ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
