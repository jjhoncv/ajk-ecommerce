import { type ThemeName } from '@/config/tailwind.theme.config'

export enum SocialEnum {
  twitter = 'twitter',
  github = 'github',
  linkedin = 'linkedin',
  pinterest = 'pinterest',
  youtube = 'youtube',
  tiktok = 'tiktok',
  facebook = 'facebook',
  instagram = 'instagram'
}

interface SocialLink {
  name: string
  href: string
  type: SocialEnum
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  socials: SocialLink[]
  theme: ThemeName
}
