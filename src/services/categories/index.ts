import { getNavCategories } from '@/services/categories/navCategories'
import { getAllCategories } from './allCategories'
import { getMainCategories } from './mainCategories'

const CategoryService = {
  getMainCategories,
  getAllCategories,
  getNavCategories
}

export default CategoryService
