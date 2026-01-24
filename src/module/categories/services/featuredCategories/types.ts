import { type Categories } from '@/types/domain'

export interface FeaturedCategory {
  title: string
  subtitle: string
  slug?: string
  image: Categories['imageUrl']
  link?: string
}
