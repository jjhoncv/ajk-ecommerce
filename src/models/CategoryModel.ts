import { Category } from "@/interfaces/models";
import { CategoryDTO } from "@/dto";
import { executeQuery } from "@/lib/db";

export class CategoryModel {
  public async getCategories(): Promise<CategoryDTO[]> {
    const categories = await executeQuery<Category[]>({
      query: "SELECT * FROM categories",
    });

    return categories;
  }

  public async getCategoryById(id: number): Promise<CategoryDTO | null> {
    const categories = await executeQuery<Category[]>({
      query: "SELECT * FROM categories WHERE id = ?",
      values: [id],
    });

    if (categories.length === 0) return null;
    return categories[0];
  }

  public async getCategoriesByProductId(
    productId: number
  ): Promise<CategoryDTO[]> {
    const categories = await executeQuery<Category[]>({
      query: `
        SELECT c.* 
        FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
      `,
      values: [productId],
    });

    return categories;
  }

  public async createCategory(
    category: Omit<Category, "id">
  ): Promise<CategoryDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO categories SET ?",
      values: [category],
    });

    return (await this.getCategoryById(result.insertId)) as Category;
  }

  public async updateCategory(
    categoryData: Partial<Category>,
    id: number
  ): Promise<CategoryDTO> {
    await executeQuery({
      query: "UPDATE categories SET ? WHERE id=?",
      values: [categoryData, id],
    });

    return (await this.getCategoryById(id)) as Category;
  }

  public async deleteCategory(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM categories WHERE id=?",
      values: [id],
    });
  }

  public async addProductToCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await executeQuery({
      query:
        "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
      values: [productId, categoryId],
    });
  }

  public async removeProductFromCategory(
    productId: number,
    categoryId: number
  ): Promise<void> {
    await executeQuery({
      query:
        "DELETE FROM product_categories WHERE product_id = ? AND category_id = ?",
      values: [productId, categoryId],
    });
  }
}

export default new CategoryModel();
