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
}

const variantImageRepository = new VariantImageRepository()
export default variantImageRepository
