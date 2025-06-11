import { executeQuery } from '@/lib/db'
import { ProductVariants as ProductVariantRaw } from '@/types/database'

export class ProductVariantRepository {
  public async getProductVariants(): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants ORDER BY id ASC'
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantById(
    id: number
  ): Promise<ProductVariantRaw | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants WHERE id = ?',
      values: [id]
    })

    if (variants.length === 0) return null
    return variants[0]
  }

  public async getProductVariantsByProductId(
    productId: number
  ): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query:
        'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC',
      values: [productId]
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantsByProductIds(
    productIds: number[]
  ): Promise<ProductVariantRaw[] | null> {
    if (productIds.length === 0) return null

    const placeholders = productIds.map(() => '?').join(',')
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) ORDER BY product_id, id ASC`,
      values: productIds
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantBySku(
    sku: string
  ): Promise<ProductVariantRaw | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants WHERE sku = ?',
      values: [sku]
    })

    if (variants.length === 0) return null
    return variants[0]
  }

  public async createProductVariant(
    variant: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariantRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO product_variants SET ?',
      values: [variant]
    })

    return await this.getProductVariantById(result.insertId)
  }

  public async updateProductVariant(
    variantData: Partial<
      Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<ProductVariantRaw | null> {
    await executeQuery({
      query: 'UPDATE product_variants SET ? WHERE id = ?',
      values: [variantData, id]
    })

    return await this.getProductVariantById(id)
  }

  public async deleteProductVariant(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_variants WHERE id = ?',
      values: [id]
    })
  }

  public async deleteProductVariantsByProductId(
    productId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_variants WHERE product_id = ?',
      values: [productId]
    })
  }

  public async updateProductVariantStock(
    id: number,
    stock: number
  ): Promise<ProductVariantRaw | null> {
    await executeQuery({
      query: 'UPDATE product_variants SET stock = ? WHERE id = ?',
      values: [stock, id]
    })

    return await this.getProductVariantById(id)
  }
}

const productVariantRepository = new ProductVariantRepository()
export default productVariantRepository
