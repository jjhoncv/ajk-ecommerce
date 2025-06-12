import { executeQuery } from '@/lib/db'
import {
  AttributeOptions,
  Attributes,
  VariantAttributeOptions as VariantAttributeOptionRaw
} from '@/types/database'

interface VariantAttributeOptionWithDetailsRaw
  extends VariantAttributeOptionRaw {
  attribute_option_value: AttributeOptions['value']
  additional_cost: AttributeOptions['additional_cost']
  attribute_id: AttributeOptions['attribute_id']
  attribute_name: Attributes['name']
  attribute_display_type: Attributes['display_type']
}

export class VariantAttributeOptionRepository {
  public async getVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<VariantAttributeOptionRaw[] | null> {
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query: 'SELECT * FROM variant_attribute_options WHERE variant_id = ?',
      values: [variantId]
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsWithDetailsById(
    variantId: number
  ): Promise<VariantAttributeOptionWithDetailsRaw[] | null> {
    const options = await executeQuery<VariantAttributeOptionWithDetailsRaw[]>({
      query: `
        SELECT 
          vao.variant_id,
          vao.attribute_option_id,
          ao.value as attribute_option_value,
          ao.additional_cost,
          ao.attribute_id,
          a.name as attribute_name,
          a.display_type as attribute_display_type
        FROM variant_attribute_options vao
        JOIN attribute_options ao ON vao.attribute_option_id = ao.id
        JOIN attributes a ON ao.attribute_id = a.id
        WHERE vao.variant_id = ?
        ORDER BY a.id, ao.id
      `,
      values: [variantId]
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<VariantAttributeOptionRaw[] | null> {
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query:
        'SELECT * FROM variant_attribute_options WHERE attribute_option_id = ?',
      values: [attributeOptionId]
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsByVariantIds(
    variantIds: number[]
  ): Promise<VariantAttributeOptionRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query: `SELECT * FROM variant_attribute_options WHERE variant_id IN (${placeholders})`,
      values: variantIds
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsByAttributeOptionIds(
    attributeOptionIds: number[]
  ): Promise<VariantAttributeOptionRaw[] | null> {
    if (attributeOptionIds.length === 0) return null

    const placeholders = attributeOptionIds.map(() => '?').join(',')
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query: `SELECT * FROM variant_attribute_options WHERE attribute_option_id IN (${placeholders})`,
      values: attributeOptionIds
    })

    if (options.length === 0) return null
    return options
  }

  public async createVariantAttributeOption(
    option: VariantAttributeOptionRaw
  ): Promise<VariantAttributeOptionRaw | null> {
    await executeQuery({
      query: 'INSERT INTO variant_attribute_options SET ?',
      values: [option]
    })

    // Como es una tabla de unión, retornamos el objeto insertado
    return option
  }

  public async deleteVariantAttributeOption(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM variant_attribute_options WHERE variant_id = ? AND attribute_option_id = ?',
      values: [variantId, attributeOptionId]
    })
  }

  public async deleteVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_attribute_options WHERE variant_id = ?',
      values: [variantId]
    })
  }

  public async deleteVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM variant_attribute_options WHERE attribute_option_id = ?',
      values: [attributeOptionId]
    })
  }
}

const variantAttributeOptionRepository = new VariantAttributeOptionRepository()
export default variantAttributeOptionRepository
