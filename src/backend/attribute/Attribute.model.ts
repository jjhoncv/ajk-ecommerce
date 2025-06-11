// generated
import { Attributes as AttributeRaw } from '@/types/database'
import { AttributeOptions as AttributeOption } from '@/types/domain'

// others
import attributeOptionModel from '@/backend/attribute-option/AttributeOption.model'

// me
import { AttributeWithOptions } from './Attribute.interfaces'
import { AttributeMapper, AttributeMappers } from './Attribute.mapper'
import oAttributeRep from './Attribute.repository'

export class AttributeModel {
  // ✅ Obtener todos los attributes con sus opciones (SIN images por defecto)
  public async getAttributes(): Promise<AttributeWithOptions[] | undefined> {
    const attributesRaw = await oAttributeRep.getAttributes()
    const attributes = AttributeMappers(attributesRaw)

    if (!attributes) return undefined

    // Para cada atributo, obtener sus opciones SIN images
    return Promise.all(
      attributes.map(async (attribute) => ({
        ...attribute,
        options: await this.getAttributeOptions(attribute.id)
      }))
    )
  }

  // ✅ Obtener todos los attributes con opciones E IMAGES (lógica de negocio)
  public async getAttributesWithImages(): Promise<
    AttributeWithOptions[] | undefined
  > {
    const attributesRaw = await oAttributeRep.getAttributes()
    const attributes = AttributeMappers(attributesRaw)

    if (!attributes) return undefined

    // Para cada atributo, obtener sus opciones CON images usando el MODEL
    return Promise.all(
      attributes.map(async (attribute) => ({
        ...attribute,
        options: await attributeOptionModel.getAttributeOptionsWithImages(
          attribute.id
        )
      }))
    )
  }

  // ✅ Obtener attribute por ID con sus opciones (SIN images por defecto)
  public async getAttributeById(
    id: number
  ): Promise<AttributeWithOptions | undefined> {
    const attributeRaw = await oAttributeRep.getAttributeById(id)

    if (!attributeRaw) return undefined

    const attribute = AttributeMapper(attributeRaw)
    const options = await this.getAttributeOptions(attribute.id)

    return {
      ...attribute,
      options
    }
  }

  // ✅ Obtener attribute por ID con opciones E IMAGES (lógica de negocio)
  public async getAttributeByIdWithImages(
    id: number
  ): Promise<AttributeWithOptions | undefined> {
    const attributeRaw = await oAttributeRep.getAttributeById(id)

    if (!attributeRaw) return undefined

    const attribute = AttributeMapper(attributeRaw)
    const options = await attributeOptionModel.getAttributeOptionsWithImages(
      attribute.id
    )

    return {
      ...attribute,
      options
    }
  }

  // ✅ Obtener solo las opciones de un atributo
  public async getAttributeOptions(
    attributeId: number
  ): Promise<AttributeOption[] | undefined> {
    const optionsRaw =
      await attributeOptionModel.getAttributeOptions(attributeId)
    if (!optionsRaw) return undefined
    return optionsRaw
  }

  // ✅ Crear attribute - delega al repository
  public async createAttribute(
    attributeData: Omit<AttributeRaw, 'id'>
  ): Promise<AttributeWithOptions | undefined> {
    const created = await oAttributeRep.createAttribute(attributeData)

    if (!created) return undefined

    return await this.getAttributeById(created.id)
  }

  // ✅ Actualizar attribute - delega al repository
  public async updateAttribute(
    attributeData: Omit<AttributeRaw, 'id'>,
    id: number
  ): Promise<AttributeWithOptions | undefined> {
    const updated = await oAttributeRep.updateAttribute(attributeData, id)

    if (!updated) return undefined

    return await this.getAttributeById(updated.id)
  }

  // ✅ Eliminar attribute - delega al repository
  public async deleteAttribute(id: number): Promise<void> {
    return await oAttributeRep.deleteAttribute(id)
  }
}

const attributeModel = new AttributeModel()
export default attributeModel
