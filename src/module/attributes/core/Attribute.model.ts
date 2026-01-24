import { type Attributes as AttributeRaw } from '@/types/database'
import { type Attributes as Attribute } from '@/types/domain'

import { AttributeMapper, AttributeMappers } from './Attribute.mapper'
import oAttributeRep from './Attribute.repository'

export class AttributeModel {
  /**
   * Get all base attributes (Color, Size, Material, etc.)
   * Specific options are obtained per product
   */
  public async getAttributes(): Promise<Attribute[] | undefined> {
    const attributesRaw = await oAttributeRep.getAttributes()
    return AttributeMappers(attributesRaw)
  }

  /**
   * Get base attribute by ID
   */
  public async getAttributeById(id: number): Promise<Attribute | undefined> {
    const attributeRaw = await oAttributeRep.getAttributeById(id)
    if (!attributeRaw) return undefined
    return AttributeMapper(attributeRaw)
  }

  /**
   * Create base attribute
   */
  public async createAttribute(
    attributeData: Omit<AttributeRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Attribute | undefined> {
    const created = await oAttributeRep.createAttribute(attributeData)
    if (!created) return undefined
    return AttributeMapper(created)
  }

  /**
   * Update base attribute
   */
  public async updateAttribute(
    attributeData: Omit<AttributeRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<Attribute | undefined> {
    const updated = await oAttributeRep.updateAttribute(attributeData, id)
    if (!updated) return undefined
    return AttributeMapper(updated)
  }

  /**
   * Delete base attribute
   */
  public async deleteAttribute(id: number): Promise<void> {
    await oAttributeRep.deleteAttribute(id)
  }
}

const attributeModel = new AttributeModel()
export default attributeModel
