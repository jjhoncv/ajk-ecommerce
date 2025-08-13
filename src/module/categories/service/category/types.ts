import { type Categories } from '@/types/domain'

export type Category = Categories

export interface CategoryWithChildren extends Category {
  children?: Category[]
}

export type CreateCategoryData = Omit<Categories, 'id'>
export type UpdateCategoryData = Omit<Categories, 'id'>
