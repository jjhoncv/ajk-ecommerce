// Interfaces para el componente ProductCard

export interface BaseProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export interface RegularProductProps extends BaseProductProps {
  rating: number;
  reviews: number;
  type: "regular";
}

export interface DealProductProps extends BaseProductProps {
  discount: number;
  timer: string;
  stock: number;
  type: "deal";
}

export interface VariantProductProps {
  product: {
    id: number;
    name: string;
    description: string | null;
    brandId: number;
    brandName: string;
    basePrice: number;
    categories: {
      id: number;
      name: string;
    }[];
    variants: {
      id: number;
      productId: number;
      sku: string;
      price: number;
      stock: number;
      attributes: {
        id: number;
        name: string;
        value: string;
        optionId: number;
        display_type?: string;
        additional_cost?: number;
      }[];
      images: {
        id: number;
        imageUrl: string;
        isPrimary: boolean;
      }[];
      // Información de promoción
      promotion?: {
        id: number;
        name: string;
        discountType: "percentage" | "fixed_amount";
        discountValue: number;
        promotionPrice: number | null;
        startDate: Date;
        endDate: Date;
        stockLimit: number | null;
      };
    }[];
    mainImage: string | null;
  };
  type: "variant";
}

export type ProductProps =
  | RegularProductProps
  | DealProductProps
  | VariantProductProps;

export interface ProductCardProps {
  product: ProductProps;
  layout?: "grid" | "list";
  showCategories?: boolean;
  className?: string;
}
