import { categoryModel } from '@/module/categories/core'
import { hydrateFeaturedCategories } from './hydrators'
import { type FeaturedCategory } from './types'

export const getFeaturedCategories = async (): Promise<FeaturedCategory[]> => {
  try {
    // // Obtener todas las categorías
    const categoriesData = await categoryModel.getCategories()

    // // Filtrar categorías principales para la sección de categorías
    const mainCategories = categoriesData
      ? categoriesData.filter((cat) => !cat.parentId).slice(0, 8)
      : []

    const featuredCategories = mainCategories.slice(0, 3).map((category) => ({
      title: `Ofertas en ${category.name}`,
      subtitle: 'Descuentos especiales',
      image: category.imageUrl ?? null,
      link: `/categoria/${category.slug}`
    }))

    return hydrateFeaturedCategories(featuredCategories)
  } catch (error) {
    throw new Error(
      `Error al obtener getFeaturedCategories ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
