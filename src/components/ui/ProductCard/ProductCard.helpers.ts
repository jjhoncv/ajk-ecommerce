import { ProductDTO } from "@/dto";

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

  const prices = variants.map((variant) => {
    // Si hay promoción, usar el precio promocional
    if (variant.promotion && variant.promotion.promotionPrice !== null) {
      return Number(variant.promotion.promotionPrice);
    }
    return Number(variant.price);
  });

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
 * Verifica si una variante tiene promoción
 * @param variant Variante a verificar
 * @returns true si la variante tiene promoción
 */
export const hasPromotion = (variant: ProductDTO["variants"][0]): boolean => {
  return !!variant.promotion;
};

/**
 * Calcula el precio final de una variante considerando promociones
 * @param variant Variante a calcular
 * @returns El precio final de la variante
 */
export const calculateFinalPrice = (
  variant: ProductDTO["variants"][0]
): number => {
  if (variant.promotion && variant.promotion.promotionPrice !== null) {
    return Number(variant.promotion.promotionPrice);
  }
  return Number(variant.price);
};

/**
 * Calcula el porcentaje de descuento de una variante
 * @param variant Variante a calcular
 * @returns El porcentaje de descuento o 0 si no hay promoción
 */
export const calculateDiscountPercentage = (
  variant: ProductDTO["variants"][0]
): number => {
  if (!variant.promotion) return 0;

  if (variant.promotion.discountType === "percentage") {
    return variant.promotion.discountValue;
  }

  const originalPrice = Number(variant.price);
  const promotionPrice =
    variant.promotion.promotionPrice ||
    originalPrice - variant.promotion.discountValue;

  return Math.round(((originalPrice - promotionPrice) / originalPrice) * 100);
};
