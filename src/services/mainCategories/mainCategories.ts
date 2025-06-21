import categoryModel from '@/backend/category'
import { hydrateMainCategories } from './hydrators'
import { type MainCategory } from './types'

export const getMainCategories = async (): Promise<MainCategory[]> => {
  try {
    // Obtener todas las categorías
    const categoriesData = await categoryModel.getCategories()

    // Filtrar categorías principales para la sección de categorías
    const mainCategories = categoriesData
      ? categoriesData.filter((cat) => !cat.parentId).slice(0, 8)
      : []

    return hydrateMainCategories(mainCategories)
  } catch (error) {
    throw new Error(
      `Error al obtener getMainCategories ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
