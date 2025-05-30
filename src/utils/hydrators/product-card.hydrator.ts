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
        images: variant.images.map((img) => ({
          id: Number(img.id),
          imageUrl: img.imageUrl,
          isPrimary:
            typeof img.isPrimary === "string"
              ? img.isPrimary === "1" || img.isPrimary === "true"
              : Boolean(img.isPrimary),
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
      })),
      mainImage: productDTO.mainImage,
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
