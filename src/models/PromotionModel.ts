import { PromotionDTO, PromotionVariantDTO } from "@/dto/promotion.dto";
import { executeQuery } from "@/lib/db";

export class PromotionModel {
  /**
   * Obtiene todas las promociones activas
   */
  public async getActivePromotions(): Promise<PromotionDTO[]> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const promotions = await executeQuery<any[]>({
      query: `
        SELECT * FROM promotions 
        WHERE is_active = 1 
        AND start_date <= ? 
        AND end_date >= ?
      `,
      values: [now, now],
    });

    return promotions.map(this.mapPromotionToDTO);
  }

  /**
   * Obtiene una promoción por su ID
   */
  public async getPromotionById(id: number): Promise<PromotionDTO | null> {
    const promotions = await executeQuery<any[]>({
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
  ): Promise<PromotionVariantDTO[]> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const promotionVariants = await executeQuery<any[]>({
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

    return promotionVariants.map((pv) => ({
      promotionId: pv.promotion_id,
      variantId: pv.variant_id,
      promotionPrice: pv.promotion_price,
      stockLimit: pv.stock_limit,
      promotion: this.mapPromotionToDTO(pv),
    }));
  }

  /**
   * Obtiene la mejor promoción para una variante (la que ofrece el precio más bajo)
   */
  public async getBestPromotionForVariant(
    variantId: number,
    originalPrice: number
  ): Promise<PromotionVariantDTO | null> {
    const promotions = await this.getPromotionsForVariant(variantId);

    if (promotions.length === 0) return null;

    // Calcular el precio final para cada promoción
    const promotionsWithFinalPrice = promotions.map((promo) => {
      let finalPrice: number;

      if (promo.promotionPrice !== null) {
        // Si hay un precio de promoción específico, usarlo
        finalPrice = promo.promotionPrice;
      } else if (promo.promotion) {
        // Calcular el precio basado en el tipo de descuento
        if (promo.promotion.discountType === "percentage") {
          finalPrice =
            originalPrice * (1 - promo.promotion.discountValue / 100);
        } else {
          finalPrice = originalPrice - promo.promotion.discountValue;
        }
        // Asegurar que el precio no sea negativo
        finalPrice = Math.max(finalPrice, 0);
      } else {
        finalPrice = originalPrice;
      }

      return {
        ...promo,
        calculatedPrice: finalPrice,
      };
    });

    // Ordenar por precio más bajo y devolver la mejor promoción
    promotionsWithFinalPrice.sort(
      (a, b) => a.calculatedPrice - b.calculatedPrice
    );

    return promotionsWithFinalPrice[0];
  }

  /**
   * Mapea un registro de la base de datos a un DTO de promoción
   */
  private mapPromotionToDTO(promotion: any): PromotionDTO {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      startDate: new Date(promotion.start_date),
      endDate: new Date(promotion.end_date),
      discountType: promotion.discount_type,
      discountValue: Number(promotion.discount_value),
      minPurchaseAmount: promotion.min_purchase_amount
        ? Number(promotion.min_purchase_amount)
        : null,
      isActive: Boolean(promotion.is_active),
    };
  }

  /**
   * Crea una nueva promoción
   */
  public async createPromotion(
    promotionData: Omit<PromotionDTO, "id">
  ): Promise<PromotionDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO promotions 
        (name, description, start_date, end_date, discount_type, discount_value, min_purchase_amount, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        promotionData.name,
        promotionData.description,
        promotionData.startDate,
        promotionData.endDate,
        promotionData.discountType,
        promotionData.discountValue,
        promotionData.minPurchaseAmount,
        promotionData.isActive ? 1 : 0,
      ],
    });

    return this.getPromotionById(result.insertId) as Promise<PromotionDTO>;
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

export default new PromotionModel();
