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

  public async getCategoriesToNav(): Promise<Category[] | undefined> {
    const categoriesRaw = await oCategoryRep.getCategoriesToNav()
    return CategoriesMapper(categoriesRaw)
  }

  public async getCategoryById(id: number): Promise<Category | undefined> {
    const categoryRaw = await oCategoryRep.getCategoryById(id)
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
    categoryData: Omit<CategoriesRaw, 'id'>
  ): Promise<Category | undefined> {
    const created = await oCategoryRep.createCategory(categoryData)
    if (created == null) return undefined
    return CategoryMapper(created)
  }

  public async updateCategory(
    categoryData: Omit<CategoriesRaw, 'id'>,
    id: number
  ): Promise<Category | undefined> {
    const updated = await oCategoryRep.updateCategory(categoryData, id)
    if (updated == null) return undefined
    return CategoryMapper(updated)
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
