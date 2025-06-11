export interface Category {
  name: string
  image: string | null
}

export interface SubCategory {
  name: string
  link: string
}

export interface FeaturedProduct {
  name: string
  price: number
  image: string | null
}

export interface Banner {
  title: string
  discount: string
  image: string
}
