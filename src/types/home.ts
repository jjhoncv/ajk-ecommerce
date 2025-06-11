import { featuredCategories } from '@/types/domain/featuredCategories'
import { Category } from '@/types/navigation'
import { ProductSearchItem } from './search'

export interface HomeData {
  // Slides del hero
  slides: {
    title: string
    subtitle: string
    description: string
    image: string
    cta: string
    ctaLink: string
  }[]

  // Banners laterales
  sideBanners: {
    title: string
    subtitle: string
    image: string
    link: string
  }[]

  // Features
  features: {
    icon: string
    title: string
    description: string
  }[]

  // Categorías de productos
  productCategories: Category[]

  // Categorías destacadas
  featuredCategories: featuredCategories[]

  // Footer
  footerSections: {
    title: string
    links: {
      name: string
      href: string
    }[]
  }[]

  // Social links
  socialLinks: {
    name: string
    icon: string
    href: string
  }[]

  // sections
  popularProducts: ProductSearchItem[]
  dealsProducts: ProductSearchItem[]
}
