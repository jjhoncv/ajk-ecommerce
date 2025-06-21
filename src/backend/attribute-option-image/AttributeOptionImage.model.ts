import { type AttributeOptionImages as AttributeOptionImageRaw } from '@/types/database'
import { type AttributeOptionImages as AttributeOptionImage } from '@/types/domain'

// me
import {
  AttributeOptionImageMapper,
  AttributeOptionImagesMapper
} from './AttributeOptionImage.mapper'
import oAttributeOptionImageRep from './AttributeOptionImage.repository'

export class AttributeOptionImageModel {
  public async getAttributeOptionImages(
    attributeOptionId: number
  ): Promise<AttributeOptionImage[] | undefined> {
    const imagesRaw =
      await oAttributeOptionImageRep.getAttributeOptionImages(attributeOptionId)
    return AttributeOptionImagesMapper(imagesRaw)
  }

  public async getAttributeOptionImageById(
    id: number
  ): Promise<AttributeOptionImage | undefined> {
    const imageRaw =
      await oAttributeOptionImageRep.getAttributeOptionImageById(id)
    if (!imageRaw) return undefined
    return AttributeOptionImageMapper(imageRaw)
  }

  public async getAttributeOptionImagesByOptionIds(
    attributeOptionIds: number[]
  ): Promise<Map<number, AttributeOptionImage[]>> {
    const imagesRaw =
      await oAttributeOptionImageRep.getAttributeOptionImagesByOptionIds(
        attributeOptionIds
      )

    if (!imagesRaw) return new Map()

    // Agrupar images por attribute_option_id
    const imagesByOptionId = new Map<number, AttributeOptionImage[]>()

    for (const imageRaw of imagesRaw) {
      const image = AttributeOptionImageMapper(imageRaw)
      const optionId = image.attributeOptionId

      if (!imagesByOptionId.has(optionId)) {
        imagesByOptionId.set(optionId, [])
      }

      imagesByOptionId.get(optionId)!.push(image)
    }

    return imagesByOptionId
  }

  public async createAttributeOptionImage(
    imageData: Omit<AttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AttributeOptionImage | undefined> {
    const created =
      await oAttributeOptionImageRep.createAttributeOptionImage(imageData)
    if (!created) return undefined
    return AttributeOptionImageMapper(created)
  }

  public async updateAttributeOptionImage(
    imageData: Partial<
      Omit<AttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<AttributeOptionImage | undefined> {
    const updated = await oAttributeOptionImageRep.updateAttributeOptionImage(
      imageData,
      id
    )
    if (!updated) return undefined
    return AttributeOptionImageMapper(updated)
  }

  public async deleteAttributeOptionImage(id: number): Promise<void> {
    await oAttributeOptionImageRep.deleteAttributeOptionImage(id)
  }

  public async deleteAttributeOptionImagesByOptionId(
    attributeOptionId: number
  ): Promise<void> {
    await oAttributeOptionImageRep.deleteAttributeOptionImagesByOptionId(
      attributeOptionId
    )
  }
}

const attributeOptionImageModel = new AttributeOptionImageModel()
export default attributeOptionImageModel
