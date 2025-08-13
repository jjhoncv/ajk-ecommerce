import categoryModel from '../../core/Category.model'
import { type CreateCategoryData, type UpdateCategoryData } from './types'

export const categoryService = {
  getCategories: async () => {
    const categories = await categoryModel.getCategories()
    return categories ?? []
  },

  getCategoriesByParent: async (parentId?: number | null) => {
    const categories = await categoryModel.getCategoriesByParent(parentId)
    return categories ?? []
  },

  hasSubcategories: async (categoryId: number) => {
    return await categoryModel.hasSubcategories(categoryId)
  },

  searchCategories: async (q?: string) => {
    const categories = await categoryModel.searchCategories(q)
    return categories ?? []
  },

  getCategoriesToNav: async () => {
    const categories = await categoryModel.getCategoriesToNav()
    return categories ?? []
  },

  getCategoryById: async (id: number) => {
    return await categoryModel.getCategoryById(id)
  },

  getCategoriesByProductId: async (productId: number) => {
    const categories = await categoryModel.getCategoriesByProductId(productId)
    return categories ?? []
  },

  createCategory: async (categoryData: CreateCategoryData) => {
    return await categoryModel.createCategory(categoryData)
  },

  updateCategory: async (categoryData: UpdateCategoryData, id: number) => {
    return await categoryModel.updateCategory(categoryData, id)
  },

  updateCategoryOrder: async (id: number, displayOrder: number) => {
    await categoryModel.updateCategoryOrder(id, displayOrder)
  },

  deleteCategory: async (id: number) => {
    await categoryModel.deleteCategory(id)
  },

  addProductToCategory: async (productId: number, categoryId: number) => {
    await categoryModel.addProductToCategory(productId, categoryId)
  },

  removeProductFromCategory: async (productId: number, categoryId: number) => {
    await categoryModel.removeProductFromCategory(productId, categoryId)
  }
}

export default categoryService
