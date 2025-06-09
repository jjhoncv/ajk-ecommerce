import {
  mapProductVariant,
  mapProductVariants
} from '@/mappers/mapProductVariant'
import variantAttributeOptionModel from '@/models/VariantAttributeOption.model'
import oProductVariantRep from '@/repository/ProductVariant.repository'

import { product_variants as ProductVariantRaw } from '@/types/database'
import {
  ProductVariants as ProductVariant,
  VariantAttributeOptions
} from '@/types/domain'

export interface ProductVariantWithAttributeOptions extends ProductVariant {
  variantAttributeOptions: VariantAttributeOptions[]
}

export class ProductVariantModel {
  // ✅ Obtener todas las variants (SIN relaciones por defecto)
  public async getProductVariants(): Promise<ProductVariant[] | undefined> {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    return mapProductVariants(variantsRaw)
  }

  // ✅ Obtener todas las variants CON attribute options (lógica de negocio)
  public async getProductVariantsWithAttributeOptions(): Promise<
    ProductVariantWithAttributeOptions[] | undefined
  > {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    const variants = mapProductVariants(variantsRaw)

    if (!variants) return undefined

    // Obtener attribute options para todas las variants (batch loading)
    const variantIds = variants.map((variant) => variant.id)
    const attributeOptionsByVariantId =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantIds(
        variantIds
      )

    // Combinar variants con sus attribute options
    return variants.map((variant) => ({
      ...variant,
      variantAttributeOptions: attributeOptionsByVariantId.get(variant.id) || []
    }))
  }

  // ✅ Obtener variant por ID (SIN relaciones por defecto)
  public async getProductVariantById(
    id: number
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)

    if (!variantRaw) return undefined

    return mapProductVariant(variantRaw)
  }

  // ✅ Obtener variant por ID CON attribute options (lógica de negocio)
  public async getProductVariantByIdWithAttributeOptions(
    id: number
  ): Promise<ProductVariantWithAttributeOptions | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)

    if (!variantRaw) return undefined

    const variant = mapProductVariant(variantRaw)

    // Obtener attribute options de la variant
    const attributeOptions =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantId(
        id
      )

    return {
      ...variant,
      variantAttributeOptions: attributeOptions || []
    }
  }

  // ✅ Obtener variants por product ID (SIN relaciones por defecto)
  public async getProductVariantsByProductId(
    productId: number
  ): Promise<ProductVariant[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductId(productId)
    return mapProductVariants(variantsRaw)
  }

  // ✅ Obtener variants por product ID CON attribute options (lógica de negocio)
  public async getProductVariantsByProductIdWithAttributeOptions(
    productId: number
  ): Promise<ProductVariantWithAttributeOptions[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductId(productId)
    const variants = mapProductVariants(variantsRaw)

    if (!variants) return undefined

    // Obtener attribute options para todas las variants (batch loading)
    const variantIds = variants.map((variant) => variant.id)
    const attributeOptionsByVariantId =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantIds(
        variantIds
      )

    // Combinar variants con sus attribute options
    return variants.map((variant) => ({
      ...variant,
      variantAttributeOptions: attributeOptionsByVariantId.get(variant.id) || []
    }))
  }

  // ✅ Obtener variants para múltiples products (batch loading optimizado)
  public async getProductVariantsByProductIds(
    productIds: number[]
  ): Promise<Map<number, ProductVariant[]>> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductIds(productIds)

    if (!variantsRaw) return new Map()

    // Agrupar variants por product_id
    const variantsByProductId = new Map<number, ProductVariant[]>()

    for (const variantRaw of variantsRaw) {
      const variant = mapProductVariant(variantRaw)
      const productId = variant.productId

      if (!variantsByProductId.has(productId)) {
        variantsByProductId.set(productId, [])
      }

      variantsByProductId.get(productId)!.push(variant)
    }

    return variantsByProductId
  }

  // ✅ Buscar variant por SKU
  public async getProductVariantBySku(
    sku: string
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantBySku(sku)

    if (!variantRaw) return undefined

    return mapProductVariant(variantRaw)
  }

  // ✅ Crear variant
  public async createProductVariant(
    variantData: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariant | undefined> {
    const created = await oProductVariantRep.createProductVariant(variantData)

    if (!created) return undefined

    return mapProductVariant(created)
  }

  // ✅ Actualizar variant
  public async updateProductVariant(
    variantData: Partial<
      Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<ProductVariant | undefined> {
    const updated = await oProductVariantRep.updateProductVariant(
      variantData,
      id
    )

    if (!updated) return undefined

    return mapProductVariant(updated)
  }

  // ✅ Eliminar variant
  public async deleteProductVariant(id: number): Promise<void> {
    return await oProductVariantRep.deleteProductVariant(id)
  }

  // ✅ Eliminar todas las variants de un product
  public async deleteProductVariantsByProductId(
    productId: number
  ): Promise<void> {
    return await oProductVariantRep.deleteProductVariantsByProductId(productId)
  }

  // ✅ Actualizar stock de variant
  public async updateProductVariantStock(
    id: number,
    stock: number
  ): Promise<ProductVariant | undefined> {
    const updated = await oProductVariantRep.updateProductVariantStock(
      id,
      stock
    )

    if (!updated) return undefined

    return mapProductVariant(updated)
  }
}

const productVariantModel = new ProductVariantModel()
export default productVariantModel
