import { ProductDTO } from "@/dto";
import { VariantProductProps } from "@/interfaces/components/product-card.interface";

/**
 * Hidratador para convertir un ProductDTO a un objeto compatible con el componente ProductCard
 * @param productDTO El DTO del producto que viene de la base de datos
 * @returns Un objeto que cumple con la interfaz ProductProps para el componente ProductCard
 */
export function hydrateProductDTO(productDTO: ProductDTO): VariantProductProps {
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
        })),
        images: variant.images.map((img) => ({
          id: Number(img.id),
          imageUrl: img.imageUrl,
          isPrimary:
            typeof img.isPrimary === "string"
              ? img.isPrimary === "1" || img.isPrimary === "true"
              : Boolean(img.isPrimary),
        })),
      })),
      mainImage: productDTO.mainImage,
    },
    type: "variant",
  };
}

/**
 * Hidratador para convertir un array de ProductDTO a un array de objetos compatibles con el componente ProductCard
 * @param productDTOs Array de DTOs de productos que vienen de la base de datos
 * @returns Un array de objetos que cumplen con la interfaz ProductProps para el componente ProductCard
 */
export function hydrateProductDTOs(
  productDTOs: ProductDTO[]
): VariantProductProps[] {
  return productDTOs.map((productDTO) => hydrateProductDTO(productDTO));
}
