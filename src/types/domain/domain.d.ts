// ============================================================================
// TIPOS DE DOMINIO BÁSICOS - SOLO INTERFACES Y ENUMS
// ============================================================================
// Para uso con consultas SQL directas
// ============================================================================

export type Maybe<T> = T | null

export type InputMaybe<T> = T | null

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }

export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }

export interface Scalars {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }

  BigInt: { input: number; output: number }

  DateTime: { input: Date; output: Date }

  Timestamp: { input: Date; output: Date }
}

export interface AttributeOptionImages {
  altText?: Maybe<Scalars['String']['output']>
  attributeOption?: Maybe<AttributeOptions>
  attributeOptionId: Scalars['Int']['output']
  createdAt: Scalars['Timestamp']['output']
  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  imageType: AttributeOptionImagesImageType

  imageUrlNormal?: Maybe<Scalars['String']['output']>

  imageUrlThumb: Scalars['String']['output']

  imageUrlZoom?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export type AttributeOptionImagesImageType =
  | 'back'
  | 'bottom'
  | 'detail'
  | 'front'
  | 'left'
  | 'lifestyle'
  | 'packaging'
  | 'right'
  | 'top'

export interface AttributeOptions {
  additionalCost?: Maybe<Scalars['Float']['output']>
  attributeId: Scalars['Int']['output']
  attributeOptionImages?: Maybe<Array<Maybe<AttributeOptionImages>>>
  id: Scalars['Int']['output']
  value: Scalars['String']['output']
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>
}

export interface Attributes {
  displayType: AttributesDisplayType
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
}

export type AttributesDisplayType =
  | 'color'
  | 'custom'
  | 'pills'
  | 'radio'
  | 'select'

export interface Banner {
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  imageUrl?: Maybe<Scalars['String']['output']>
  link?: Maybe<Scalars['String']['output']>
  subtitle?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export interface Brands {
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  product?: Maybe<Products>
}

export interface Categories {
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  imageUrl?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  parentId?: Maybe<Scalars['Int']['output']>
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>
}

export interface Customers {
  addressId?: Maybe<Scalars['Int']['output']>
  createdAt: Scalars['Timestamp']['output']
  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>
  email: Scalars['String']['output']
  id: Scalars['Int']['output']
  isActive?: Maybe<Scalars['Int']['output']>
  lastname: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  password: Scalars['String']['output']
  photo?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  username: Scalars['String']['output']
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>
}

export interface CustomersAddresses {
  createdAt: Scalars['Timestamp']['output']
  customer?: Maybe<Customers>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  idCustomer?: Maybe<Scalars['Int']['output']>
  name?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export type OrderBy = 'asc' | 'desc'

export interface Permissions {
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export interface ProductCategories {
  categories?: Maybe<Array<Maybe<Categories>>>
  categoryId: Scalars['Int']['output']
  product?: Maybe<Products>
  productId: Scalars['Int']['output']
}

export interface ProductRatingSummary {
  averageRating?: Maybe<Scalars['Float']['output']>
  fiveStar?: Maybe<Scalars['Float']['output']>
  fourStar?: Maybe<Scalars['Float']['output']>
  oneStar?: Maybe<Scalars['Float']['output']>
  productId: Scalars['Int']['output']
  threeStar?: Maybe<Scalars['Float']['output']>
  totalRatings: Scalars['BigInt']['output']
  twoStar?: Maybe<Scalars['Float']['output']>
  verifiedPurchases?: Maybe<Scalars['Float']['output']>
}

export interface ProductVariants {
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['Int']['output']
  price: Scalars['Float']['output']
  product?: Maybe<Products>
  productId: Scalars['Int']['output']
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>
  sku: Scalars['String']['output']
  stock: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>
  variantImages?: Maybe<Array<Maybe<VariantImages>>>
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>
}

export interface Products {
  basePrice?: Maybe<Scalars['Float']['output']>
  brand?: Maybe<Brands>
  brandId?: Maybe<Scalars['Int']['output']>
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>
  updatedAt: Scalars['Timestamp']['output']
}

export interface PromotionVariants {
  createdAt: Scalars['Timestamp']['output']
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>
  promotion?: Maybe<Promotions>
  promotionId: Scalars['Int']['output']
  promotionPrice?: Maybe<Scalars['Float']['output']>
  stockLimit?: Maybe<Scalars['Int']['output']>
  variantId: Scalars['Int']['output']
}

export interface Promotions {
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  discountType: PromotionsDiscountType
  discountValue: Scalars['Float']['output']
  endDate: Scalars['DateTime']['output']
  id: Scalars['Int']['output']
  isActive?: Maybe<Scalars['Int']['output']>
  minPurchaseAmount?: Maybe<Scalars['Float']['output']>
  name: Scalars['String']['output']
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>
  startDate: Scalars['DateTime']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export type PromotionsDiscountType = 'fixed_amount' | 'percentage'

export interface RatingImages {
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['Int']['output']
  imageUrl: Scalars['String']['output']
  ratingId: Scalars['Int']['output']
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>
}

export interface Roles {
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>
  updatedAt: Scalars['Timestamp']['output']
  users?: Maybe<Array<Maybe<Users>>>
}

export interface RolesSections {
  id: Scalars['Int']['output']
  idRol?: Maybe<Scalars['Int']['output']>
  idSection?: Maybe<Scalars['Int']['output']>
  role?: Maybe<Roles>
  sections?: Maybe<Array<Maybe<Sections>>>
}

export interface Sections {
  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  image?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>
  url?: Maybe<Scalars['String']['output']>
}

export interface Services {
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  imageUrl?: Maybe<Scalars['String']['output']>
  servicesImages?: Maybe<Array<Maybe<ServicesImages>>>
  slug?: Maybe<Scalars['String']['output']>
  subtitle?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export interface ServicesImages {
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  idService?: Maybe<Scalars['Int']['output']>
  imageUrl?: Maybe<Scalars['String']['output']>
  services?: Maybe<Array<Maybe<Services>>>
  subtitle?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export interface Users {
  createdAt: Scalars['Timestamp']['output']
  email: Scalars['String']['output']
  id: Scalars['Int']['output']
  isActive?: Maybe<Scalars['Int']['output']>
  lastname: Scalars['String']['output']
  password: Scalars['String']['output']
  photo?: Maybe<Scalars['String']['output']>
  role?: Maybe<Roles>
  roleId: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  username: Scalars['String']['output']
}

export interface VariantAttributeOptions {
  attributeOption?: Maybe<AttributeOptions>
  attributeOptionId: Scalars['Int']['output']
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>
  variantId: Scalars['Int']['output']
}

export interface VariantImages {
  altText?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']

  displayOrder?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  imageType: VariantImagesImageType

  imageUrlNormal: Scalars['String']['output']

  imageUrlThumb: Scalars['String']['output']

  imageUrlZoom: Scalars['String']['output']

  isPrimary?: Maybe<Scalars['Int']['output']>
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>
  updatedAt: Scalars['Timestamp']['output']
  variantId: Scalars['Int']['output']
}

export type VariantImagesImageType =
  | 'back'
  | 'bottom'
  | 'detail'
  | 'front'
  | 'left'
  | 'lifestyle'
  | 'packaging'
  | 'right'
  | 'top'

export interface VariantRatingSummary {
  averageRating?: Maybe<Scalars['Float']['output']>
  fiveStar?: Maybe<Scalars['Float']['output']>
  fourStar?: Maybe<Scalars['Float']['output']>
  oneStar?: Maybe<Scalars['Float']['output']>
  threeStar?: Maybe<Scalars['Float']['output']>
  totalRatings: Scalars['BigInt']['output']
  twoStar?: Maybe<Scalars['Float']['output']>
  variantId: Scalars['Int']['output']
  verifiedPurchases?: Maybe<Scalars['Float']['output']>
}

export interface VariantRatings {
  createdAt: Scalars['Timestamp']['output']
  customer?: Maybe<Customers>
  customerId: Scalars['Int']['output']
  id: Scalars['Int']['output']
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>
  rating: Scalars['Int']['output']
  ratingImages?: Maybe<Array<Maybe<RatingImages>>>
  review?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  variantId: Scalars['Int']['output']
  verifiedPurchase: Scalars['Int']['output']
}
