import { type ProductAttributeOptionImages as ProductAttributeOptionImageRaw } from '@/types/database'
import { type ProductAttributeOptionImages as ProductAttributeOptionImage } from '@/types/domain'

import {
  AttributeOptionImageMapper,
  AttributeOptionImagesMapper
} from './AttributeOptionImage.mapper'
import oAttributeOptionImageRep from './AttributeOptionImage.repository'

export class AttributeOptionImageModel {
  public async getAttributeOptionImages(
    productAttributeOptionId: number,
    productId?: number
  ): Promise<ProductAttributeOptionImage[] | undefined> {
    const imagesRaw =
      await oAttributeOptionImageRep.getAttributeOptionImages(productAttributeOptionId)
    return AttributeOptionImagesMapper(imagesRaw)
  }

  public async getAttributeOptionImageById(
    id: number
  ): Promise<ProductAttributeOptionImage | undefined> {
    const imageRaw =
      await oAttributeOptionImageRep.getAttributeOptionImageById(id)
    if (!imageRaw) return undefined
    return AttributeOptionImageMapper(imageRaw)
  }

  public async getAttributeOptionImagesByOptionIds(
    productAttributeOptionIds: number[]
  ): Promise<Map<number, ProductAttributeOptionImage[]>> {
    const imagesRaw =
      await oAttributeOptionImageRep.getAttributeOptionImagesByOptionIds(
        productAttributeOptionIds
      )

    if (!imagesRaw) return new Map()

    // Agrupar images por product_attribute_option_id
    const imagesByOptionId = new Map<number, ProductAttributeOptionImage[]>()

    for (const imageRaw of imagesRaw) {
      const image = AttributeOptionImageMapper(imageRaw)
      const optionId = image.productAttributeOptionId

      if (!imagesByOptionId.has(optionId)) {
        imagesByOptionId.set(optionId, [])
      }

      imagesByOptionId.get(optionId)!.push(image)
    }

    return imagesByOptionId
  }

  public async createAttributeOptionImage(
    imageData: Omit<ProductAttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductAttributeOptionImage | undefined> {
    const created =
      await oAttributeOptionImageRep.createAttributeOptionImage(imageData)
    if (!created) return undefined
    return AttributeOptionImageMapper(created)
  }

  public async updateAttributeOptionImage(
    imageData: Partial<
      Omit<ProductAttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<ProductAttributeOptionImage | undefined> {
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
    productAttributeOptionId: number
  ): Promise<void> {
    await oAttributeOptionImageRep.deleteAttributeOptionImagesByOptionId(
      productAttributeOptionId
    )
  }
}

const attributeOptionImageModel = new AttributeOptionImageModel()
export default attributeOptionImageModel
