import { type Categories as Category } from '@/types/domain'
import { type MainCategory } from './types'

export const hydrateCategories = (data: Category[]): MainCategory[] => {
  return data.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl ?? '',
    name: item.name,
    description: item.description ?? '',
    parentId: item.parentId,
    showNav: item.showNav,
    displayOrder: item.displayOrder
  }))
}
