import { executeQuery } from '@/lib/db'
import { type Categories as CategoriesRaw } from '@/types/database'

export class CategoryRepository {
  public async getCategories(): Promise<CategoriesRaw[] | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: 'SELECT * FROM categories ORDER BY display_order ASC, name ASC'
    })

    if (categories.length === 0) return null
    return categories
  }

  public async getCategoriesByParent(
    parentId?: number | null
  ): Promise<CategoriesRaw[] | null> {
    const query =
      parentId === null || parentId === undefined
        ? 'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY display_order ASC, name ASC'
        : 'SELECT * FROM categories WHERE parent_id = ? ORDER BY display_order ASC, name ASC'

    const values = parentId === null || parentId === undefined ? [] : [parentId]

    const categories = await executeQuery<CategoriesRaw[]>({
      query,
      values
    })

    if (categories.length === 0) return null
    return categories
  }

  public async hasSubcategories(categoryId: number): Promise<boolean> {
    const result = await executeQuery<Array<{ count: number }>>({
      query: 'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?',
      values: [categoryId]
    })

    return result[0].count > 0
  }

  public async searchCategories(q?: string): Promise<CategoriesRaw[] | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query:
        'SELECT * FROM categories WHERE name LIKE ? OR description LIKE ? ORDER BY display_order ASC, name ASC',
      values: [`%${q}%`, `%${q}%`]
    })

    if (categories.length === 0) return null
    return categories
  }

  public async getCategoriesToNav(): Promise<CategoriesRaw[] | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query:
        'SELECT * FROM categories WHERE show_nav = 1 ORDER BY display_order ASC, name ASC'
    })

    if (categories.length === 0) return null
    return categories
  }

  public async getCategoryById(id: number): Promise<CategoriesRaw | null> {
    console.log('[CategoryRepository.getCategoryById] Querying category id:', id)

    const categories = await executeQuery<CategoriesRaw[]>({
      query: 'SELECT * FROM categories WHERE id = ?',
      values: [id]
    })

    console.log('[CategoryRepository.getCategoryById] Query result count:', categories?.length ?? 0)

    if (categories.length === 0) return null
    return categories[0]
  }

  public async getCategoryBySlug(slug: string): Promise<CategoriesRaw | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: 'SELECT * FROM categories WHERE slug = ?',
      values: [slug]
    })

    if (categories.length === 0) return null
    return categories[0]
  }

  public async getCategoriesByProductId(
    productId: number
  ): Promise<CategoriesRaw[] | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: `
        SELECT c.id, c.name, c.description, c.parent_id, c.image_url
        FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
        ORDER BY c.name ASC
      `,
      values: [productId]
    })

    if (categories.length === 0) return null
    return categories
  }

  public async createCategory(
    category: Omit<CategoriesRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CategoriesRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO categories SET ?',
      values: [category]
    })

    return await this.getCategoryById(result.insertId)
  }

  public async updateCategory(
    categoryData: Omit<CategoriesRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<CategoriesRaw | null> {
    await executeQuery({
      query: 'UPDATE categories SET ? WHERE id=?',
      values: [categoryData, id]
    })

    return await this.getCategoryById(id)
  }

  public async updateCategoryOrder(
    id: number,
    displayOrder: number
  ): Promise<void> {
    await executeQuery({
      query: 'UPDATE categories SET display_order = ? WHERE id = ?',
      values: [displayOrder, id]
    })
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
    await executeQuery({
      query:
        'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
      values: [productId, categoryId]
    })
  }

  public async removeProductFromCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM product_categories WHERE product_id = ? AND category_id = ?',
      values: [productId, categoryId]
    })
  }
}

const categoryRepository = new CategoryRepository()
export default categoryRepository
