import { executeQuery } from '@/lib/db'
import { ProductVariants as ProductVariantRaw } from '@/types/database'

export class ProductVariantRepository {
  public async getProductVariants(): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants ORDER BY id ASC'
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantById(
    id: number
  ): Promise<ProductVariantRaw | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants WHERE id = ?',
      values: [id]
    })

    if (variants.length === 0) return null
    return variants[0]
  }

  public async getProductVariantsByProductId(
    productId: number
  ): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query:
        'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC',
      values: [productId]
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantsByProductIds(
    productIds: number[]
  ): Promise<ProductVariantRaw[] | null> {
    if (productIds.length === 0) return null

    const placeholders = productIds.map(() => '?').join(',')
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) ORDER BY product_id, id ASC`,
      values: productIds
    })

    if (variants.length === 0) return null
    return variants
  }

  public async getProductVariantBySku(
    sku: string
  ): Promise<ProductVariantRaw | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: 'SELECT * FROM product_variants WHERE sku = ?',
      values: [sku]
    })

    if (variants.length === 0) return null
    return variants[0]
  }

  public async createProductVariant(
    variant: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariantRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO product_variants SET ?',
      values: [variant]
    })

    return await this.getProductVariantById(result.insertId)
  }

  public async updateProductVariant(
    variantData: Partial<
      Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<ProductVariantRaw | null> {
    await executeQuery({
      query: 'UPDATE product_variants SET ? WHERE id = ?',
      values: [variantData, id]
    })

    return await this.getProductVariantById(id)
  }

  public async deleteProductVariant(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_variants WHERE id = ?',
      values: [id]
    })
  }

  public async deleteProductVariantsByProductId(
    productId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM product_variants WHERE product_id = ?',
      values: [productId]
    })
  }

  public async updateProductVariantStock(
    id: number,
    stock: number
  ): Promise<ProductVariantRaw | null> {
    await executeQuery({
      query: 'UPDATE product_variants SET stock = ? WHERE id = ?',
      values: [stock, id]
    })

    return await this.getProductVariantById(id)
  }

  public async getAttributeOptionIdsByProductId(
    productId: number
  ): Promise<{ attribute_option_id: number }[] | null> {
    const optionIds = await executeQuery<{ attribute_option_id: number }[]>({
      query: `
        SELECT DISTINCT vao.attribute_option_id
        FROM variant_attribute_options vao 
        JOIN product_variants pv ON vao.variant_id = pv.id 
        WHERE pv.product_id = ?
      `,
      values: [productId]
    })

    if (optionIds.length === 0) return null
    return optionIds
  }

  /**
   * Actualizar stock de una variante (con validación de stock mínimo)
   */
  public async updateStock(
    id: number,
    quantityChange: number
  ): Promise<ProductVariantRaw | null> {
    try {
      // Primero verificar el stock actual
      const currentVariant = await this.getProductVariantById(id)
      if (!currentVariant) {
        throw new Error('Variante no encontrada')
      }

      const newStock = currentVariant.stock + quantityChange
      if (newStock < 0) {
        throw new Error(
          `Stock insuficiente. Stock actual: ${currentVariant.stock}, cantidad solicitada: ${Math.abs(quantityChange)}`
        )
      }

      // Actualizar el stock
      await executeQuery({
        query:
          'UPDATE product_variants SET stock = ?, updated_at = NOW() WHERE id = ?',
        values: [newStock, id]
      })

      return await this.getProductVariantById(id)
    } catch (error) {
      console.error('Error updating stock:', error)
      throw error
    }
  }

  /**
   * Establecer stock exacto
   */
  public async setStock(
    id: number,
    newStock: number
  ): Promise<ProductVariantRaw | null> {
    if (newStock < 0) {
      throw new Error('El stock no puede ser negativo')
    }

    await executeQuery({
      query:
        'UPDATE product_variants SET stock = ?, updated_at = NOW() WHERE id = ?',
      values: [newStock, id]
    })

    return await this.getProductVariantById(id)
  }

  /**
   * Obtener variantes con stock bajo
   */
  public async getVariantsWithLowStock(
    threshold: number = 10
  ): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query:
        'SELECT * FROM product_variants WHERE stock <= ? ORDER BY stock ASC',
      values: [threshold]
    })

    if (variants.length === 0) return null
    return variants
  }

  /**
   * Obtener variantes sin stock
   */
  public async getOutOfStockVariants(): Promise<ProductVariantRaw[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query:
        'SELECT * FROM product_variants WHERE stock = 0 ORDER BY updated_at DESC'
    })

    if (variants.length === 0) return null
    return variants
  }

  /**
   * Actualizar múltiples stocks en una transacción
   */
  public async updateMultipleStocks(
    updates: Array<{ id: number; quantityChange: number }>
  ): Promise<boolean> {
    try {
      // Verificar que todos los productos tienen stock suficiente antes de actualizar
      for (const update of updates) {
        const variant = await this.getProductVariantById(update.id)
        if (!variant) {
          throw new Error(`Variante ${update.id} no encontrada`)
        }

        if (variant.stock + update.quantityChange < 0) {
          throw new Error(
            `Stock insuficiente para variante ${update.id}. Stock actual: ${variant.stock}, cantidad solicitada: ${Math.abs(update.quantityChange)}`
          )
        }
      }

      // Si todas las validaciones pasan, actualizar todos los stocks
      for (const update of updates) {
        await executeQuery({
          query:
            'UPDATE product_variants SET stock = stock + ?, updated_at = NOW() WHERE id = ?',
          values: [update.quantityChange, update.id]
        })
      }

      return true
    } catch (error) {
      console.error('Error updating multiple stocks:', error)
      throw error
    }
  }

  /**
   * Reservar stock (marcar como pendiente)
   * Nota: Esto requeriría una columna adicional 'reserved_stock' en la tabla
   */
  public async reserveStock(
    id: number,
    quantity: number
  ): Promise<ProductVariantRaw | null> {
    const variant = await this.getProductVariantById(id)
    if (!variant) {
      throw new Error('Variante no encontrada')
    }

    // Verificar stock disponible (asumiendo que tienes una columna reserved_stock)
    // const availableStock = variant.stock - (variant.reserved_stock || 0)
    const availableStock = variant.stock // Por ahora usar solo stock total

    if (availableStock < quantity) {
      throw new Error(
        `Stock insuficiente para reservar. Disponible: ${availableStock}, solicitado: ${quantity}`
      )
    }

    // Por ahora solo reducimos el stock directamente
    // En una implementación más compleja, tendrías una columna reserved_stock
    return await this.updateStock(id, -quantity)
  }
}

const productVariantRepository = new ProductVariantRepository()
export default productVariantRepository
