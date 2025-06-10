import { executeQuery } from '@/lib/db'
import { Categories as CategoriesRaw } from '@/types/database'
import { Categories as Category } from '@/types/domain'

import { mapCategories, mapCategory } from '@/mappers/mapCategory'
import oCategoryRep from '@/repository/Category.repository'

interface CategoryWithChildren extends Category {
  children?: Category[]
}

export class CategoryModel {
  public async getCategories(): Promise<Category[] | undefined> {
    const categories = await oCategoryRep.getCategories()
    return mapCategories(categories)
  }

  public async getCategoriesHierarchy(): Promise<Category[] | undefined> {
    const categories = await this.getCategories()
    if (!categories) return undefined

    // Construir la jerarquía
    const categoryMap = new Map<number, CategoryWithChildren>()
    const rootCategories: Category[] = []

    // Crear el mapa de categorías
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      })
    })

    // Construir la jerarquía
    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!

      if (category.parentId === null || category.parentId === undefined) {
        rootCategories.push(categoryWithChildren)
      } else {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(categoryWithChildren)
        }
      }
    })

    return rootCategories
  }

  public async getCategoryById(id: number): Promise<Category | undefined> {
    const category = await oCategoryRep.getCategoryById(id)
    if (category === null) return undefined
    return mapCategory(category)
  }

  public async getCategoriesByProductId(
    productId: number
  ): Promise<Category[] | undefined> {
    const categories = await oCategoryRep.getCategoriesByProductId(productId)
    return mapCategories(categories)
  }

  public async createCategory(
    category: Omit<CategoriesRaw, 'id'>
  ): Promise<Category | undefined> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO categories SET ?',
      values: [category]
    })

    return await this.getCategoryById(result.insertId)
  }

  public async updateCategory(
    categoryData: Omit<CategoriesRaw, 'id'>,
    id: number
  ): Promise<Category | undefined> {
    await executeQuery({
      query: 'UPDATE categories SET ? WHERE id=?',
      values: [categoryData, id]
    })

    return await this.getCategoryById(id)
  }

  public async deleteCategory(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM categories WHERE id=?',
      values: [id]
    })
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
