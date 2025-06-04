// Interfaces para los modelos de datos
import { AttributeDisplayType } from "@/dto/attribute.dto";

// Marca
export interface Brand {
  id: number;
  name: string;
}

// Categoría
export interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  imageUrl: string | null;
  children?: Category[];
}

// Atributo
export interface Attribute {
  id: number;
  name: string;
  display_type?: AttributeDisplayType;
  options?: AttributeOption[];
}

// Opción de atributo
export interface AttributeOption {
  id: number;
  attributeId: number;
  value: string;
  additional_cost?: number;
}

// Producto
export interface Product {
  id: number;
  name: string;
  description: string | null;
  brand_id: number;
  brand?: Brand;
  base_price: number;
  categories?: Category[];
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

// Variante de producto
export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  attributeOptions?: AttributeOption[];
  images?: VariantImage[];
  createdAt: Date;
  updatedAt: Date;
}

// Imagen de variante
export interface VariantImage {
  id: number;
  variant_id: number;
  image_url: string;
  is_primary: boolean;
}

// Relación producto-categoría
export interface ProductCategory {
  productId: number;
  categoryId: number;
}

// Relación variante-atributo-opción
export interface VariantAttributeOption {
  variantId: number;
  attributeOptionId: number;
}

// Valoración de variante (datos de la base de datos)
export interface VariantRating {
  id: number;
  variant_id: number;
  customer_id: number;
  rating: number;
  review: string | null;
  title: string | null;
  verified_purchase: number; // 0 o 1 en la BD
  created_at: string;
}

// Valoración con datos del cliente (para consultas con JOIN)
export interface VariantRatingWithCustomer extends VariantRating {
  customer_name: string;
  customer_photo: string | null;
}

// Imagen de valoración
export interface RatingImage {
  id: number;
  rating_id: number;
  image_url: string;
}

// Resumen de valoraciones de variante (datos de la base de datos)
export interface VariantRatingSummary {
  variant_id: number;
  total_ratings: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
  verified_purchases: number;
}

// Resumen de valoraciones de producto (datos de la base de datos)
export interface ProductRatingSummary {
  product_id: number;
  total_ratings: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
  verified_purchases: number;
}
