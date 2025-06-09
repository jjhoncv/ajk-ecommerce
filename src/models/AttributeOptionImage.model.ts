import {
  mapAttributeOptionImage,
  mapAttributeOptionImages
} from '@/mappers/mapAttributeOptionImage'
import oAttributeOptionImageRep from '@/repository/AttributeOptionImage.repository'

import { attribute_option_images as AttributeOptionImageRaw } from '@/types/database'
import { AttributeOptionImages as AttributeOptionImage } from '@/types/domain'

export class AttributeOptionImageModel {
  // ✅ Obtener images por attribute option ID
  public async getAttributeOptionImages(
    attributeOptionId: number
  ): Promise<AttributeOptionImage[] | undefined> {
    const imagesRaw =
      await oAttributeOptionImageRep.getAttributeOptionImages(attributeOptionId)
    return mapAttributeOptionImages(imagesRaw)
  }

  // ✅ Obtener image por ID
  public async getAttributeOptionImageById(
    id: number
  ): Promise<AttributeOptionImage | undefined> {
    const imageRaw =
      await oAttributeOptionImageRep.getAttributeOptionImageById(id)

    if (!imageRaw) return undefined

    return mapAttributeOptionImage(imageRaw)
  }

  // ✅ Obtener images para múltiples options (optimizado para batch loading)
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
      const image = mapAttributeOptionImage(imageRaw)
      const optionId = image.attributeOptionId

      if (!imagesByOptionId.has(optionId)) {
        imagesByOptionId.set(optionId, [])
      }

      imagesByOptionId.get(optionId)!.push(image)
    }

    return imagesByOptionId
  }

  // ✅ Crear image
  public async createAttributeOptionImage(
    imageData: Omit<AttributeOptionImageRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AttributeOptionImage | undefined> {
    const created =
      await oAttributeOptionImageRep.createAttributeOptionImage(imageData)

    if (!created) return undefined

    return mapAttributeOptionImage(created)
  }

  // ✅ Actualizar image
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

    return mapAttributeOptionImage(updated)
  }

  // ✅ Eliminar image
  public async deleteAttributeOptionImage(id: number): Promise<void> {
    return await oAttributeOptionImageRep.deleteAttributeOptionImage(id)
  }

  // ✅ Eliminar todas las images de una option
  public async deleteAttributeOptionImagesByOptionId(
    attributeOptionId: number
  ): Promise<void> {
    return await oAttributeOptionImageRep.deleteAttributeOptionImagesByOptionId(
      attributeOptionId
    )
  }
}

const attributeOptionImageModel = new AttributeOptionImageModel()
export default attributeOptionImageModel
