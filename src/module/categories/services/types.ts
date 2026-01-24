export interface MainCategory {
  id: number
  slug: string
  imageUrl: string
  name: string
  description: string
  parentId?: number | null
}
