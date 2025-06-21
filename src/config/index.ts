import { type ThemeName } from './tailwind.theme.config'

export const siteConfig = {
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
  theme: 'modern-ecommerce' as ThemeName
}
