import { executeQuery } from '@/lib/db'
import {
  mapProductVariant,
  mapProductVariants
} from '@/mappers/mapProductVariant'
import attributeOptionImageModel from '@/models/AttributeOptionImage.model'
import promotionVariantModel from '@/models/PromotionVariant.model'
import variantRatingModel from '@/models/VariantRating.model'

import variantAttributeOptionModel from '@/models/VariantAttributeOption.model'
import oProductVariantRep from '@/repository/ProductVariant.repository'
import oVariantAttributeOptionRep from '@/repository/VariantAttributeOption.repository'

import { ProductVariants as ProductVariantRaw } from '@/types/database'
import {
  AttributeOptionImages,
  ProductVariants as ProductVariant,
  VariantAttributeOptions,
  VariantImages,
  VariantImagesImageType
} from '@/types/domain'

export interface ProductVariantWithAttributeOptions extends ProductVariant {
  variantAttributeOptions: VariantAttributeOptions[]
}

export interface ProductVariantWithImages extends ProductVariant {
  variantImages: VariantImages[]
}

export interface ProductVariantComplete extends ProductVariant {
  variantAttributeOptions: VariantAttributeOptions[]
  variantImages: VariantImages[]
  attributeImages: AttributeOptionImages[]
  promotion?: {
    id: number
    name: string
    discountType: 'percentage' | 'fixed_amount'
    discountValue: number
    promotionPrice: number | null
    startDate: Date
    endDate: Date
    stockLimit: number | null
  }
  ratings?: {
    totalRatings: number
    averageRating: number
    fiveStar: number
    fourStar: number
    threeStar: number
    twoStar: number
    oneStar: number
    verifiedPurchases: number
  }
}

export class ProductVariantModel {
  // ============================================================================
  // MÉTODOS BÁSICOS (nueva estructura)
  // ============================================================================

  public async getProductVariants(): Promise<ProductVariant[] | undefined> {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    return mapProductVariants(variantsRaw)
  }

  public async getProductVariantById(
    id: number
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined
    return mapProductVariant(variantRaw)
  }

