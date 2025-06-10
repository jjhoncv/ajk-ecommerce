import { executeQuery } from '@/lib/db'
import { AttributeOptionImages as AttributeOptionImageRaw } from '@/types/database'

export class AttributeOptionImageRepository {
  // ✅ Obtener images por attribute option ID
  public async getAttributeOptionImages(
    attributeOptionId: number
  ): Promise<AttributeOptionImageRaw[] | null> {
    const images = await executeQuery<AttributeOptionImageRaw[]>({
      query: `
        SELECT * FROM attribute_option_images 
        WHERE attribute_option_id = ? 
        ORDER BY display_order ASC, id ASC
      `,
      values: [attributeOptionId]
    })

    if (images.length === 0) return null
    return images
  }

  // ✅ Obtener image por ID
  public async getAttributeOptionImageById(
    id: number
  ): Promise<AttributeOptionImageRaw | null> {
    const images = await executeQuery<AttributeOptionImageRaw[]>({
      query: 'SELECT * FROM attribute_option_images WHERE id = ?',
      values: [id]
    })

    if (images.length === 0) return null
    return images[0]
  }

  // ✅ Obtener images por múltiples attribute option IDs (para batch loading)
  public async getAttributeOptionImagesByOptionIds(
    attributeOptionIds: number[]
  ): Promise<AttributeOptionImageRaw[] | null> {
    if (attributeOptionIds.length === 0) return null

    const placeholders = attributeOptionIds.map(() => '?').join(',')
    const images = await executeQuery<AttributeOptionImageRaw[]>({
      query: `
        SELECT * FROM attribute_option_images 
        WHERE attribute_option_id IN (${placeholders})
        ORDER BY attribute_option_id, display_order ASC, id ASC
      `,
      values: attributeOptionIds
    })

    if (images.length === 0) return null
    return images
  }

  // ✅ Crear image
  public async createAttributeOptionImage(
    image: Omit<AttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AttributeOptionImageRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO attribute_option_images SET ?',
      values: [image]
    })

    return await this.getAttributeOptionImageById(result.insertId)
  }

  // ✅ Actualizar image
  public async updateAttributeOptionImage(
    imageData: Partial<
      Omit<AttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<AttributeOptionImageRaw | null> {
    await executeQuery({
      query: 'UPDATE attribute_option_images SET ? WHERE id = ?',
      values: [imageData, id]
    })

    return await this.getAttributeOptionImageById(id)
  }

  // ✅ Eliminar image por ID
  public async deleteAttributeOptionImage(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM attribute_option_images WHERE id = ?',
      values: [id]
    })
  }

  // ✅ Eliminar todas las images de una option
  public async deleteAttributeOptionImagesByOptionId(
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM attribute_option_images WHERE attribute_option_id = ?',
      values: [attributeOptionId]
    })
  }
}

const attributeOptionImageRepository = new AttributeOptionImageRepository()
export default attributeOptionImageRepository
