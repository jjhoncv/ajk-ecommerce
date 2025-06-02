import { ProductDTO } from "@/dto";

/**
 * Hidratador para convertir un ProductDTO a un objeto compatible con el componente ProductCard
 * @param productDTO El DTO del producto que viene de la base de datos
 * @returns Un objeto que cumple con la interfaz ProductProps para el componente ProductCard
 */
export function hydrateProductDTO(productDTO: ProductDTO): {
  product: ProductDTO;
} {
  return {
    product: {
      id: Number(productDTO.id),
      name: productDTO.name,
      description: productDTO.description,
      brandId: Number(productDTO.brandId),
      brandName: productDTO.brandName,
      basePrice: Number(productDTO.basePrice),
      categories: productDTO.categories.map((category) => ({
        id: Number(category.id),
        name: category.name,
      })),
      variants: productDTO.variants.map((variant) => ({
        id: Number(variant.id),
        productId: Number(variant.productId),
        sku: variant.sku,
        price: Number(variant.price),
        stock: Number(variant.stock),
        attributes: variant.attributes.map((attr) => ({
          id: Number(attr.id),
          name: attr.name,
          value: attr.value,
          optionId: Number(attr.optionId),
          display_type: attr.display_type,
          additional_cost: attr.additional_cost,
        })),
        // Usar el nuevo sistema de imágenes
        images: variant.images.map((img) => ({
          id: Number(img.id),
          variantId: Number(img.variantId),
          imageType: img.imageType,
          imageUrlThumb: img.imageUrlThumb,
          imageUrlNormal: img.imageUrlNormal,
          imageUrlZoom: img.imageUrlZoom,
          isPrimary: Boolean(img.isPrimary),
          displayOrder: Number(img.displayOrder),
          altText: img.altText,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        })),
        // Incluir imágenes de atributos
        attributeImages: variant.attributeImages.map((img) => ({
          id: Number(img.id),
          attributeOptionId: Number(img.attributeOptionId),
          imageUrlThumb: img.imageUrlThumb,
          imageUrlNormal: img.imageUrlNormal,
          imageUrlZoom: img.imageUrlZoom,
          altText: img.altText,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
          attribute: {
            id: Number(img.attribute.id),
            name: img.attribute.name,
            displayType: img.attribute.displayType,
          },
          option: {
            id: Number(img.option.id),
            value: img.option.value,
            additionalCost: Number(img.option.additionalCost),
          },
        })),
        // Incluir información de promoción si existe
        promotion: variant.promotion
          ? {
              id: Number(variant.promotion.id),
              name: variant.promotion.name,
              discountType: variant.promotion.discountType,
              discountValue: Number(variant.promotion.discountValue),
              promotionPrice:
                variant.promotion.promotionPrice !== null
                  ? Number(variant.promotion.promotionPrice)
                  : null,
              startDate: new Date(variant.promotion.startDate),
              endDate: new Date(variant.promotion.endDate),
              stockLimit:
                variant.promotion.stockLimit !== null
                  ? Number(variant.promotion.stockLimit)
                  : null,
            }
          : undefined,
        // Incluir información de ratings si existe
        ratings: variant.ratings
          ? {
              totalRatings: Number(variant.ratings.totalRatings),
              averageRating: Number(variant.ratings.averageRating),
              fiveStar: Number(variant.ratings.fiveStar),
              fourStar: Number(variant.ratings.fourStar),
              threeStar: Number(variant.ratings.threeStar),
              twoStar: Number(variant.ratings.twoStar),
              oneStar: Number(variant.ratings.oneStar),
              verifiedPurchases: Number(variant.ratings.verifiedPurchases),
            }
          : undefined,
      })),
      mainImage: productDTO.mainImage,
      minVariantPrice: Number(
        productDTO.minVariantPrice || productDTO.basePrice
      ),
    },
  };
}

/**
 * Hidratador para convertir un array de ProductDTO a un array de objetos compatibles con el componente ProductCard
 * @param productDTOs Array de DTOs de productos que vienen de la base de datos
 * @returns Un array de objetos que cumplen con la interfaz ProductProps para el componente ProductCard
 */
export function hydrateProductDTOs(
  productDTOs: ProductDTO[]
): { product: ProductDTO }[] {
  return productDTOs.map((productDTO) => hydrateProductDTO(productDTO));
}
