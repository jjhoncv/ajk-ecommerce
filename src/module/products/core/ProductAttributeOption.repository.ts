import { type ProductAttributeOptions as ProductAttributeOptionRaw } from '@/types/database'
import { executeQuery } from '@/lib/db'

export class ProductAttributeOptionRepository {
  // ============================================================================
  // CRUD BÁSICO
  // ============================================================================

  public async getProductAttributeOptions(): Promise<ProductAttributeOptionRaw[] | null> {
    return await executeQuery<ProductAttributeOptionRaw[]>({
      query: 'SELECT * FROM product_attribute_options ORDER BY product_id, display_order, id',
      values: []
    })
  }

  public async getProductAttributeOptionById(id: number): Promise<ProductAttributeOptionRaw | null> {
    const result = await executeQuery<ProductAttributeOptionRaw[]>({
      query: 'SELECT * FROM product_attribute_options WHERE id = ?',
      values: [id]
    })
    return result[0] || null
  }

  public async getProductAttributeOptionsByProductId(
    productId: number
  ): Promise<ProductAttributeOptionRaw[] | null> {
    return await executeQuery<ProductAttributeOptionRaw[]>({
      query: `
        SELECT * FROM product_attribute_options
        WHERE product_id = ?
        ORDER BY display_order, id
      `,
      values: [productId]
    })
  }

  public async createProductAttributeOption(
    data: {
      product_id: number
      attribute_id: number
      value: string
      display_order?: number
    }
  ): Promise<ProductAttributeOptionRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO product_attribute_options (product_id, attribute_id, value, display_order)
        VALUES (?, ?, ?, ?)
      `,
      values: [
        data.product_id,
        data.attribute_id,
        data.value,
        data.display_order || 0
      ]
    })

    if (!result.insertId) return null
    return await this.getProductAttributeOptionById(result.insertId)
  }

  public async updateProductAttributeOption(
    id: number,
    data: {
      value?: string
      display_order?: number
    }
  ): Promise<ProductAttributeOptionRaw | null> {
    const updates: string[] = []
    const values: any[] = []

    if (data.value !== undefined) {
      updates.push('value = ?')
      values.push(data.value)
    }
    if (data.display_order !== undefined) {
      updates.push('display_order = ?')
      values.push(data.display_order)
    }

    if (updates.length === 0) {
      return await this.getProductAttributeOptionById(id)
    }

    values.push(id)

    await executeQuery({
      query: `UPDATE product_attribute_options SET ${updates.join(', ')} WHERE id = ?`,
      values
    })

    return await this.getProductAttributeOptionById(id)
  }

  public async deleteProductAttributeOption(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_attribute_options WHERE id = ?',
      values: [id]
    })
  }

  // ============================================================================
  // CONSULTAS AVANZADAS
  // ============================================================================

  /**
   * Obtener opciones agrupadas por atributo para un producto
   */
  public async getProductAttributesWithOptions(productId: number): Promise<any> {
    const result = await executeQuery<any[]>({
      query: `
        SELECT
          a.id as attribute_id,
          a.name as attribute_name,
          a.display_type,
          pao.id as option_id,
          pao.value as option_value,
          pao.display_order
        FROM product_attribute_options pao
        JOIN attributes a ON pao.attribute_id = a.id
        WHERE pao.product_id = ?
        ORDER BY a.name, pao.display_order, pao.id
      `,
      values: [productId]
    })

    if (!result || result.length === 0) return []

    // Agrupar por atributo
    const grouped: Record<number, any> = {}

    result.forEach((row: any) => {
      if (!grouped[row.attribute_id]) {
        grouped[row.attribute_id] = {
          id: row.attribute_id,
          name: row.attribute_name,
          displayType: row.display_type,
          options: []
        }
      }

      grouped[row.attribute_id].options.push({
        id: row.option_id,
        value: row.option_value,
        displayOrder: row.display_order
      })
    })

    return Object.values(grouped)
  }

  /**
   * Obtener estadísticas de uso de opciones en variantes
   */
  public async getUsageStats(productId: number): Promise<any> {
    return await executeQuery<any[]>({
      query: `
        SELECT
          pao.id,
          pao.product_id,
          pao.attribute_id,
          a.name as attribute_name,
          a.display_type,
          pao.value as option_value,
          COUNT(DISTINCT vao.variant_id) as variants_using
        FROM product_attribute_options pao
        JOIN attributes a ON pao.attribute_id = a.id
        LEFT JOIN variant_attribute_options vao ON pao.id = vao.product_attribute_option_id
        WHERE pao.product_id = ?
        GROUP BY pao.id
        ORDER BY a.name, pao.display_order, pao.id
      `,
      values: [productId]
    })
  }

  /**
   * Obtener opciones no usadas
   */
  public async getUnusedOptions(productId: number): Promise<any> {
    return await executeQuery<any[]>({
      query: `
        SELECT pao.*
        FROM product_attribute_options pao
        LEFT JOIN variant_attribute_options vao ON pao.id = vao.product_attribute_option_id
        WHERE pao.product_id = ? AND vao.variant_id IS NULL
      `,
      values: [productId]
    })
  }

  /**
   * Limpiar opciones no usadas
   */
  public async cleanUnusedOptions(productId: number): Promise<number> {
    const result = await executeQuery<{ affectedRows: number }>({
      query: `
        DELETE pao FROM product_attribute_options pao
        LEFT JOIN variant_attribute_options vao ON pao.id = vao.product_attribute_option_id
        WHERE pao.product_id = ? AND vao.variant_id IS NULL
      `,
      values: [productId]
    })

    return result.affectedRows || 0
  }

  /**
   * Asignar opciones a un producto (crear múltiples opciones de un atributo)
   */
  public async assignOptionsToProduct(
    productId: number,
    attributeId: number,
    values: string[]
  ): Promise<void> {
    if (values.length === 0) return

    // Crear múltiples opciones para este producto
    const placeholders = values.map(() => '(?, ?, ?)').join(', ')
    const queryValues: any[] = []

    values.forEach((value) => {
      queryValues.push(productId, attributeId, value)
    })

    await executeQuery({
      query: `
        INSERT INTO product_attribute_options (product_id, attribute_id, value)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE value = VALUES(value)
      `,
      values: queryValues
    })
  }
}

const productAttributeOptionRepository = new ProductAttributeOptionRepository()
export default productAttributeOptionRepository
