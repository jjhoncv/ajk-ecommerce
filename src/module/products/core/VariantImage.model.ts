import { type VariantImages as VariantImageRaw } from '@/types/database'
import { type VariantImages as VariantImage } from '@/types/domain'
import { VariantImageMapper, VariantImagesMapper } from './VariantImage.mapper'
import oVariantImageRep from './VariantImage.repository'

export class VariantImageModel {
  public async getVariantImages(
    variantId: number
  ): Promise<VariantImage[] | undefined> {
    const imagesRaw = await oVariantImageRep.getVariantImages(variantId)
    return VariantImagesMapper(imagesRaw)
  }

  public async getVariantImageById(
    id: number
  ): Promise<VariantImage | undefined> {
    const imageRaw = await oVariantImageRep.getVariantImageById(id)
    if (!imageRaw) return undefined
    return VariantImageMapper(imageRaw)
  }

  public async getVariantImagesByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantImage[]>> {
    const imagesRaw =
      await oVariantImageRep.getVariantImagesByVariantIds(variantIds)

    if (!imagesRaw) return new Map()

    // Agrupar images por variant_id
    const imagesByVariantId = new Map<number, VariantImage[]>()

    for (const imageRaw of imagesRaw) {
      const image = VariantImageMapper(imageRaw)
      const variantId = image.variantId

      if (!imagesByVariantId.has(variantId)) {
        imagesByVariantId.set(variantId, [])
      }

      imagesByVariantId.get(variantId)!.push(image)
    }

    return imagesByVariantId
  }

  public async createVariantImage(
    imageData: Omit<VariantImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantImage | undefined> {
    const created = await oVariantImageRep.createVariantImage(imageData)
    if (!created) return undefined
    return VariantImageMapper(created)
  }

  public async updateVariantImage(
    imageData: Partial<
      Omit<VariantImageRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<VariantImage | undefined> {
    const updated = await oVariantImageRep.updateVariantImage(imageData, id)
    if (!updated) return undefined
    return VariantImageMapper(updated)
  }

  public async deleteVariantImage(id: number): Promise<void> {
    await oVariantImageRep.deleteVariantImage(id)
  }

  public async deleteVariantImagesByVariantId(
    variantId: number
  ): Promise<void> {
    await oVariantImageRep.deleteVariantImagesByVariantId(variantId)
  }

  public async updateImageOrder(
    id: number,
    displayOrder: number
  ): Promise<VariantImage | undefined> {
    const updated = await oVariantImageRep.updateImageOrder(id, displayOrder)
    if (!updated) return undefined
    return VariantImageMapper(updated)
  }

  public async setPrimaryImage(
    variantId: number,
    imageId: number
  ): Promise<void> {
    await oVariantImageRep.setPrimaryImage(variantId, imageId)
  }
}

const variantImageModel = new VariantImageModel()
export default variantImageModel
