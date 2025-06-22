import { SocialEnum, type SiteConfig } from './config.types'
import { type ThemeName } from './tailwind.theme.config'

export const siteConfig: SiteConfig = {
  name: 'TechStore',
  description: 'Tu tienda de tecnología y zapatillas',
  url: 'https://techstore.com',
  ogImage: 'https://techstore.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/techstore',
    github: 'https://github.com/techstore'
  },
  contact: {
    email: 'info@techstore.com',
    phone: '+1 1800 900',
    address: 'Av. Javier Prado Este 123, Lima, Perú'
  },
  socials: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/techstore/',
      type: SocialEnum.instagram
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/techstore/',
      type: SocialEnum.facebook
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/techstore',
      type: SocialEnum.twitter
    }
  ],
  theme: 'modern-ecommerce' as ThemeName
}
