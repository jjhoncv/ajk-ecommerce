import { Categories } from '@/types/domain'

export interface FeaturedCategory {
  title: string
  subtitle: string
  image: Categories['imageUrl']
  link?: string
}