  public async getProductVariantsByProductId(
    productId: number
  ): Promise<ProductVariant[] | undefined> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductId(productId)
    return mapProductVariants(variantsRaw)
  }

  public async getProductVariantBySku(
    sku: string
  ): Promise<ProductVariant | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantBySku(sku)
    if (!variantRaw) return undefined
    return mapProductVariant(variantRaw)
  }

  public async createProductVariant(
    variantData: Omit<ProductVariantRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProductVariant | undefined> {
    const created = await oProductVariantRep.createProductVariant(variantData)
    if (!created) return undefined
    return mapProductVariant(created)
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
    return mapProductVariant(updated)
  }

  public async deleteProductVariant(id: number): Promise<void> {
    return await oProductVariantRep.deleteProductVariant(id)
  }

  public async deleteProductVariantsByProductId(
    productId: number
  ): Promise<void> {
    return await oProductVariantRep.deleteProductVariantsByProductId(productId)
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
    return mapProductVariant(updated)
  }

  // ============================================================================
  // MÉTODOS CON COMPOSICIÓN (nueva estructura)
  // ============================================================================

  public async getProductVariantsWithAttributeOptions(): Promise<
    ProductVariantWithAttributeOptions[] | undefined
  > {
    const variantsRaw = await oProductVariantRep.getProductVariants()
    const variants = mapProductVariants(variantsRaw)

    if (!variants) return undefined

    const variantIds = variants.map((variant) => variant.id)
    const attributeOptionsByVariantId =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantIds(
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
    console.log('variantRaw', variantRaw, id)
    if (!variantRaw) return undefined

    const variant = mapProductVariant(variantRaw)
    const attributeOptions =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantId(
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
    const variants = mapProductVariants(variantsRaw)

    if (!variants) return undefined

    const variantIds = variants.map((variant) => variant.id)
    const attributeOptionsByVariantId =
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantIds(
        variantIds
      )

    return variants.map((variant) => ({
      ...variant,
      variantAttributeOptions: attributeOptionsByVariantId.get(variant.id) || []
    }))
  }

  public async getProductVariantsByProductIds(
    productIds: number[]
  ): Promise<Map<number, ProductVariant[]>> {
    const variantsRaw =
      await oProductVariantRep.getProductVariantsByProductIds(productIds)

    if (!variantsRaw) return new Map()

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

  // ============================================================================
  // MÉTODOS CON IMÁGENES (usando composición)
  // ============================================================================

  public async getProductVariantWithImages(
    id: number
  ): Promise<ProductVariantWithImages | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = mapProductVariant(variantRaw)
    const images = await this.getVariantImages(id)

    return {
      ...variant,
      variantImages: images
    }
  }

  public async getVariantImages(variantId: number): Promise<VariantImages[]> {
    const images = await executeQuery<
      {
        id: number
        variant_id: number
        image_url_thumb: string
        image_url_normal: string
        image_url_zoom: string
        image_type: VariantImagesImageType
        is_primary: number
        alt_text: string | null
        display_order: number | null
        created_at: Date
        updated_at: Date
      }[]
    >({
      query: `
        SELECT 
          id,
          variant_id,
          image_url_thumb,
          image_url_normal,
          image_url_zoom,
          image_type,
          is_primary,
          alt_text,
          display_order,
          created_at,
          updated_at
        FROM variant_images 
        WHERE variant_id = ?
        ORDER BY display_order ASC, is_primary DESC
      `,
      values: [variantId]
    })

    return images.map((img) => ({
      id: img.id,
      variantId: img.variant_id,
      imageUrlThumb: img.image_url_thumb,
      imageUrlNormal: img.image_url_normal,
      imageUrlZoom: img.image_url_zoom,
      imageType: img.image_type,
      isPrimary: img.is_primary,
      altText: img.alt_text,
      displayOrder: img.display_order,
      createdAt: img.created_at,
      updatedAt: img.updated_at,
      productVariants: undefined
    }))
  }

  // ============================================================================
  // MÉTODOS COMPLETOS (con todo: atributos, imágenes, promociones, ratings)
  // ============================================================================

  public async getProductVariantComplete(
    id: number
  ): Promise<ProductVariantComplete | undefined> {
    const variantRaw = await oProductVariantRep.getProductVariantById(id)
    if (!variantRaw) return undefined

    const variant = mapProductVariant(variantRaw)

    // Obtener atributos usando composición con datos completos
    const attributeOptionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsWithDetailsById(
        id
      )

    // Construir variantAttributeOptions con datos completos
    const attributeOptions =
      attributeOptionsRaw?.map((option: any) => ({
        variantId: option.variant_id,
        attributeOptionId: option.attribute_option_id,
        attributeOptions: [
          {
            id: option.attribute_option_id,
            value: option.attribute_option_value,
            additionalCost: option.additional_cost,
            attributeId: option.attribute_id
          }
        ]
      })) || []

    // Obtener imágenes de la variante
    const images = await this.getVariantImages(id)

    // Obtener imágenes de atributos usando composición
    const attributeImages = await this.getAttributeImagesForVariant(
      id,
      variant.productId
    )

    // Obtener promoción usando composición
    const bestPromotion =
      await promotionVariantModel.getBestPromotionForVariant(id)

    // Obtener ratings usando composición
    const ratingSummary = await variantRatingModel.getVariantRatingSummary(id)

    const result: ProductVariantComplete = {
      ...variant,
      variantAttributeOptions: attributeOptions || [],
      variantImages: images,
      attributeImages
    }

    // Añadir promoción si existe
    if (bestPromotion) {
      let promotionPrice = bestPromotion.promotionPrice

      if (promotionPrice === null || promotionPrice === undefined) {
        // Calcular precio promocional basado en el tipo de descuento
        // Nota: Necesitaríamos acceso a la información de promoción para hacer este cálculo
        // Por ahora, usamos el precio promocional del objeto si existe
        promotionPrice = bestPromotion.promotionPrice || Number(variant.price)
      }

      result.promotion = {
        id: bestPromotion.promotionId,
        name: `Promotion ${bestPromotion.promotionId}`, // Placeholder
        discountType: 'percentage', // Placeholder
        discountValue: 0, // Placeholder
        promotionPrice: promotionPrice,
        startDate: new Date(), // Placeholder
        endDate: new Date(), // Placeholder
        stockLimit: bestPromotion.stockLimit ?? null
      }
    }

    // Añadir ratings si existen
    if (ratingSummary && ratingSummary.totalRatings > 0) {
      result.ratings = {
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
  // MÉTODOS PARA ATRIBUTOS (compatibilidad con ProductVariantModel.ts)
  // ============================================================================

  public async addAttributeOptionToVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (?, ?)',
      values: [variantId, attributeOptionId]
    })
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM variant_attribute_options WHERE variant_id = ? AND attribute_option_id = ?',
      values: [variantId, attributeOptionId]
    })
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
      await variantAttributeOptionModel.getVariantAttributeOptionsByVariantId(
        variantId
      )

    if (!attributeOptions || attributeOptions.length === 0) {
      return []
    }

    // Obtener todas las opciones de atributos del producto para tener más imágenes disponibles
    const productAttributeOptionIds = await executeQuery<
      { attribute_option_id: number }[]
    >({
      query: `
        SELECT DISTINCT vao.attribute_option_id
        FROM variant_attribute_options vao 
        JOIN product_variants pv ON vao.variant_id = pv.id 
        WHERE pv.product_id = ?
      `,
      values: [productId]
    })

    const allOptionIds = productAttributeOptionIds.map(
      (row) => row.attribute_option_id
    )

    if (allOptionIds.length === 0) {
      return []
    }

    // Usar el modelo de AttributeOptionImage para obtener las imágenes
    const imagesByOptionId =
      await attributeOptionImageModel.getAttributeOptionImagesByOptionIds(
        allOptionIds
      )

    // Convertir el Map a array
    const allImages: AttributeOptionImages[] = []
    imagesByOptionId.forEach((images) => {
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
    return await this.getProductVariantComplete(id)
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
    return await this.deleteProductVariant(id)
  }
}

const productVariantModel = new ProductVariantModel()
export default productVariantModel
