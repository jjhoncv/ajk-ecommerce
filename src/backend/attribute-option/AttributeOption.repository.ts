import { executeQuery } from '@/lib/db'
import { AttributeOptions as AttributeOptionRaw } from '@/types/database'

export class AttributeOptionRepository {
  // ✅ Obtener opciones por attribute ID
  public async getAttributeOptions(
    attributeId: number
  ): Promise<AttributeOptionRaw[] | null> {
    const attributeOptions = await executeQuery<AttributeOptionRaw[]>({
      query: 'SELECT * FROM attribute_options WHERE attribute_id = ?',
      values: [attributeId]
    })

    if (attributeOptions.length === 0) return null
    return attributeOptions
  }

  // ✅ Obtener option por ID
  public async getAttributeOptionById(
    id: number
  ): Promise<AttributeOptionRaw | null> {
    const options = await executeQuery<AttributeOptionRaw[]>({
      query: 'SELECT * FROM attribute_options WHERE id = ?',
      values: [id]
    })

    if (options.length === 0) return null
    return options[0]
  }

  // ✅ Crear option
  public async createAttributeOption(
    option: Omit<AttributeOptionRaw, 'id'>
  ): Promise<AttributeOptionRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO attribute_options SET ?',
      values: [option]
    })

    return await this.getAttributeOptionById(result.insertId)
  }

  // ✅ Actualizar option
  public async updateAttributeOption(
    optionData: Partial<AttributeOptionRaw>,
    id: number
  ): Promise<AttributeOptionRaw | null> {
    await executeQuery({
      query: 'UPDATE attribute_options SET ? WHERE id = ?',
      values: [optionData, id]
    })

    return await this.getAttributeOptionById(id)
  }

  // ✅ Eliminar option por ID
  public async deleteAttributeOption(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM attribute_options WHERE id = ?',
      values: [id]
    })
  }

  // ✅ Eliminar todas las opciones de un atributo
  public async deleteAttributeOptionsByAttributeId(
    attributeId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM attribute_options WHERE attribute_id = ?',
      values: [attributeId]
    })
  }
}

const attributeOptionRepository = new AttributeOptionRepository()
export default attributeOptionRepository
