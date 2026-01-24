import { type Categories as CategoriesRaw } from '@/types/database'
import { type Categories as Category } from '@/types/domain'

// me
import { CategoriesMapper, CategoryMapper } from './Category.mapper'
import oCategoryRep from './Category.repository'

export class CategoryModel {
  public async getCategories(): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.getCategories()
    return CategoriesMapper(categoriesRaw)
  }

  public async getCategoriesByParent(
    parentId?: number | null
  ): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.getCategoriesByParent(parentId)
    return CategoriesMapper(categoriesRaw)
  }

  public async hasSubcategories(categoryId: number): Promise<boolean> {
    return await oCategoryRep.hasSubcategories(categoryId)
  }

  public async searchCategories(q?: string): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.searchCategories(q)
    return CategoriesMapper(categoriesRaw)
  }

  public async getCategoriesToNav(): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.getCategoriesToNav()
    return CategoriesMapper(categoriesRaw)
  }

  public async getCategoryById(id: number): Promise<Category | undefined> {
    const categoryRaw = await oCategoryRep.getCategoryById(id)
    if (categoryRaw == null) return undefined
    return CategoryMapper(categoryRaw)
  }

  public async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const categoryRaw = await oCategoryRep.getCategoryBySlug(slug)
    if (categoryRaw == null) return undefined
    return CategoryMapper(categoryRaw)
  }

  public async getCategoriesByProductId(
    productId: number
  ): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.getCategoriesByProductId(productId)
    return CategoriesMapper(categoriesRaw)
  }

  public async createCategory(
    categoryData: Omit<CategoriesRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category | undefined> {
    const created = await oCategoryRep.createCategory(categoryData)
    if (created == null) return undefined
    return CategoryMapper(created)
  }

  public async updateCategory(
    categoryData: Omit<CategoriesRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<Category | undefined> {
    const updated = await oCategoryRep.updateCategory(categoryData, id)
    if (updated == null) return undefined
    return CategoryMapper(updated)
  }

  public async updateCategoryOrder(
    id: number,
    displayOrder: number
  ): Promise<void> {
    await oCategoryRep.updateCategoryOrder(id, displayOrder)
  }

  public async deleteCategory(id: number): Promise<void> {
    await oCategoryRep.deleteCategory(id)
  }

  public async addProductToCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await oCategoryRep.addProductToCategory(productId, categoryId)
  }

  public async removeProductFromCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await oCategoryRep.removeProductFromCategory(productId, categoryId)
  }
}

const categoryModel = new CategoryModel()
export default categoryModel
