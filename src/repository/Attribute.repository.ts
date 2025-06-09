import { executeQuery } from '@/lib/db'
import { attributes as AttributeRaw } from '@/types/database'

export class AttributeRepository {
  public async getAttributes(): Promise<AttributeRaw[] | null> {
    const attributes = await executeQuery<AttributeRaw[]>({
      query: 'SELECT * FROM attributes'
    })

    if (attributes.length === 0) return null
    return attributes
  }

  public async getAttributeById(id: number): Promise<AttributeRaw | null> {
    const attributes = await executeQuery<AttributeRaw[]>({
      query: 'SELECT * FROM attributes WHERE id = ?',
      values: [id]
    })

    if (attributes.length === 0) return null

    return attributes[0]
  }

  public async createAttribute(
    attribute: Omit<AttributeRaw, 'id'>
  ): Promise<AttributeRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO attributes SET ?',
      values: [attribute]
    })

    return await this.getAttributeById(result.insertId)
  }

  public async updateAttribute(
    attributeData: Omit<AttributeRaw, 'id'>,
    id: number
  ): Promise<AttributeRaw | null> {
    await executeQuery({
      query: 'UPDATE attributes SET ? WHERE id=?',
      values: [attributeData, id]
    })

    return await this.getAttributeById(id)
  }

  public async deleteAttribute(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM attributes WHERE id=?',
      values: [id]
    })
  }
}

const attributeRepository = new AttributeRepository()
export default attributeRepository
