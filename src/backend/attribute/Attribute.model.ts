// generated
import { type Attributes as AttributeRaw } from '@/types/database'
import { type Attributes as Attribute } from '@/types/domain'

// me
import { AttributeMapper, AttributeMappers } from './Attribute.mapper'
import oAttributeRep from './Attribute.repository'

export class AttributeModel {
  /**
   * Obtener todos los atributos base (Color, Tamaño, Material, etc.)
   * Las opciones específicas se obtienen por producto
   */
  public async getAttributes(): Promise<Attribute[] | undefined> {
    const attributesRaw = await oAttributeRep.getAttributes()
    return AttributeMappers(attributesRaw)
  }

  /**
   * Obtener atributo base por ID
   */
  public async getAttributeById(id: number): Promise<Attribute | undefined> {
    const attributeRaw = await oAttributeRep.getAttributeById(id)
    if (!attributeRaw) return undefined
    return AttributeMapper(attributeRaw)
  }

  /**
   * Crear atributo base
   */
  public async createAttribute(
    attributeData: Omit<AttributeRaw, 'id'>
  ): Promise<Attribute | undefined> {
    const created = await oAttributeRep.createAttribute(attributeData)
    if (!created) return undefined
    return AttributeMapper(created)
  }

  /**
   * Actualizar atributo base
   */
  public async updateAttribute(
    attributeData: Omit<AttributeRaw, 'id'>,
    id: number
  ): Promise<Attribute | undefined> {
    const updated = await oAttributeRep.updateAttribute(attributeData, id)
    if (!updated) return undefined
    return AttributeMapper(updated)
  }

  /**
   * Eliminar atributo base
   */
  public async deleteAttribute(id: number): Promise<void> {
    await oAttributeRep.deleteAttribute(id)
  }
}

const attributeModel = new AttributeModel()
export default attributeModel
