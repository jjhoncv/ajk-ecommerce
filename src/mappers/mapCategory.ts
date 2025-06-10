import { Categories as CategoryRaw } from '@/types/database'
import { Categories as Category } from '@/types/domain'

export const mapCategory = (data: CategoryRaw): Category => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.image_url,
    parentId: data.parent_id
  }
}

export const mapCategories = (
  data: CategoryRaw[] | null
): Category[] | undefined => {
  if (data === null) return undefined
  return data.map(mapCategory)
}
