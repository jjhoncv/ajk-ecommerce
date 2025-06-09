import { executeQuery } from '@/lib/db'
import { variant_attribute_options as VariantAttributeOptionRaw } from '@/types/database'

export class VariantAttributeOptionRepository {
  // ✅ Obtener variant attribute options por variant ID
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

  // ✅ Obtener variant attribute options por attribute option ID
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

  // ✅ Obtener variant attribute options por múltiples variant IDs (batch loading)
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

  // ✅ Obtener variant attribute options por múltiples attribute option IDs (batch loading)
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

  // ✅ Crear variant attribute option
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

  // ✅ Eliminar variant attribute option específica
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

  // ✅ Eliminar todas las opciones de un variant
  public async deleteVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_attribute_options WHERE variant_id = ?',
      values: [variantId]
    })
  }

  // ✅ Eliminar todas las referencias a una attribute option
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
