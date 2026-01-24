import categoryModel from '../../core/Category.model'
import userModel from '@/module/users/core/User.model'
import { type CreateCategoryData, type UpdateCategoryData } from './types'

export interface CategoryWithAudit {
  category: Awaited<ReturnType<typeof categoryModel.getCategoryById>>
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

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

  getCategoryBySlug: async (slug: string) => {
    return await categoryModel.getCategoryBySlug(slug)
  },

  // Obtener categoría con información de auditoría (nombres de usuarios)
  getCategoryWithAudit: async (id: number): Promise<CategoryWithAudit | null> => {
    console.log('[categoryService.getCategoryWithAudit] Fetching category id:', id)

    try {
      const category = await categoryModel.getCategoryById(id)
      console.log('[categoryService.getCategoryWithAudit] Category result:', category ? 'found' : 'not found')

      if (!category) return null

      // Obtener nombres de usuarios
      const [createdByName, updatedByName] = await Promise.all([
        category.createdBy ? userModel.getUserFullName(category.createdBy) : null,
        category.updatedBy ? userModel.getUserFullName(category.updatedBy) : null
      ])

      return {
        category,
        audit: {
          createdAt: category.createdAt ?? null,
          createdByName,
          updatedAt: category.updatedAt ?? null,
          updatedByName
        }
      }
    } catch (error) {
      console.error('[categoryService.getCategoryWithAudit] Error:', error)
      return null
    }
  },

  // Obtener todos los ancestros de una categoría (para breadcrumb)
  getCategoryAncestors: async (categoryId: number) => {
    const ancestors: Array<{ id: number; name: string; slug: string; parentId: number | null }> = []
    let currentId: number | null = categoryId

    while (currentId != null) {
      const category = await categoryModel.getCategoryById(currentId)
      if (category == null) break

      ancestors.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ?? null
      })

      currentId = category.parentId ?? null
    }

    return ancestors
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
