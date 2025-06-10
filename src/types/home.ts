import { ProductSearchItem } from './search'

export interface HomeData {
  // Mega menú con categorías reales
  megaMenuCategories: Record<
    string,
    {
      subcategories: {
        name: string
        link: string
        children: {
          name: string
          link: string
          children: any[]
        }[]
      }[]
      featuredProducts: {
        name: string
        price: number
        image: string
      }[]
      banner: {
        title: string
        discount: string
        image: string
      }
    }
  >

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
  productCategories: {
    name: string
    icon: string
    bg: string
    image: string | null
  }[]

  // Categorías destacadas
  featuredCategories: {
    title: string
    subtitle: string
    color: string
    image: string
  }[]

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
