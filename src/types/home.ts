import { MegaMenuCategories, Category } from "./navigation";
import { ProductDTO } from "@/dto";

export interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

export interface SideBanner {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturedCategory {
  title: string;
  subtitle: string;
  color: string;
  image: string;
  link?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

export interface Deal {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  discount: number;
  image: string;
  timer: string;
  stock: number;
}

export interface FooterSection {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface HomeData {
  megaMenuCategories: MegaMenuCategories;
  slides: Slide[];
  sideBanners: SideBanner[];
  features: Feature[];
  productCategories: Category[];
  featuredCategories: FeaturedCategory[];
  popularProducts: Product[];
  dealsOfTheDay: Deal[];
  footerSections: FooterSection[];
  socialLinks: SocialLink[];
  // Productos hidratados para usar con ProductCard
  hydratedPopularProducts?: { product: ProductDTO }[];
  hydratedDealsOfTheDay?: { product: ProductDTO }[];
}
