import { ProductVariant } from "@/interfaces/models";
import { ProductVariantDTO } from "@/dto";
import { VariantImageDTO } from "@/dto/image.dto";
import { executeQuery } from "@/lib/db";
import PromotionModel from "./PromotionModel";
import RatingModel from "./RatingModel";

export class ProductVariantModel {
  public async getVariants(): Promise<ProductVariantDTO[]> {
    const variants = await executeQuery<ProductVariant[]>({
      query: "SELECT * FROM product_variants",
    });

    return await Promise.all(
      variants.map((variant) => this.mapVariantToDTO(variant))
    );
  }

  public async getVariantById(id: number): Promise<ProductVariantDTO | null> {
    const variants = await executeQuery<ProductVariant[]>({
      query: "SELECT * FROM product_variants WHERE id = ?",
      values: [id],
    });

    if (variants.length === 0) return null;

    return await this.mapVariantToDTO(variants[0]);
  }

  public async getVariantsByProductId(
    productId: number
  ): Promise<ProductVariantDTO[]> {
    const variants = await executeQuery<ProductVariant[]>({
      query: "SELECT * FROM product_variants WHERE product_id = ?",
      values: [productId],
    });

    return await Promise.all(
      variants.map((variant) => this.mapVariantToDTO(variant))
    );
  }

