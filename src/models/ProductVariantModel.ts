import { ProductVariant, VariantImage } from "@/interfaces/models";
import { ProductVariantDTO } from "@/dto";
import { executeQuery } from "@/lib/db";
import PromotionModel from "./PromotionModel";

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

  public async addImageToVariant(
    variantId: number,
    imageUrl: string,
    isPrimary: boolean = false
  ): Promise<void> {
    await executeQuery({
      query:
        "INSERT INTO variant_images (variant_id, image_url, is_primary) VALUES (?, ?, ?)",
      values: [variantId, imageUrl, isPrimary],
    });

    // Si es la imagen principal, actualizar las demás imágenes para que no sean principales
    if (isPrimary) {
      await executeQuery({
        query:
          "UPDATE variant_images SET is_primary = 0 WHERE variant_id = ? AND image_url != ?",
        values: [variantId, imageUrl],
      });
    }
  }

  public async removeImageFromVariant(
    variantId: number,
    imageUrl: string
  ): Promise<void> {
    await executeQuery({
      query:
        "DELETE FROM variant_images WHERE variant_id = ? AND image_url = ?",
      values: [variantId, imageUrl],
    });
  }

  private async mapVariantToDTO(
    variant: ProductVariant
  ): Promise<ProductVariantDTO> {
    // Obtener las imágenes de la variante
    const images = await executeQuery<VariantImage[]>({
      query: "SELECT * FROM variant_images WHERE variant_id = ?",
      values: [variant.id],
    });

    // Obtener los atributos de la variante
    const attributeOptions = await executeQuery<any[]>({
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
      images: images.map((img) => ({
        id: img.id,
        imageUrl: img.image_url,
        isPrimary: Boolean(img.is_primary),
      })),
      attributes,
    };

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
