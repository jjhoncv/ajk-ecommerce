import { ProductDTO } from "@/dto";
import {
  RegularProduct,
  DealProduct,
  VariantProduct,
} from "./ProductCard.interfaces";

/**
 * Calcula el precio mínimo de las variantes de un producto
 * @param variants Variantes del producto
 * @param basePrice Precio base del producto
 * @returns El precio mínimo de las variantes o el precio base si no hay variantes
 */
export const calculateMinVariantPrice = (
  variants: ProductDTO["variants"],
  basePrice: number
): number => {
  if (!variants || variants.length === 0) return basePrice;

  const prices = variants.map((variant) => Number(variant.price));
  return Math.min(...prices);
};

/**
 * Calcula el precio máximo de las variantes de un producto
 * @param variants Variantes del producto
 * @param basePrice Precio base del producto
 * @returns El precio máximo de las variantes o el precio base si no hay variantes
 */
export const calculateMaxVariantPrice = (
  variants: ProductDTO["variants"],
  basePrice: number
): number => {
  if (!variants || variants.length === 0) return basePrice;

  const prices = variants.map((variant) => Number(variant.price));
  return Math.max(...prices);
};

/**
 * Agrupa los atributos de las variantes por nombre
 * @param variants Variantes del producto
 * @returns Un objeto con los atributos agrupados por nombre
 */
export const groupAttributesByName = (
  variants: ProductDTO["variants"]
): { [key: string]: Set<string> } => {
  const attributeGroups: { [key: string]: Set<string> } = {};

  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!attributeGroups[attr.name]) {
        attributeGroups[attr.name] = new Set();
      }
      attributeGroups[attr.name].add(attr.value);
    });
  });

  return attributeGroups;
};

/**
 * Encuentra la imagen principal de una variante
 * @param variant Variante del producto
 * @param mainProductImage Imagen principal del producto
 * @returns La URL de la imagen principal
 */
export const findMainImage = (
  variant: ProductDTO["variants"][0],
  mainProductImage: string | null
): string => {
  if (!variant || !variant.images || variant.images.length === 0) {
    return (
      mainProductImage ||
      "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image"
    );
  }

  const primaryImage = variant.images.find((img) => img.isPrimary);
  return primaryImage ? primaryImage.imageUrl : variant.images[0].imageUrl;
};

/**
 * Verifica si un producto es de tipo variante
 * @param product Producto a verificar
 * @returns true si el producto es de tipo variante
 */
export const isVariantProduct = (
  product: RegularProduct | DealProduct | VariantProduct
): product is VariantProduct => {
  return product.type === "variant";
};

/**
 * Verifica si un producto es de tipo oferta
 * @param product Producto a verificar
 * @returns true si el producto es de tipo oferta
 */
export const isDealProduct = (
  product: RegularProduct | DealProduct | VariantProduct
): product is DealProduct => {
  return product.type === "deal";
};

/**
 * Verifica si un producto es de tipo regular
 * @param product Producto a verificar
 * @returns true si el producto es de tipo regular
 */
export const isRegularProduct = (
  product: RegularProduct | DealProduct | VariantProduct
): product is RegularProduct => {
  return product.type === "regular";
};
