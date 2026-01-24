import { type ProductAttributeOptionImages, type VariantImages } from '@/types/domain'

export enum SEARCH_SORT {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest'
}

export type FILTER_SORT =
  | SEARCH_SORT.PRICE_ASC
  | SEARCH_SORT.PRICE_DESC
  | SEARCH_SORT.NAME_ASC
  | SEARCH_SORT.NAME_DESC
  | SEARCH_SORT.NEWEST

export interface SearchParams {
  q?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
  [key: string]: string | string[] | undefined
}

type ItemImageMix = ProductAttributeOptionImages | VariantImages

export type ItemImageOmit = Omit<
  ItemImageMix,
  'attributeOptionId' | 'createdAt' | 'updatedAt' | 'displayOrder'
>

export interface ItemImage extends ItemImageOmit {
  displayOrder: number
}
