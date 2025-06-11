// generated
import { AttributeOptions as AttributeOptionRaw } from '@/types/database'
import { AttributeOptions as AttributeOption } from '@/types/domain'

// others
import attributeOptionImageModel from '@/models/AttributeOptionImage.model'
import variantAttributeOptionModel from '@/models/VariantAttributeOption.model'

// me
import {
  AttributeOptionMapper,
  AttributeOptionMapperWithImages,
  AttributeOptionsMapper
} from './AttributeOption.mapper'
import oAttributeOptionRep from './AttributeOption.repository'

import {
  AttributeOptionComplete,
  AttributeOptionWithImages,
  AttributeOptionWithVariantOptions
} from './AttributeOption.interfaces'

export class AttributeOptionModel {
  // ✅ Obtener opciones por attribute ID (SIN relaciones por defecto)
  public async getAttributeOptions(
    attributeId: number
  ): Promise<AttributeOption[] | undefined> {
    const optionsRaw =
      await oAttributeOptionRep.getAttributeOptions(attributeId)
    return AttributeOptionsMapper(optionsRaw)
  }

  // ✅ Obtener opciones por attribute ID CON images (lógica de negocio)
  public async getAttributeOptionsWithImages(
    attributeId: number
  ): Promise<AttributeOptionWithImages[] | undefined> {
    const optionsRaw =
      await oAttributeOptionRep.getAttributeOptions(attributeId)

    if (!optionsRaw) return undefined

    // Mapear opciones básicas
    const options = AttributeOptionsMapper(optionsRaw)
    if (!options) return undefined

    // Obtener images para todas las opciones (batch loading optimizado)
    const optionIds = options.map((option) => option.id)
    const imagesByOptionId =
      await attributeOptionImageModel.getAttributeOptionImagesByOptionIds(
        optionIds
      )

    // Combinar opciones con sus images
    return options.map((option) => ({
      ...option,
      attributeOptionImages: imagesByOptionId.get(option.id) || []
    }))
  }

  // ✅ Obtener opciones por attribute ID CON variant options (lógica de negocio)
  public async getAttributeOptionsWithVariantOptions(
    attributeId: number
  ): Promise<AttributeOptionWithVariantOptions[] | undefined> {
    const optionsRaw =
      await oAttributeOptionRep.getAttributeOptions(attributeId)

    if (!optionsRaw) return undefined

    // Mapear opciones básicas
    const options = AttributeOptionsMapper(optionsRaw)
    if (!options) return undefined

    // Obtener variant options para todas las opciones (batch loading optimizado)
    const optionIds = options.map((option) => option.id)
    const variantOptionsByOptionId =
      await variantAttributeOptionModel.getVariantAttributeOptionsByAttributeOptionIds(
        optionIds
      )

    // Combinar opciones con sus variant options
    return options.map((option) => ({
      ...option,
      variantAttributeOptions: variantOptionsByOptionId.get(option.id) || []
    }))
  }

  // ✅ Obtener opciones COMPLETAS por attribute ID (con images Y variant options)
  public async getAttributeOptionsComplete(
    attributeId: number
  ): Promise<AttributeOptionComplete[] | undefined> {
    const optionsRaw =
      await oAttributeOptionRep.getAttributeOptions(attributeId)

    if (!optionsRaw) return undefined

    // Mapear opciones básicas
    const options = AttributeOptionsMapper(optionsRaw)
    if (!options) return undefined

    // Obtener images y variant options para todas las opciones (batch loading optimizado)
    const optionIds = options.map((option) => option.id)
    const [imagesByOptionId, variantOptionsByOptionId] = await Promise.all([
      attributeOptionImageModel.getAttributeOptionImagesByOptionIds(optionIds),
      variantAttributeOptionModel.getVariantAttributeOptionsByAttributeOptionIds(
        optionIds
      )
    ])

    // Combinar opciones con todas sus relaciones
    return options.map((option) => ({
      ...option,
      attributeOptionImages: imagesByOptionId.get(option.id) || [],
      variantAttributeOptions: variantOptionsByOptionId.get(option.id) || []
    }))
  }

  // ✅ Obtener option por ID (SIN images por defecto)
  public async getAttributeOptionById(
    id: number
  ): Promise<AttributeOption | undefined> {
    const optionRaw = await oAttributeOptionRep.getAttributeOptionById(id)

    if (!optionRaw) return undefined

    return AttributeOptionMapper(optionRaw)
  }

  // ✅ Obtener option por ID CON images (lógica de negocio)
  public async getAttributeOptionByIdWithImages(
    id: number
  ): Promise<AttributeOptionWithImages | undefined> {
    const optionRaw = await oAttributeOptionRep.getAttributeOptionById(id)

    if (!optionRaw) return undefined

    // Obtener images de la option
    const images = await attributeOptionImageModel.getAttributeOptionImages(id)

    return AttributeOptionMapperWithImages(optionRaw, images)
  }

  // ✅ Crear option - delega al repository
  public async createAttributeOption(
    optionData: Omit<AttributeOptionRaw, 'id'>
  ): Promise<AttributeOption | undefined> {
    const created = await oAttributeOptionRep.createAttributeOption(optionData)

    if (!created) return undefined

    return AttributeOptionMapper(created)
  }

  // ✅ Actualizar option - delega al repository
  public async updateAttributeOption(
    optionData: Partial<AttributeOptionRaw>,
    id: number
  ): Promise<AttributeOption | undefined> {
    const updated = await oAttributeOptionRep.updateAttributeOption(
      optionData,
      id
    )

    if (!updated) return undefined

    return AttributeOptionMapper(updated)
  }

  // ✅ Eliminar option - delega al repository
  public async deleteAttributeOption(id: number): Promise<void> {
    return await oAttributeOptionRep.deleteAttributeOption(id)
  }

  // ✅ Eliminar todas las opciones de un atributo
  public async deleteAttributeOptionsByAttributeId(
    attributeId: number
  ): Promise<void> {
    return await oAttributeOptionRep.deleteAttributeOptionsByAttributeId(
      attributeId
    )
  }
}

const attributeOptionModel = new AttributeOptionModel()
export default attributeOptionModel
