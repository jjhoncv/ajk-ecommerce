// Interfaces para los modelos de datos

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
  options?: AttributeOption[];
}

// Opción de atributo
export interface AttributeOption {
  id: number;
  attributeId: number;
  value: string;
}

// Producto
export interface Product {
  id: number;
  name: string;
  description: string | null;
  brandId: number;
  brand?: Brand;
  basePrice: number;
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
  variantId: number;
  imageUrl: string;
  isPrimary: boolean;
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
