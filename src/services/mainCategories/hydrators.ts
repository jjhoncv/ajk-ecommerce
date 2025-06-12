import { Categories as Category } from '@/types/domain'
import { MainCategory } from './types'

export const hydrateMainCategories = (data: Category[]): MainCategory[] => {
  return data.map((item) => ({
    image: item.imageUrl ?? null,
    name: item.name
  }))
}
