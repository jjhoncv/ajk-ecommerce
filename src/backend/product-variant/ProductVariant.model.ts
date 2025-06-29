// others
import oAttributeOptionImageModel from '@/backend/attribute-option-image'
import oPromotionVariantModel from '@/backend/promotion-variant'
import oVariantAttributeOptionModel from '@/backend/variant-attribute-option'
import oVariantImageModel from '@/backend/variant-image'
import oVariantRatingModel, {
  type VariantRatingWithCustomer
} from '@/backend/variant-rating'

// me
import {
  ProductVariantMapper,
  ProductVariantsMapper
} from './ProductVariant.mapper'

import oProductVariantRep from './ProductVariant.repository'

import { type ProductVariants as ProductVariantRaw } from '@/types/database'
import {
  type AttributeOptionImages,
  type ProductVariants as ProductVariant,
  type VariantAttributeOptions as VariantAttributeOption,
  type VariantAttributeOptions
} from '@/types/domain'

import attributeOptionImageModel from '@/backend/attribute-option-image'
import variantAttributeOptionModel from '@/backend/variant-attribute-option'
import variantRatingModel from '@/backend/variant-rating'
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
        // Obtener atributos usando composición con datos completos
        const variantAttributeOptionWithDetails =
          await oVariantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
            variant.id
          )

        const attributeOptions: VariantAttributeOption[] =
          variantAttributeOptionWithDetails?.map((option) => ({
            variantId: option.variantId,
            attributeOptionId: option.attributeOptionId,
            attributeOption: option.attributeOption
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
    const variantAttributeOptionWithDetails =
      await variantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
        variantId
      )

    const attributeOptions: VariantAttributeOptions[] = await Promise.all(
      variantAttributeOptionWithDetails?.map(async (option) => ({
        variantId: option.variantId,
        attributeOptionId: option.attributeOptionId,
        attributeOption: {
          ...option.attributeOption,
          attributeOptionImages:
            await attributeOptionImageModel.getAttributeOptionImages(
              option.attributeOptionId
            ),
          attributeId: Number(option.attributeOption?.attributeId),
          id: Number(option.attributeOption?.id),
          value: option.attributeOption?.value || '',
          attribute: {
            ...option.attributeOption?.attribute,
            id: Number(option.attributeOption?.attribute?.id),
            displayType:
              option.attributeOption?.attribute?.displayType || 'color',
            name: option.attributeOption?.attribute?.name || ''
          }
        }
      })) || []
    )
    return attributeOptions
  }

  public async getProductVariant(
    id: number
  ): Promise<ProductVariantComplete | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = ProductVariantMapper(variantRaw)

    const variantAttributeOptions =
      await productVariantModel.getVariantAttributeOptions(id)

    // Obtener imágenes de la variante
    const variantImages = await oVariantImageModel.getVariantImages(id)

    // Obtener promoción usando composición
    const promotionsVariant =
      await oPromotionVariantModel.getPromotionsForVariant(id)

    // Obtener ratings usando composición
    const ratingSummary = await oVariantRatingModel.getVariantRatingSummary(id)

    const variantRatingSearch =
      await variantRatingModel.getRatingsByVariantId(id)

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

    // Añadir promoción si existe
    // if (bestPromotion) {
    result.promotionVariants = promotionsVariant
    // }

    // Añadir ratings si existen
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
  // MÉTODOS PARA ATRIBUTOS (delegados al modelo VariantAttributeOption)
  // ============================================================================

  public async addAttributeOptionToVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionModel.addAttributeOptionToVariant(
      variantId,
      attributeOptionId
    )
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionModel.removeAttributeOptionFromVariant(
      variantId,
      attributeOptionId
    )
  }

  // ============================================================================
  // MÉTODOS PARA OBTENER IMÁGENES DE ATRIBUTOS (usando composición)
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
      (row) => row.attribute_option_id
    )

    // Usar el modelo de AttributeOptionImage para obtener las imágenes
    const imagesByOptionId =
      await oAttributeOptionImageModel.getAttributeOptionImagesByOptionIds(
        allOptionIds
      )

    // Convertir el Map a array
    const allImages: AttributeOptionImages[] = []
    imagesByOptionId.forEach((images: AttributeOptionImages[]) => {
      allImages.push(...images)
    })

    return allImages
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
    // Necesitarías agregar este método al repository también
    const variantsRaw =
      await oProductVariantRep.getVariantsWithLowStock(threshold)
    return ProductVariantsMapper(variantsRaw)
  }
}

const productVariantModel = new ProductVariantModel()
export default productVariantModel
