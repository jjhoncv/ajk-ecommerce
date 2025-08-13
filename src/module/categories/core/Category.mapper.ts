import { type Categories as CategoryRaw } from '@/types/database'
import { type Categories as Category } from '@/types/domain'

export const CategoryMapper = (data: CategoryRaw): Category => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.image_url,
    parentId: data.parent_id,
    displayOrder: data.display_order,
    showNav: data.show_nav
  }
}

export const CategoriesMapper = (
  data: CategoryRaw[] | null
): Category[] | undefined => {
  if (data === null) return undefined
  return data.map(CategoryMapper)
}
