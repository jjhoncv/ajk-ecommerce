import { type FeaturedCategory } from './types'

export const hydrateFeaturedCategories = (
  data: FeaturedCategory[]
): FeaturedCategory[] => {
  return data.map((item) => ({
    ...item
  }))
}
