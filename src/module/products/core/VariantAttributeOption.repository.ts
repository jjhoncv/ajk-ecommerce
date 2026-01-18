import { executeQuery } from '@/lib/db'
import {
  type ProductAttributeOptions,
  type Attributes,
  type VariantAttributeOptions as VariantAttributeOptionRaw
} from '@/types/database'

export interface VariantAttributeOptionWithDetailsRaw
  extends VariantAttributeOptionRaw {
  attribute_option_value: ProductAttributeOptions['value']
  variant_additional_cost: VariantAttributeOptionRaw['additional_cost']
  attribute_id: ProductAttributeOptions['attribute_id']
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
          vao.product_attribute_option_id,
          vao.additional_cost as variant_additional_cost,
          pao.value as attribute_option_value,
          pao.attribute_id,
          a.name as attribute_name,
          a.display_type as attribute_display_type
        FROM variant_attribute_options vao
        JOIN product_attribute_options pao ON vao.product_attribute_option_id = pao.id
        JOIN attributes a ON pao.attribute_id = a.id
        WHERE vao.variant_id = ?
        ORDER BY a.id, pao.id
      `,
      values: [variantId]
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsByProductAttributeOptionId(
    productAttributeOptionId: number
  ): Promise<VariantAttributeOptionRaw[] | null> {
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query:
        'SELECT * FROM variant_attribute_options WHERE product_attribute_option_id = ?',
      values: [productAttributeOptionId]
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

  public async getVariantAttributeOptionsWithDetailsByIds(
    variantIds: number[]
  ): Promise<VariantAttributeOptionWithDetailsRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const options = await executeQuery<VariantAttributeOptionWithDetailsRaw[]>({
      query: `
        SELECT
          vao.variant_id,
          vao.product_attribute_option_id,
          vao.additional_cost as variant_additional_cost,
          pao.value as attribute_option_value,
          pao.attribute_id,
          a.name as attribute_name,
          a.display_type as attribute_display_type
        FROM variant_attribute_options vao
        JOIN product_attribute_options pao ON vao.product_attribute_option_id = pao.id
        JOIN attributes a ON pao.attribute_id = a.id
        WHERE vao.variant_id IN (${placeholders})
        ORDER BY a.id, pao.id
      `,
      values: variantIds
    })

    if (options.length === 0) return null
    return options
  }

  public async getVariantAttributeOptionsByProductAttributeOptionIds(
    productAttributeOptionIds: number[]
  ): Promise<VariantAttributeOptionRaw[] | null> {
    if (productAttributeOptionIds.length === 0) return null

    const placeholders = productAttributeOptionIds.map(() => '?').join(',')
    const options = await executeQuery<VariantAttributeOptionRaw[]>({
      query: `SELECT * FROM variant_attribute_options WHERE product_attribute_option_id IN (${placeholders})`,
      values: productAttributeOptionIds
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
    productAttributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM variant_attribute_options WHERE variant_id = ? AND product_attribute_option_id = ?',
      values: [variantId, productAttributeOptionId]
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

  public async deleteVariantAttributeOptionsByProductAttributeOptionId(
    productAttributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM variant_attribute_options WHERE product_attribute_option_id = ?',
      values: [productAttributeOptionId]
    })
  }
}

const variantAttributeOptionRepository = new VariantAttributeOptionRepository()
export default variantAttributeOptionRepository
