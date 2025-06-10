import { mapAttribute, mapAttributes } from '@/mappers/mapAttribute'
import { mapAttributeOptions } from '@/mappers/mapAttributeOption'
import attributeOptionModel from '@/models/AttributeOption.model'
import oAttributeRep from '@/repository/Attribute.repository'
import oAttributeOptionRep from '@/repository/AttributeOption.repository'

import { Attributes as AttributeRaw } from '@/types/database'
import {
  Attributes as Attribute,
  AttributeOptions as AttributeOption
} from '@/types/domain'

// ✅ Interface para Attribute con opciones
export interface AttributeWithOptions extends Attribute {
  options?: AttributeOption[]
}

export class AttributeModel {
  // ✅ Obtener todos los attributes con sus opciones (SIN images por defecto)
  public async getAttributes(): Promise<AttributeWithOptions[] | undefined> {
    const attributesRaw = await oAttributeRep.getAttributes()
    const attributes = mapAttributes(attributesRaw)

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
    const attributes = mapAttributes(attributesRaw)

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

    const attribute = mapAttribute(attributeRaw)
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

    const attribute = mapAttribute(attributeRaw)
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
      await oAttributeOptionRep.getAttributeOptions(attributeId)
    return mapAttributeOptions(optionsRaw)
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
