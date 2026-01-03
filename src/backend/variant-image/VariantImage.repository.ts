import { executeQuery } from '@/lib/db'
import { type VariantImages as VariantImagesRaw } from '@/types/database'

export class VariantImageRepository {
  public async getVariantImages(
    variantId: number
  ): Promise<VariantImagesRaw[] | null> {
    const images = await executeQuery<VariantImagesRaw[]>({
      query: `
        SELECT *
        FROM variant_images
        WHERE variant_id = ?
        ORDER BY display_order ASC, is_primary DESC
      `,
      values: [variantId]
    })

    if (images.length === 0) return null
    return images
  }

  public async getVariantImageById(
    id: number
  ): Promise<VariantImagesRaw | null> {
    const images = await executeQuery<VariantImagesRaw[]>({
      query: 'SELECT * FROM variant_images WHERE id = ?',
      values: [id]
    })

    if (images.length === 0) return null
    return images[0]
  }

  public async getVariantImagesByVariantIds(
    variantIds: number[]
  ): Promise<VariantImagesRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const images = await executeQuery<VariantImagesRaw[]>({
      query: `
        SELECT * FROM variant_images
        WHERE variant_id IN (${placeholders})
        ORDER BY variant_id, display_order ASC, is_primary DESC
      `,
      values: variantIds
    })

    if (images.length === 0) return null
    return images
  }

  public async createVariantImage(
    image: Omit<VariantImagesRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantImagesRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO variant_images SET ?',
      values: [image]
    })

    return await this.getVariantImageById(result.insertId)
  }

  public async updateVariantImage(
    imageData: Partial<
      Omit<VariantImagesRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<VariantImagesRaw | null> {
    await executeQuery({
      query: 'UPDATE variant_images SET ? WHERE id = ?',
      values: [imageData, id]
    })

    return await this.getVariantImageById(id)
  }

  public async deleteVariantImage(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_images WHERE id = ?',
      values: [id]
    })
  }

  public async deleteVariantImagesByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_images WHERE variant_id = ?',
      values: [variantId]
    })
  }

  public async updateImageOrder(
    id: number,
    displayOrder: number
  ): Promise<VariantImagesRaw | null> {
    await executeQuery({
      query: 'UPDATE variant_images SET display_order = ? WHERE id = ?',
      values: [displayOrder, id]
    })

    return await this.getVariantImageById(id)
  }

  public async setPrimaryImage(
    variantId: number,
    imageId: number
  ): Promise<void> {
    // Primero, desmarcar todas las imágenes como no primarias
    await executeQuery({
      query: 'UPDATE variant_images SET is_primary = 0 WHERE variant_id = ?',
      values: [variantId]
    })

    // Luego, marcar la imagen seleccionada como primaria
    await executeQuery({
      query: 'UPDATE variant_images SET is_primary = 1 WHERE id = ?',
      values: [imageId]
    })
  }
}

const variantImageRepository = new VariantImageRepository()
export default variantImageRepository
