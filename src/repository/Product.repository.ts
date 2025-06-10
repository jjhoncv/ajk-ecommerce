import { executeQuery } from '@/lib/db'
import { Products as ProductRaw } from '@/types/database'

export class ProductRepository {
  // ✅ Obtener todos los products
  public async getProducts(): Promise<ProductRaw[] | null> {
    const products = await executeQuery<ProductRaw[]>({
      query: 'SELECT * FROM products ORDER BY id ASC'
    })

    if (products.length === 0) return null
    return products
  }

  // ✅ Obtener product por ID
  public async getProductById(id: number): Promise<ProductRaw | null> {
    const products = await executeQuery<ProductRaw[]>({
      query: 'SELECT * FROM products WHERE id = ?',
      values: [id]
    })

    if (products.length === 0) return null
    return products[0]
  }

  // ✅ Obtener products por brand ID
  public async getProductsByBrandId(
    brandId: number
  ): Promise<ProductRaw[] | null> {
    const products = await executeQuery<ProductRaw[]>({
      query: 'SELECT * FROM products WHERE brand_id = ? ORDER BY name ASC',
      values: [brandId]
    })

    if (products.length === 0) return null
    return products
  }

  // ✅ Obtener products por múltiples brand IDs (batch loading)
  public async getProductsByBrandIds(
    brandIds: number[]
  ): Promise<ProductRaw[] | null> {
    if (brandIds.length === 0) return null

    const placeholders = brandIds.map(() => '?').join(',')
    const products = await executeQuery<ProductRaw[]>({
      query: `SELECT * FROM products WHERE brand_id IN (${placeholders}) ORDER BY brand_id, name ASC`,
      values: brandIds
    })

    if (products.length === 0) return null
    return products
  }

  // ✅ Buscar products por nombre (para búsqueda)
  public async searchProductsByName(
    searchTerm: string
  ): Promise<ProductRaw[] | null> {
    const products = await executeQuery<ProductRaw[]>({
      query: 'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC',
      values: [`%${searchTerm}%`]
    })

    if (products.length === 0) return null
    return products
  }

  // ✅ Obtener products con paginación
  public async getProductsPaginated(
    limit: number,
    offset: number
  ): Promise<ProductRaw[] | null> {
    const products = await executeQuery<ProductRaw[]>({
      query: 'SELECT * FROM products ORDER BY id ASC LIMIT ? OFFSET ?',
      values: [limit, offset]
    })

    if (products.length === 0) return null
    return products
  }

  // ✅ Contar total de products
  public async getProductsCount(): Promise<number> {
    const result = await executeQuery<{ count: number }[]>({
      query: 'SELECT COUNT(*) as count FROM products'
    })

    return result[0].count
  }

  // ✅ Crear product
  public async createProduct(
    product: Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO products SET ?',
      values: [product]
    })

    return await this.getProductById(result.insertId)
  }

  // ✅ Actualizar product
  public async updateProduct(
    productData: Partial<Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>>,
    id: number
  ): Promise<ProductRaw | null> {
    await executeQuery({
      query: 'UPDATE products SET ? WHERE id = ?',
      values: [productData, id]
    })

    return await this.getProductById(id)
  }

  // ✅ Eliminar product
  public async deleteProduct(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM products WHERE id = ?',
      values: [id]
    })
  }
}

const productRepository = new ProductRepository()
export default productRepository
