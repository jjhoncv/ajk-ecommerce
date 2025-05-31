import {
  RatingDTO,
  RatingImageDTO,
  VariantRatingSummaryDTO,
  ProductRatingSummaryDTO,
  RatingSearchResultDTO,
} from "@/dto/rating.dto";
import { executeQuery } from "@/lib/db";

export class RatingModel {
  /**
   * Obtiene todas las valoraciones de una variante
   */
  public async getRatingsByVariantId(
    variantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<RatingSearchResultDTO> {
    const offset = (page - 1) * limit;

    // Obtener las valoraciones
    const ratings = await executeQuery<any[]>({
      query: `
        SELECT 
          vr.*, 
          c.name as customer_name,
          c.photo as customer_photo
        FROM 
          variant_ratings vr
        JOIN
          customers c ON vr.customer_id = c.id
        WHERE 
          vr.variant_id = ?
        ORDER BY 
          vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [variantId, limit, offset],
    });

    // Obtener el total de valoraciones
    const countResult = await executeQuery<[{ total: number }]>({
      query:
        "SELECT COUNT(*) as total FROM variant_ratings WHERE variant_id = ?",
      values: [variantId],
    });
    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Obtener el resumen de valoraciones
    const summary = await this.getVariantRatingSummary(variantId);

    // Obtener las imágenes para cada valoración
    const ratingDTOs = await Promise.all(
      ratings.map(async (rating) => {
        const images = await this.getRatingImages(rating.id);
        return this.mapRatingToDTO(rating, images);
      })
    );

    return {
      ratings: ratingDTOs,
      totalCount,
      page,
      totalPages,
      summary,
    };
  }

  /**
   * Obtiene todas las valoraciones de un producto (todas sus variantes)
   */
  public async getRatingsByProductId(
    productId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<RatingSearchResultDTO> {
    const offset = (page - 1) * limit;

    // Obtener las valoraciones
    const ratings = await executeQuery<any[]>({
      query: `
        SELECT 
          vr.*, 
          c.name as customer_name,
          c.photo as customer_photo
        FROM 
          variant_ratings vr
        JOIN
          product_variants pv ON vr.variant_id = pv.id
        JOIN
          customers c ON vr.customer_id = c.id
        WHERE 
          pv.product_id = ?
        ORDER BY 
          vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [productId, limit, offset],
    });

    // Obtener el total de valoraciones
    const countResult = await executeQuery<[{ total: number }]>({
      query: `
        SELECT 
          COUNT(*) as total 
        FROM 
          variant_ratings vr
        JOIN
          product_variants pv ON vr.variant_id = pv.id
        WHERE 
          pv.product_id = ?
      `,
      values: [productId],
    });
    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Obtener el resumen de valoraciones
    const summary = await this.getProductRatingSummary(productId);

    // Obtener las imágenes para cada valoración
    const ratingDTOs = await Promise.all(
      ratings.map(async (rating) => {
        const images = await this.getRatingImages(rating.id);
        return this.mapRatingToDTO(rating, images);
      })
    );

    return {
      ratings: ratingDTOs,
      totalCount,
      page,
      totalPages,
      summary,
    };
  }

  /**
   * Obtiene una valoración por su ID
   */
  public async getRatingById(id: number): Promise<RatingDTO | null> {
    const ratings = await executeQuery<any[]>({
      query: `
        SELECT 
          vr.*, 
          c.name as customer_name,
          c.photo as customer_photo
        FROM 
          variant_ratings vr
        JOIN
          customers c ON vr.customer_id = c.id
        WHERE 
          vr.id = ?
      `,
      values: [id],
    });

    if (ratings.length === 0) return null;

    const images = await this.getRatingImages(id);
    return this.mapRatingToDTO(ratings[0], images);
  }

  /**
   * Obtiene las imágenes de una valoración
   */
  private async getRatingImages(ratingId: number): Promise<RatingImageDTO[]> {
    const images = await executeQuery<any[]>({
      query: "SELECT * FROM rating_images WHERE rating_id = ?",
      values: [ratingId],
    });

    return images.map((image) => ({
      id: image.id,
      ratingId: image.rating_id,
      imageUrl: image.image_url,
    }));
  }

  /**
   * Obtiene el resumen de valoraciones de una variante
   */
  public async getVariantRatingSummary(
    variantId: number
  ): Promise<VariantRatingSummaryDTO> {
    const summary = await executeQuery<any[]>({
      query: "SELECT * FROM variant_rating_summary WHERE variant_id = ?",
      values: [variantId],
    });

    if (summary.length === 0) {
      return {
        variantId,
        totalRatings: 0,
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
        verifiedPurchases: 0,
      };
    }

    return {
      variantId,
      totalRatings: Number(summary[0].total_ratings),
      averageRating: Number(summary[0].average_rating),
      fiveStar: Number(summary[0].five_star),
      fourStar: Number(summary[0].four_star),
      threeStar: Number(summary[0].three_star),
      twoStar: Number(summary[0].two_star),
      oneStar: Number(summary[0].one_star),
      verifiedPurchases: Number(summary[0].verified_purchases),
    };
  }

  /**
   * Obtiene el resumen de valoraciones de un producto
   */
  public async getProductRatingSummary(
    productId: number
  ): Promise<ProductRatingSummaryDTO> {
    const summary = await executeQuery<any[]>({
      query: "SELECT * FROM product_rating_summary WHERE product_id = ?",
      values: [productId],
    });

    if (summary.length === 0) {
      return {
        productId,
        totalRatings: 0,
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
        verifiedPurchases: 0,
      };
    }

    return {
      productId,
      totalRatings: Number(summary[0].total_ratings),
      averageRating: Number(summary[0].average_rating),
      fiveStar: Number(summary[0].five_star),
      fourStar: Number(summary[0].four_star),
      threeStar: Number(summary[0].three_star),
      twoStar: Number(summary[0].two_star),
      oneStar: Number(summary[0].one_star),
      verifiedPurchases: Number(summary[0].verified_purchases),
    };
  }

  /**
   * Crea una nueva valoración
   */
  public async createRating(
    variantId: number,
    customerId: number,
    rating: number,
    review?: string,
    title?: string,
    verifiedPurchase: boolean = false
  ): Promise<RatingDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO variant_ratings 
        (variant_id, customer_id, rating, review, title, verified_purchase) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [
        variantId,
        customerId,
        rating,
        review,
        title,
        verifiedPurchase ? 1 : 0,
      ],
    });

    return (await this.getRatingById(result.insertId)) as RatingDTO;
  }

  /**
   * Añade una imagen a una valoración
   */
  public async addRatingImage(
    ratingId: number,
    imageUrl: string
  ): Promise<RatingImageDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO rating_images (rating_id, image_url) VALUES (?, ?)",
      values: [ratingId, imageUrl],
    });

    return {
      id: result.insertId,
      ratingId,
      imageUrl,
    };
  }

  /**
   * Elimina una valoración
   */
  public async deleteRating(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM variant_ratings WHERE id = ?",
      values: [id],
    });
  }

  /**
   * Mapea un registro de la base de datos a un DTO de valoración
   */
  private mapRatingToDTO(rating: any, images: RatingImageDTO[]): RatingDTO {
    return {
      id: rating.id,
      variantId: rating.variant_id,
      customerId: rating.customer_id,
      customerName: rating.customer_name,
      customerPhoto: rating.customer_photo,
      rating: rating.rating,
      review: rating.review,
      title: rating.title,
      verifiedPurchase: Boolean(rating.verified_purchase),
      createdAt: new Date(rating.created_at),
      images,
    };
  }
}

export default new RatingModel();
