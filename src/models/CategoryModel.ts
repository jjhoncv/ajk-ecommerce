import { executeQuery } from "@/lib/db";
import { categories as CategoriesRaw } from "@/types/database"
interface CategoryRawWithChildren extends CategoriesRaw {
  children?: CategoriesRaw[]
}

export class CategoryModel {
  public async getCategories(): Promise<CategoriesRaw[] | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: "SELECT * FROM categories ORDER BY name"
    });

    if (categories.length === 0) return null;
    return categories;
  }

  public async getCategoriesHierarchy(): Promise<CategoriesRaw[] | null> {
    const categories = await this.getCategories();
    if (categories === null) return null

    // Construir la jerarquía
    const categoryMap = new Map<number, CategoryRawWithChildren>();
    const rootCategories: CategoriesRaw[] = [];

    // Crear el mapa de categorías
    categories.forEach((category) => {
      categoryMap.set(category.id, { 
        ...category,
        children: [] 
      });
    });

    // Construir la jerarquía
    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parent_id === null) {
        rootCategories.push(categoryWithChildren);
      } else {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(categoryWithChildren);
        }
      }
    });

    return rootCategories;
  }

  public async getCategoryById(id: number): Promise<CategoriesRaw | null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: "SELECT * FROM categories WHERE id = ?",
      values: [id],
    });

    if (categories.length === 0) return null;
    return categories[0];
  }

  public async getCategoriesByProductId(
    productId: number
  ): Promise<CategoriesRaw[] |null> {
    const categories = await executeQuery<CategoriesRaw[]>({
      query: `
        SELECT c.id, c.name, c.description, c.parent_id, c.image_url
        FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
      `,
      values: [productId],
    });

    if (categories.length === 0) return null;
    return categories;
  }

  public async createCategory(
    category: Omit<CategoriesRaw, "id">
  ): Promise<CategoriesRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO categories SET ?",
      values: [category],
    });

    return (await this.getCategoryById(result.insertId));
  }

  public async updateCategory(
    categoryData: Omit<CategoriesRaw, "id">,
    id: number 
  ): Promise<CategoriesRaw | null> {
    await executeQuery({
      query: "UPDATE categories SET ? WHERE id=?",
      values: [categoryData, id],
    });

    return (await this.getCategoryById(id));
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

const categoryModel = new CategoryModel();
export default categoryModel;
