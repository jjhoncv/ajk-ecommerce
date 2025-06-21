import { type Categories as Category } from '@/types/domain'
import { type MainCategory } from './types'

export const hydrateMainCategories = (data: Category[]): MainCategory[] => {
  return data.map((item) => ({
    image: item.imageUrl ?? null,
    name: item.name
  }))
}
