import { ProductVariant } from "@/interfaces/models";
import { ProductVariantDTO } from "@/dto";
import { VariantImageDTO } from "@/dto/image.dto";
import { executeQuery } from "@/lib/db";
import PromotionModel from "./PromotionModel";
import RatingModel from "./RatingModel";

import { product_variants as ProductVariantRaw, 
  variant_images as VariantImageRaw, 
  attribute_option_images as AttributeOptionImageRaw,
  promotions as PromotionRaw,
  variant_ratings as VariantRatingRaw,
  attribute_options as AttributeOptionRaw,
  attributes as Attribute,
  attribute_option_images_image_type as AttributeOptionImagesImageType,
  attributes_display_type as AttributeDisplayType
} from "@/types/database"

interface QueryAttributeOptionRaw {
  attribute_option_id: number;
  attribute_id: number;
  attribute_name: string;
  display_type: string;
  attribute_value: string;
  additional_cost: number | null;
}

interface QueryAttributeImageRaw {
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
  display_type: AttributeDisplayType;
  option_value: string;
  additional_cost: number | null;
  image_type: AttributeOptionImagesImageType
  display_order: number
}

interface AttributeVariant  {
  id: number;
  name: string;
  value: string;
  optionId: number;
  display_type?: string;
  additional_cost?: number;
}

export interface ProductVariantRawData {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: AttributeVariant[];
  images?: VariantImageRaw[];
  // Imágenes de atributos (para selectores de color, etc.)
  attribute_images: VariantAttributeOptionImageRaw[];
  // Información de promoción
  promotion?: PromotionRaw;
  // Información de valoraciones
  ratings?: VariantRatingRaw;
}

interface VariantAttributeOptionImageRaw extends AttributeOptionImageRaw {
  attribute: Attribute
  option: Omit<AttributeOptionRaw, "attribute_id">
}

export class ProductVariantModel {
  public async getVariants(): Promise<ProductVariantDTO[] | null> {
    const variants = await executeQuery<ProductVariantRaw[]>({
      query: "SELECT * FROM product_variants",
    });

    if (variants.length === 0) return null

    return await Promise.all(
      variants.map((variant) => this.mapVariantToDTO(variant))
    );
  }

  public async getVariantById(id: number): Promise<ProductVariantDTO | null> {
    const variants = await executeQuery<ProductVariant[]>({
      query: "SELECT * FROM product_variants WHERE id = ?",
      values: [id],
    });

    if (variants.length === 0) {
      return null;
    }

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
    variant: ProductVariantRawData
  ): Promise<ProductVariantDTO> {
   
    // Obtener los atributos de la variante
    const attributeOptions = await executeQuery<QueryAttributeOptionRaw[]>({
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

    const attributeImages = await executeQuery<QueryAttributeImageRaw[]>({
      query: `
        SELECT DISTINCT
          aoi.id,
          aoi.attribute_option_id,
          aoi.image_url_thumb,
          aoi.image_url_normal,
          aoi.image_url_zoom,
          aoi.alt_text,
          aoi.created_at,
          aoi.image_type,
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
      values: [variant.product_id],
    });

    // Crear el DTO de la variante
    const variantDTO: ProductVariantRawData = {
      id: variant.id,
      product_id: variant.product_id,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      attribute_images: attributeImages.map((img) => ({
        id: img.id,
        attribute_option_id: img.attribute_option_id,
        image_url_thumb: img.image_url_thumb,
        image_url_normal: img.image_url_normal || null,
        image_url_zoom: img.image_url_zoom || null,
        alt_text: img.alt_text || null,
        created_at: new Date(img.created_at),
        updated_at: new Date(img.updated_at),
        image_type: img.image_type,
        display_order: img.display_order,
        attribute: {
          id: img.attribute_id,
          name: img.attribute_name,
          display_type: img.display_type,
        },
        option: {
          id: img.attribute_option_id,
          value: img.option_value,
          additional_cost: img.additional_cost ? Number(img.additional_cost) : 0,
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

    // Obtener la mejor promoción para esta variante
    const bestPromotion = await PromotionModel.getBestPromotionForVariant(
      variant.id,
      Number(variant.price)
    );

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

const productVariantModel = new ProductVariantModel();
export default productVariantModel;