  public async createVariant(
    variant: Omit<ProductVariant, "id">
  ): Promise<ProductVariantDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO product_variants SET ?",
      values: [variant],
    });

    return (await this.getVariantById(result.insertId)) as ProductVariantDTO;
  }

  public async updateVariant(
    variantData: Partial<ProductVariant>,
    id: number
  ): Promise<ProductVariantDTO> {
    await executeQuery({
      query: "UPDATE product_variants SET ? WHERE id=?",
      values: [variantData, id],
    });

    return (await this.getVariantById(id)) as ProductVariantDTO;
  }

  public async deleteVariant(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM product_variants WHERE id=?",
      values: [id],
    });
  }

  public async addAttributeOptionToVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        "INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (?, ?)",
      values: [variantId, attributeOptionId],
    });
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    await executeQuery({
      query:
        "DELETE FROM variant_attribute_options WHERE variant_id = ? AND attribute_option_id = ?",
      values: [variantId, attributeOptionId],
    });
  }

  private async mapVariantToDTO(
    variant: ProductVariant & { product_id?: number }
  ): Promise<ProductVariantDTO> {
    // Obtener las imágenes de la variante (SOLO nuevo sistema)
    const images = await executeQuery<
      {
        id: number;
        variant_id: number;
        image_type: string;
        image_url_thumb: string;
        image_url_normal: string;
        image_url_zoom: string;
        is_primary: number;
        display_order: number;
        alt_text: string | null;
        created_at: string;
        updated_at: string;
      }[]
    >({
      query:
        "SELECT * FROM variant_images WHERE variant_id = ? ORDER BY display_order ASC, is_primary DESC",
      values: [variant.id],
    });

    // Convertir imágenes al formato DTO
    const variantImages: VariantImageDTO[] = images.map((img) => ({
      id: img.id,
      variantId: img.variant_id,
      imageType: img.image_type as VariantImageDTO["imageType"],
      imageUrlThumb: img.image_url_thumb,
      imageUrlNormal: img.image_url_normal,
      imageUrlZoom: img.image_url_zoom,
      isPrimary: Boolean(img.is_primary),
      displayOrder: img.display_order,
      altText: img.alt_text || undefined,
      createdAt: new Date(img.created_at),
      updatedAt: new Date(img.updated_at),
    }));

    // Obtener los atributos de la variante
    const attributeOptions = await executeQuery<
      {
        attribute_option_id: number;
        attribute_id: number;
        attribute_name: string;
        display_type: string;
        attribute_value: string;
        additional_cost: number | null;
      }[]
    >({
      query: `
        SELECT 
          vao.attribute_option_id,
          a.id as attribute_id,
          a.name as attribute_name,
          a.display_type,
          ao.value as attribute_value,
          ao.additional_cost
        FROM 
          variant_attribute_options vao
        JOIN 
          attribute_options ao ON vao.attribute_option_id = ao.id
        JOIN 
          attributes a ON ao.attribute_id = a.id
        WHERE 
          vao.variant_id = ?
      `,
      values: [variant.id],
    });

    // Agrupar atributos
    const attributes = attributeOptions.map((option) => ({
      id: option.attribute_id,
      name: option.attribute_name,
      value: option.attribute_value,
      optionId: option.attribute_option_id,
      display_type: option.display_type,
      additional_cost: option.additional_cost
        ? Number(option.additional_cost)
        : undefined,
    }));

    const attributeImages = await executeQuery<
      {
        id: number;
        attribute_option_id: number;
        image_url_thumb: string;
        image_url_normal: string | null;
        image_url_zoom: string | null;
        alt_text: string | null;
        created_at: string;
        updated_at: string;
        attribute_id: number;
        attribute_name: string;
        display_type: string;
        option_value: string;
        additional_cost: number | null;
      }[]
    >({
      query: `
        SELECT DISTINCT
          aoi.id,
          aoi.attribute_option_id,
          aoi.image_url_thumb,
          aoi.image_url_normal,
          aoi.image_url_zoom,
          aoi.alt_text,
          aoi.created_at,
          aoi.updated_at,
          a.id as attribute_id,
          a.name as attribute_name,
          a.display_type,
          ao.value as option_value,
          ao.additional_cost
        FROM 
          attribute_option_images aoi
        JOIN 
          attribute_options ao ON aoi.attribute_option_id = ao.id
        JOIN 
          attributes a ON ao.attribute_id = a.id
        WHERE 
          aoi.attribute_option_id IN (
            SELECT DISTINCT vao.attribute_option_id 
            FROM variant_attribute_options vao 
            JOIN product_variants pv ON vao.variant_id = pv.id 
            WHERE pv.product_id = ?
          )
      `,
      values: [variant.productId || variant.product_id],
    });

    // Obtener la mejor promoción para esta variante
    const bestPromotion = await PromotionModel.getBestPromotionForVariant(
      variant.id,
      Number(variant.price)
    );

    // Crear el DTO de la variante
    const variantDTO: ProductVariantDTO = {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      images: variantImages,
      attributeImages: attributeImages.map((img) => ({
        id: img.id,
        attributeOptionId: img.attribute_option_id,
        imageUrlThumb: img.image_url_thumb,
        imageUrlNormal: img.image_url_normal || undefined,
        imageUrlZoom: img.image_url_zoom || undefined,
        altText: img.alt_text || undefined,
        createdAt: new Date(img.created_at),
        updatedAt: new Date(img.updated_at),
        attribute: {
          id: img.attribute_id,
          name: img.attribute_name,
          displayType: img.display_type,
        },
        option: {
          id: img.attribute_option_id,
          value: img.option_value,
          additionalCost: img.additional_cost ? Number(img.additional_cost) : 0,
        },
      })),
      attributes,
    };

    // Obtener el resumen de valoraciones para esta variante
    const ratingSummary = await RatingModel.getVariantRatingSummary(variant.id);

    // Añadir información de valoraciones si existen
    if (ratingSummary.totalRatings > 0) {
      variantDTO.ratings = {
        totalRatings: ratingSummary.totalRatings,
        averageRating: ratingSummary.averageRating,
        fiveStar: ratingSummary.fiveStar,
        fourStar: ratingSummary.fourStar,
        threeStar: ratingSummary.threeStar,
        twoStar: ratingSummary.twoStar,
        oneStar: ratingSummary.oneStar,
        verifiedPurchases: ratingSummary.verifiedPurchases,
      };
    }

    // Añadir información de promoción si existe
    if (bestPromotion && bestPromotion.promotion) {
      // Calcular el precio promocional si no está explícitamente definido
      let promotionPrice = bestPromotion.promotionPrice;

      if (promotionPrice === null && bestPromotion.promotion) {
        if (bestPromotion.promotion.discountType === "percentage") {
          promotionPrice =
            Number(variant.price) *
            (1 - bestPromotion.promotion.discountValue / 100);
        } else {
          promotionPrice =
            Number(variant.price) - bestPromotion.promotion.discountValue;
        }
        // Asegurar que el precio no sea negativo
        promotionPrice = Math.max(promotionPrice, 0);
      }

      variantDTO.promotion = {
        id: bestPromotion.promotion.id,
        name: bestPromotion.promotion.name,
        discountType: bestPromotion.promotion.discountType,
        discountValue: bestPromotion.promotion.discountValue,
        promotionPrice: promotionPrice,
        startDate: bestPromotion.promotion.startDate,
        endDate: bestPromotion.promotion.endDate,
        stockLimit: bestPromotion.stockLimit,
      };
    }

    return variantDTO;
  }
}

export default new ProductVariantModel();
