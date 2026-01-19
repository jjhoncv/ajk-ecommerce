// Module dependencies
import { attributeOptionImageModel } from '@/module/attributes/core'
import { promotionVariantModel } from '@/module/promotions/core'

// Local dependencies
import oVariantAttributeOptionModel from './VariantAttributeOption.model'
import oVariantImageModel from './VariantImage.model'
import oVariantRatingModel from './VariantRating.model'
import { type VariantRatingWithCustomer, VariantRatingSummary } from './VariantRating.interfaces'

import {
  ProductVariantMapper,
  ProductVariantsMapper
} from './ProductVariant.mapper'

import oProductVariantRep from './ProductVariant.repository'

import { type ProductVariants as ProductVariantRaw } from '@/types/database'
import {
  type AttributeOptionImages,
  type ProductAttributeOptionImages,
  type ProductVariants as ProductVariant,
  type VariantAttributeOptions as VariantAttributeOption,
  type VariantAttributeOptions
} from '@/types/domain'

import {
  type ProductVariantComplete,
  type ProductVariantWithAttributeOptions,
  type ProductVariantWithImages
} from './ProductVariant.interfaces'

export class ProductVariantModel {
  public async getProductVariants(): Promise<ProductVariant[] | undefined> {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    return ProductVariantsMapper(variantsRaw)
  }

  public async getProductVariantById(
    id: number
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined
    return ProductVariantMapper(variantRaw)
  }

  public async getProductVariantsByProductId(
    productId: number
  ): Promise<ProductVariant[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductId(productId)
    return ProductVariantsMapper(variantsRaw)
  }

  public async getProductVariantBySku(
    sku: string
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantBySku(sku)
    if (!variantRaw) return undefined
    return ProductVariantMapper(variantRaw)
  }

  public async createProductVariant(
    variantData: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariant | undefined> {
    const created = await oProductVariantRep.createProductVariant(variantData)
    if (!created) return undefined
    return ProductVariantMapper(created)
  }

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
    return ProductVariantMapper(updated)
  }

  public async deleteProductVariant(id: number): Promise<void> {
    await oProductVariantRep.deleteProductVariant(id)
  }

  public async deleteProductVariantsByProductId(
    productId: number
  ): Promise<void> {
    await oProductVariantRep.deleteProductVariantsByProductId(productId)
  }

  public async updateProductVariantStock(
    id: number,
    stock: number
  ): Promise<ProductVariant | undefined> {
    const updated = await oProductVariantRep.updateProductVariantStock(
      id,
      stock
    )
    if (!updated) return undefined
    return ProductVariantMapper(updated)
  }

  public async getProductVariantsWithAttributeOptions(): Promise<
    ProductVariantWithAttributeOptions[] | undefined
  > {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    const variants = ProductVariantsMapper(variantsRaw)

    if (!variants) return undefined

    const variantIds = variants.map((variant) => variant.id)
    const attributeOptionsByVariantId =
      await oVariantAttributeOptionModel.getVariantAttributeOptionsByVariantIds(
        variantIds
      )

    return variants.map((variant) => ({
      ...variant,
      variantAttributeOptions: attributeOptionsByVariantId.get(variant.id) || []
    }))
  }

  public async getProductVariantByIdWithAttributeOptions(
    id: number
  ): Promise<ProductVariantWithAttributeOptions | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = ProductVariantMapper(variantRaw)
    const attributeOptions =
      await oVariantAttributeOptionModel.getVariantAttributeOptionsByVariantId(
        id
      )

