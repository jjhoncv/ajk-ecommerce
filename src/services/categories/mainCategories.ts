import categoryModel from '@/backend/category'
import { hydrateCategories } from './hydrators'
import { type MainCategory } from './types'

export const getMainCategories = async (): Promise<MainCategory[]> => {
  try {
    // Obtener todas las categorías
    const categoriesData = await categoryModel.getCategories()

    if (categoriesData == null || categoriesData.length === 0) {
      console.error('No se encontraron categorías')
      return []
    }

    // Filtrar categorías principales para la sección de categorías
    const mainCategories = categoriesData
      .filter((cat) => cat.parentId == null)
      .slice(0, 8)

    return hydrateCategories(mainCategories)
  } catch (error) {
    throw new Error(
      `Error al obtener getMainCategories ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
