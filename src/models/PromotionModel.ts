import { executeQuery } from "@/lib/db";
import { promotions as PromotionRaw, promotion_variants as PromotionVariantRaw } from "@/types/database"

export type PromotionVariantMixRawData = Omit<PromotionVariantRaw & {promotion: Omit<PromotionRaw, "created_at" | "updated_at">}, "created_at" | "updated_at">

interface BestPromotionForVariant extends PromotionVariantMixRawData {
  calculated_price: number
}

export class PromotionModel {
  /**
   * Obtiene todas las promociones activas
   */
  public async getActivePromotions(): Promise<Omit<PromotionRaw, "created_at" | "updated_at">[] | null> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const promotions = await executeQuery<PromotionRaw[]>({
      query: `
        SELECT * FROM promotions 
        WHERE is_active = 1 
        AND start_date <= ? 
        AND end_date >= ?
      `,
      values: [now, now],
    });

    if (promotions.length === 0) return null

    return promotions.map(this.mapPromotionToDTO);
  }

  /**
   * Obtiene una promoción por su ID
   */
  public async getPromotionById(id: number): Promise<Omit<PromotionRaw, "created_at" | "updated_at"> | null> {
    const promotions = await executeQuery<PromotionRaw[]>({
      query: "SELECT * FROM promotions WHERE id = ?",
      values: [id],
    });

    if (promotions.length === 0) return null;

    return this.mapPromotionToDTO(promotions[0]);
  }

  /**
   * Obtiene las promociones activas para una variante específica
   */
  public async getPromotionsForVariant(
    variantId: number
  ): Promise<PromotionVariantMixRawData[]> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const promotionVariants = await executeQuery<(PromotionRaw & PromotionVariantRaw)[]>({
      query: `
        SELECT pv.*, p.* FROM promotion_variants pv
        JOIN promotions p ON pv.promotion_id = p.id
        WHERE pv.variant_id = ?
        AND p.is_active = 1
        AND p.start_date <= ?
        AND p.end_date >= ?
      `,
      values: [variantId, now, now],
    });

    if(promotionVariants.length === 0) return []

    return promotionVariants.map((pv) => ({   
        promotion_id: pv.promotion_id,
        variant_id: pv.variant_id,
        promotion_price: pv.promotion_price,
        stock_limit: pv.stock_limit,
        promotion: this.mapPromotionToDTO(pv)
      })
    );
  }

  /**
   * Obtiene la mejor promoción para una variante (la que ofrece el precio más bajo)
   */
  public async getBestPromotionForVariant(
    variantId: number,
    originalPrice: number
  ): Promise<BestPromotionForVariant | null> {
    const promotions = await this.getPromotionsForVariant(variantId);

    if (promotions.length === 0) return null;

    // Calcular el precio final para cada promoción
    const promotionsWithFinalPrice = promotions.map((promo) => {
      let finalPrice: number;

      if (promo.promotion_price !== null) {
        // Si hay un precio de promoción específico, usarlo
        finalPrice = Number(promo.promotion_price);
      } else if (promo.promotion) {
        // Calcular el precio basado en el tipo de descuento
        if (promo.promotion.discount_type === "percentage") {
          finalPrice =
            originalPrice * (1 - Number(promo.promotion.discount_value) / 100);
        } else {
          finalPrice = originalPrice - Number(promo.promotion.discount_value);
        }
        // Asegurar que el precio no sea negativo
        finalPrice = Math.max(finalPrice, 0);
      } else {
        finalPrice = originalPrice;
      }

      return {
        ...promo,
        calculated_price: finalPrice,
      };
    });

    // Ordenar por precio más bajo y devolver la mejor promoción
    promotionsWithFinalPrice.sort(
      (a, b) => a.calculated_price - b.calculated_price
    );

    return promotionsWithFinalPrice[0];
  }

  /**
   * Mapea un registro de la base de datos a un DTO de promoción
   */
  private mapPromotionToDTO(promotion: PromotionRaw): Omit<PromotionRaw, "created_at" | "updated_at"> {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value,
      min_purchase_amount: promotion.min_purchase_amount,
      is_active: promotion.is_active,
    };
  }

  /**
   * Crea una nueva promoción
   */
  public async createPromotion(
    promotionData: Omit<PromotionRaw, "id">
  ): Promise<Omit<PromotionRaw, "created_at" | "updated_at"> | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO promotions 
        (name, description, start_date, end_date, discount_type, discount_value, min_purchase_amount, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        promotionData.name,
        promotionData.description,
        promotionData.start_date,
        promotionData.end_date,
        promotionData.discount_type,
        promotionData.discount_value,
        promotionData.min_purchase_amount,
        promotionData.is_active ? 1 : 0,
      ],
    });

    return (await this.getPromotionById(result.insertId));
  }

  /**
   * Asigna una promoción a una variante de producto
   */
  public async assignPromotionToVariant(
    promotionId: number,
    variantId: number,
    promotionPrice: number | null = null,
    stockLimit: number | null = null
  ): Promise<void> {
    await executeQuery({
      query: `
        INSERT INTO promotion_variants 
        (promotion_id, variant_id, promotion_price, stock_limit) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        promotion_price = VALUES(promotion_price),
        stock_limit = VALUES(stock_limit)
      `,
      values: [promotionId, variantId, promotionPrice, stockLimit],
    });
  }

  /**
   * Elimina una promoción de una variante de producto
   */
  public async removePromotionFromVariant(
    promotionId: number,
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: `
        DELETE FROM promotion_variants 
        WHERE promotion_id = ? AND variant_id = ?
      `,
      values: [promotionId, variantId],
    });
  }
}

const promotionModel = new PromotionModel();
export default promotionModel;
