export interface Category {
  name: string;
  icon: string;
  bg: string;
  image: string | null;
}

export interface SubCategory {
  name: string;
  link: string;
}

export interface FeaturedProduct {
  name: string;
  price: number;
  image: string;
}

export interface Banner {
  title: string;
  discount: string;
  image: string;
}

export interface MegaMenuCategory {
  subcategories: SubCategory[];
  featuredProducts: FeaturedProduct[];
  banner: Banner;
}

export interface MegaMenuCategories {
  [key: string]: MegaMenuCategory;
}
