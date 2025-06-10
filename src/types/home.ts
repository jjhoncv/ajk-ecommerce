import { ProductSearchItem } from '@/types/search'
import { Category, MegaMenuCategories } from './navigation'

export interface Slide {
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  ctaLink: string
}

export interface SideBanner {
  title: string
  subtitle: string
  image: string
  link: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface FeaturedCategory {
  title: string
  subtitle: string
  color: string
  image: string
  link?: string
}

export interface Product {
  id: number
  name: string
  description: string
  basePrice?: number
  brandId?: number
  brandName: string
  minVariantPrice: number
  categories: any[]
  variants: any[]
  mainImage?: string
}

export interface Deal {
  id: string
  name: string
  originalPrice: number
  price: number
  discount: number
  image: string
  timer: string
  stock: number
}

export interface FooterSection {
  title: string
  links: {
    name: string
    href: string
  }[]
}

export interface SocialLink {
  name: string
  icon: string
  href: string
}

export interface HomeData {
  megaMenuCategories: MegaMenuCategories
  slides: Slide[]
  sideBanners: SideBanner[]
  features: Feature[]
  productCategories: Category[]
  featuredCategories: FeaturedCategory[]
  footerSections: FooterSection[]
  socialLinks: SocialLink[]
  // Solo productos hidratados (eliminamos duplicación)
  popularProducts: ProductSearchItem[]
  hydratedDealsOfTheDay: { product: Product }[]
}
