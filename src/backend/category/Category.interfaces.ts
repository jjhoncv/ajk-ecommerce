import { Categories as Category } from '@/types/domain'

export interface CategoryWithChildren extends Category {
  children?: Category[]
}
