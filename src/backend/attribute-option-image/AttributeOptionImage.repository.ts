import { executeQuery } from '@/lib/db'
import { type ProductAttributeOptionImages as ProductAttributeOptionImageRaw } from '@/types/database'

export class AttributeOptionImageRepository {
  public async getAttributeOptionImages(
    productAttributeOptionId: number
  ): Promise<ProductAttributeOptionImageRaw[] | null> {
    const images = await executeQuery<ProductAttributeOptionImageRaw[]>({
      query: `
        SELECT * FROM product_attribute_option_images
        WHERE product_attribute_option_id = ?
        ORDER BY display_order ASC, id ASC
      `,
      values: [productAttributeOptionId]
    })

    if (images.length === 0) return null
    return images
  }

  public async getAttributeOptionImageById(
    id: number
  ): Promise<ProductAttributeOptionImageRaw | null> {
    const images = await executeQuery<ProductAttributeOptionImageRaw[]>({
      query: 'SELECT * FROM product_attribute_option_images WHERE id = ?',
      values: [id]
    })

    if (images.length === 0) return null
    return images[0]
  }

  public async getAttributeOptionImagesByOptionIds(
    productAttributeOptionIds: number[]
  ): Promise<ProductAttributeOptionImageRaw[] | null> {
    if (productAttributeOptionIds.length === 0) return null

    const placeholders = productAttributeOptionIds.map(() => '?').join(',')
    const images = await executeQuery<ProductAttributeOptionImageRaw[]>({
      query: `
        SELECT * FROM product_attribute_option_images
        WHERE product_attribute_option_id IN (${placeholders})
        ORDER BY product_attribute_option_id, display_order ASC, id ASC
      `,
      values: productAttributeOptionIds
    })

    if (images.length === 0) return null
    return images
  }

  public async createAttributeOptionImage(
    image: Omit<ProductAttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductAttributeOptionImageRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO product_attribute_option_images SET ?',
      values: [image]
    })

    return await this.getAttributeOptionImageById(result.insertId)
  }

  public async updateAttributeOptionImage(
    imageData: Partial<
      Omit<ProductAttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<ProductAttributeOptionImageRaw | null> {
    await executeQuery({
      query: 'UPDATE product_attribute_option_images SET ? WHERE id = ?',
      values: [imageData, id]
    })

    return await this.getAttributeOptionImageById(id)
  }

  public async deleteAttributeOptionImage(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_attribute_option_images WHERE id = ?',
      values: [id]
    })
  }

  public async deleteAttributeOptionImagesByOptionId(
    productAttributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM product_attribute_option_images WHERE product_attribute_option_id = ?',
      values: [productAttributeOptionId]
    })
  }
}

const attributeOptionImageRepository = new AttributeOptionImageRepository()
export default attributeOptionImageRepository
