import { ProductDTO } from "@/dto";

// Interfaces base para los productos
export interface BaseProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

// Producto regular con rating y reviews
export interface RegularProduct extends BaseProduct {
  rating: number;
  reviews: number;
  type: "regular";
}

// Producto en oferta con descuento, timer y stock
export interface DealProduct extends BaseProduct {
  discount: number;
  timer: string;
  stock: number;
  type: "deal";
}

// Producto con variantes
export interface VariantProduct {
  product: ProductDTO;
  type: "variant";
  id?: number;
  price?: number;
  sku?: string;
  stock?: number;
  // Propiedades adicionales para variantes individuales en resultados de búsqueda
  variantId?: number;
  variantSku?: string;
  variantPrice?: number;
  variantStock?: number;
  minVariantPrice?: number;
  basePrice?: number;
}

// Props para el componente ProductCard
export interface ProductCardProps {
  product: RegularProduct | DealProduct | VariantProduct;
  layout?: "grid" | "list";
  showCategories?: boolean;
  className?: string;
}

// Props para el componente ProductCardSlider
export interface ProductCardSliderProps {
  images: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
  }[];
  productName: string;
  brandName: string;
  layout?: "grid" | "list";
}

// Props para el componente ProductCardVariants
export interface ProductCardVariantsProps {
  variantProduct: ProductDTO;
  selectedVariantIndex: number;
  setSelectedVariantIndex: (index: number) => void;
  layout?: "grid" | "list";
  showCategories?: boolean;
}

// Props para el componente ProductCardDeal
export interface ProductCardDealProps {
  product: DealProduct;
  layout?: "grid" | "list";
}
