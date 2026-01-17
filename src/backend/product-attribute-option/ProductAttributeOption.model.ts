import { type ProductAttributeOptions as ProductAttributeOptionRaw } from '@/types/database'
import { type ProductAttributeOptions as ProductAttributeOption } from '@/types/domain'
import {
  ProductAttributeOptionMapper,
  ProductAttributeOptionsMapper
} from './ProductAttributeOption.mapper'
import productAttributeOptionRepository from './ProductAttributeOption.repository'

export class ProductAttributeOptionModel {
  // ============================================================================
  // MÉTODOS BÁSICOS CRUD
  // ============================================================================

  public async getProductAttributeOptions(): Promise<ProductAttributeOption[] | undefined> {
    const data = await productAttributeOptionRepository.getProductAttributeOptions()
    return ProductAttributeOptionsMapper(data)
  }

  public async getProductAttributeOptionById(
    id: number
  ): Promise<ProductAttributeOption | undefined> {
    const data = await productAttributeOptionRepository.getProductAttributeOptionById(id)
    if (!data) return undefined
    return ProductAttributeOptionMapper(data)
  }

  public async getProductAttributeOptionsByProductId(
    productId: number
  ): Promise<ProductAttributeOption[] | undefined> {
    const data = await productAttributeOptionRepository.getProductAttributeOptionsByProductId(
      productId
    )
    return ProductAttributeOptionsMapper(data)
  }

  public async createProductAttributeOption(data: {
    product_id: number
    attribute_id: number
    value: string
    display_order?: number
  }): Promise<ProductAttributeOption | undefined> {
    const created = await productAttributeOptionRepository.createProductAttributeOption(data)
    if (!created) return undefined
    return ProductAttributeOptionMapper(created)
  }

  public async updateProductAttributeOption(
    id: number,
    data: {
      value?: string
      display_order?: number
    }
  ): Promise<ProductAttributeOption | undefined> {
    const updated = await productAttributeOptionRepository.updateProductAttributeOption(id, data)
    if (!updated) return undefined
    return ProductAttributeOptionMapper(updated)
  }

  public async deleteProductAttributeOption(id: number): Promise<void> {
    await productAttributeOptionRepository.deleteProductAttributeOption(id)
  }

  // ============================================================================
  // CONSULTAS AVANZADAS
  // ============================================================================

  /**
   * Obtiene las opciones agrupadas por atributo para un producto
   * Retorna estructura: [ { id, name, displayType, options: [{id, value}] } ]
   */
  public async getProductAttributesWithOptions(productId: number): Promise<any[] | undefined> {
    return await productAttributeOptionRepository.getProductAttributesWithOptions(productId)
  }

  /**
   * Obtiene estadísticas de uso de cada opción
   * Muestra cuántas variantes usan cada opción
   */
  public async getUsageStats(productId: number): Promise<any[] | undefined> {
    return await productAttributeOptionRepository.getUsageStats(productId)
  }

  /**
   * Obtiene opciones no usadas (sin variantes)
   */
  public async getUnusedOptions(productId: number): Promise<any[] | undefined> {
    return await productAttributeOptionRepository.getUnusedOptions(productId)
  }

  /**
   * Limpia opciones no usadas de un producto
   * ADVERTENCIA: Elimina opciones que no están en ninguna variante
   */
  public async cleanUnusedOptions(productId: number): Promise<number> {
    return await productAttributeOptionRepository.cleanUnusedOptions(productId)
  }

  /**
   * Asigna múltiples opciones de un atributo al producto
   */
  public async assignOptionsToProduct(
    productId: number,
    attributeId: number,
    values: string[]
  ): Promise<void> {
    await productAttributeOptionRepository.assignOptionsToProduct(productId, attributeId, values)
  }
}

const productAttributeOptionModel = new ProductAttributeOptionModel()
export default productAttributeOptionModel
