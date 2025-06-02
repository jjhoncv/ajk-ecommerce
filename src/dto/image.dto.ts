// DTOs para el sistema de galería de imágenes mejorado

export interface VariantImageDTO {
  id: number;
  variantId: number;
  imageType:
    | "front"
    | "back"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "detail"
    | "lifestyle"
    | "packaging";
  imageUrlThumb: string; // 140x140
  imageUrlNormal: string; // 600x800
  imageUrlZoom: string; // 1200x1200
  isPrimary: boolean;
  displayOrder: number;
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
  // Información del atributo asociado (si aplica)
  associatedAttribute?: {
    attributeId: number;
    attributeName: string;
    optionId: number;
    optionValue: string;
  };
}

export interface AttributeOptionImageDTO {
  id: number;
  attributeOptionId: number;
  imageUrlThumb: string; // 140x140 para selector de atributo
  imageUrlNormal?: string; // 600x800 (opcional)
  imageUrlZoom?: string; // 1200x1200 (opcional)
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
  // Información del atributo
  attribute: {
    id: number;
    name: string;
    displayType: string;
  };
  option: {
    id: number;
    value: string;
    additionalCost: number;
  };
}

export interface ProductGalleryDTO {
  variantId: number;
  images: VariantImageDTO[];
  attributeImages: AttributeOptionImageDTO[];
  // Agrupación por tipo de imagen
  imagesByType: {
    [key in VariantImageDTO["imageType"]]?: VariantImageDTO[];
  };
  // Agrupación por atributo (especialmente útil para colores)
  imagesByAttribute: {
    [attributeName: string]: {
      [optionValue: string]: VariantImageDTO[];
    };
  };
}

export interface ImageSizesDTO {
  thumb: string; // 140x140
  normal: string; // 600x800
  zoom: string; // 1200x1200
}

export interface GalleryConfigDTO {
  supportedImageTypes: VariantImageDTO["imageType"][];
  supportedSizes: {
    thumb: { width: number; height: number };
    normal: { width: number; height: number };
    zoom: { width: number; height: number };
  };
  maxImagesPerVariant: number;
  maxImagesPerType: number;
}

// DTO para crear/actualizar imágenes de variante
export interface CreateVariantImageDTO {
  variantId: number;
  imageType: VariantImageDTO["imageType"];
  imageUrlThumb: string;
  imageUrlNormal: string;
  imageUrlZoom: string;
  isPrimary?: boolean;
  displayOrder?: number;
  altText?: string;
  associatedAttributeOptionIds?: number[]; // IDs de opciones de atributos asociadas
}

// DTO para crear/actualizar imágenes de opciones de atributos
export interface CreateAttributeOptionImageDTO {
  attributeOptionId: number;
  imageUrlThumb: string;
  imageUrlNormal?: string;
  imageUrlZoom?: string;
  altText?: string;
}

// DTO para respuesta de búsqueda de imágenes
export interface ImageSearchResultDTO {
  images: VariantImageDTO[];
  attributeImages: AttributeOptionImageDTO[];
  totalCount: number;
  hasMore: boolean;
}

// DTO para filtros de búsqueda de imágenes
export interface ImageSearchFiltersDTO {
  variantId?: number;
  productId?: number;
  imageTypes?: VariantImageDTO["imageType"][];
  attributeNames?: string[];
  attributeOptionIds?: number[];
  isPrimary?: boolean;
  limit?: number;
  offset?: number;
}

// DTO para estadísticas de galería
export interface GalleryStatsDTO {
  totalImages: number;
  imagesByType: {
    [key in VariantImageDTO["imageType"]]?: number;
  };
  imagesByAttribute: {
    [attributeName: string]: {
      [optionValue: string]: number;
    };
  };
  variantsWithImages: number;
  variantsWithoutImages: number;
}
