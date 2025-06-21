import categoryModel from '@/backend/category'
import { type Categories } from '@/types/domain'
import { hydrateHeader } from './hydrators'

export const getHeader = async (): Promise<Categories[] | undefined> => {
  try {
    const categories = await categoryModel.getCategories()
    return hydrateHeader(categories)
  } catch (error) {
    throw new Error(
      `Error al obtener getHeader ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