    return {
      ...variant,
      variantAttributeOptions: attributeOptions || []
    }
  }

  public async getProductVariantsByProductIdWithAttributeOptions(
    productId: number
  ): Promise<ProductVariantWithAttributeOptions[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductId(productId)
    const variants = ProductVariantsMapper(variantsRaw)

    if (!variants) return undefined

    return await Promise.all(
      variants.map(async (variant) => {
        // Obtener atributos usando composicion con datos completos
        const variantAttributeOptionWithDetails =
          await oVariantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
            variant.id
          )

        const attributeOptions: VariantAttributeOption[] =
          variantAttributeOptionWithDetails?.map((option) => ({
            variantId: option.variantId,
            productAttributeOptionId: option.productAttributeOptionId,
            productAttributeOption: option.productAttributeOption
          })) || []

        return {
          ...variant,
          variantAttributeOptions: attributeOptions
        }
      })
    )
  }

  public async getProductVariantsByProductIds(
    productIds: number[]
  ): Promise<Map<number, ProductVariant[]>> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductIds(productIds)

    if (!variantsRaw) return new Map()

    const variantsByProductId = new Map<number, ProductVariant[]>()

    for (const variantRaw of variantsRaw) {
      const variant = ProductVariantMapper(variantRaw)
      const productId = variant.productId

      if (!variantsByProductId.has(productId)) {
        variantsByProductId.set(productId, [])
      }

      variantsByProductId.get(productId)!.push(variant)
    }

    return variantsByProductId
  }

  public async getProductVariantWithImages(
    id: number
  ): Promise<ProductVariantWithImages | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = ProductVariantMapper(variantRaw)
    const images = await oVariantImageModel.getVariantImages(id)

    return {
      ...variant,
      variantImages: images
    }
  }

  public async getVariantAttributeOptions(
    variantId: number
  ): Promise<VariantAttributeOptions[] | undefined> {
    // Obtener la variante para conocer su productId
    const variant = await this.getProductVariantById(variantId)
    if (!variant) return undefined

    const variantAttributeOptionWithDetails =
      await oVariantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
        variantId
      )

    if (!variantAttributeOptionWithDetails) return undefined

    // Cargar imagenes para cada opcion de atributo
    const attributeOptions = await Promise.all(
      variantAttributeOptionWithDetails.map(async (option) => ({
        variantId: option.variantId,
        productAttributeOptionId: option.productAttributeOptionId,
        additionalCost: option.additionalCost,
        productAttributeOption: {
          ...option.productAttributeOption,
          productAttributeOptionImages:
            await attributeOptionImageModel.getAttributeOptionImages(
              option.productAttributeOptionId,
              variant.productId
            )
        }
      }))
    )
    return attributeOptions as VariantAttributeOptions[]
  }

  public async getProductVariant(
    id: number
  ): Promise<ProductVariantComplete | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = ProductVariantMapper(variantRaw)

    const variantAttributeOptions =
      await productVariantModel.getVariantAttributeOptions(id)

    // Obtener imagenes de la variante
    const variantImages = await oVariantImageModel.getVariantImages(id)

    // Obtener promocion usando composicion
    const promotionsVariant =
      await promotionVariantModel.getPromotionsForVariant(id)

    // Obtener ratings usando composicion
    const ratingSummary = await oVariantRatingModel.getVariantRatingSummary(id)

    const variantRatingSearch =
      await oVariantRatingModel.getRatingsByVariantId(id)

    const variantRatings: VariantRatingWithCustomer[] =
      variantRatingSearch.ratings.map((rating) => ({
        ...rating
      }))

    const result: ProductVariantComplete = {
      ...variant,
      variantAttributeOptions,
      variantImages,
      variantRatings
    }

    // Anadir promocion si existe
    result.promotionVariants = promotionsVariant

    // Anadir ratings si existen
    if (ratingSummary && ratingSummary.totalRatings > 0) {
      result.variantRatingSummary = {
        variantId: ratingSummary.variantId,
        totalRatings: ratingSummary.totalRatings,
        averageRating: ratingSummary.averageRating,
        fiveStar: ratingSummary.fiveStar,
        fourStar: ratingSummary.fourStar,
        threeStar: ratingSummary.threeStar,
        twoStar: ratingSummary.twoStar,
        oneStar: ratingSummary.oneStar,
        verifiedPurchases: ratingSummary.verifiedPurchases
      }
    }

    return result
  }

  // ============================================================================
  // METODOS PARA ATRIBUTOS (delegados al modelo VariantAttributeOption)
  // ============================================================================

  public async addAttributeOptionToVariant(
    variantId: number,
    productAttributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionModel.addAttributeOptionToVariant(
      variantId,
      productAttributeOptionId
    )
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    productAttributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionModel.removeAttributeOptionFromVariant(
      variantId,
      productAttributeOptionId
    )
  }

  // ============================================================================
  // METODOS PARA OBTENER IMAGENES DE ATRIBUTOS (usando composicion)
  // ============================================================================

  private async getAttributeImagesForVariant(
    variantId: number,
    productId: number
  ): Promise<AttributeOptionImages[]> {
    // Obtener los attribute option IDs de esta variante
    const attributeOptions =
      await oVariantAttributeOptionModel.getVariantAttributeOptionsByVariantId(
        variantId
      )

    if (!attributeOptions || attributeOptions.length === 0) {
      return []
    }

    // Obtener todas las opciones de atributos del producto usando el repository
    const productAttributeOptionIds =
      await oProductVariantRep.getAttributeOptionIdsByProductId(productId)

    if (!productAttributeOptionIds || productAttributeOptionIds.length === 0) {
      return []
    }

    const allOptionIds = productAttributeOptionIds.map(
      (row) => row.product_attribute_option_id
    )

    // Usar el modelo de AttributeOptionImage para obtener las imagenes
    const imagesByOptionId =
      await attributeOptionImageModel.getAttributeOptionImagesByOptionIds(
        allOptionIds
      )

    // Convertir el Map a array
    const allImages: ProductAttributeOptionImages[] = []
    imagesByOptionId.forEach((images) => {
      allImages.push(...images)
    })

    return allImages as unknown as AttributeOptionImages[]
  }

  // ============================================================================
  // ALIAS PARA COMPATIBILIDAD CON ProductVariantModel.ts ORIGINAL
  // ============================================================================

  public async getVariants() {
    return await this.getProductVariants()
  }

  public async getVariantById(id: number) {
    return await this.getProductVariant(id)
  }

  public async getVariantsByProductId(productId: number) {
    return await this.getProductVariantsByProductIdWithAttributeOptions(
      productId
    )
  }

  public async createVariant(
    variant: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ) {
    return await this.createProductVariant(variant)
  }

  public async updateVariant(
    variantData: Partial<
      Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ) {
    return await this.updateProductVariant(variantData, id)
  }

  public async deleteVariant(id: number) {
    await this.deleteProductVariant(id)
  }

  /**
   * Actualizar stock de una variante (puede ser positivo o negativo)
   * @param id - ID de la variante
   * @param quantityChange - Cambio en el stock (negativo para reducir, positivo para aumentar)
   */
  public async updateStock(
    id: number,
    quantityChange: number
  ): Promise<ProductVariant | undefined> {
    const updated = await oProductVariantRep.updateStock(id, quantityChange)
    if (!updated) return undefined
    return ProductVariantMapper(updated)
  }

  /**
   * Establecer stock exacto de una variante
   * @param id - ID de la variante
   * @param newStock - Nuevo stock
   */
  public async setStock(
    id: number,
    newStock: number
  ): Promise<ProductVariant | undefined> {
    const updated = await oProductVariantRep.setStock(id, newStock)
    if (!updated) return undefined
    return ProductVariantMapper(updated)
  }

  /**
   * Reducir stock de una variante
   * @param id - ID de la variante
   * @param quantity - Cantidad a reducir
   */
  public async reduceStock(
    id: number,
    quantity: number
  ): Promise<ProductVariant | undefined> {
    return await this.updateStock(id, -quantity)
  }

  /**
   * Aumentar stock de una variante
   * @param id - ID de la variante
   * @param quantity - Cantidad a aumentar
   */
  public async increaseStock(
    id: number,
    quantity: number
  ): Promise<ProductVariant | undefined> {
    return await this.updateStock(id, quantity)
  }

  /**
   * Verificar si hay stock suficiente
   * @param id - ID de la variante
   * @param requiredQuantity - Cantidad requerida
   */
  public async hasEnoughStock(
    id: number,
    requiredQuantity: number
  ): Promise<boolean> {
    const variant = await this.getProductVariantById(id)
    if (!variant) return false
    return variant.stock >= requiredQuantity
  }

  /**
   * Obtener variantes con stock bajo
   * @param threshold - Umbral de stock bajo (por defecto 10)
   */
  public async getVariantsWithLowStock(
    threshold: number = 10
  ): Promise<ProductVariant[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getVariantsWithLowStock(threshold)
    return ProductVariantsMapper(variantsRaw)
  }
}

const productVariantModel = new ProductVariantModel()
export default productVariantModel
