// ============================================================================
// TIPOS DE BASE DE DATOS - SIN RELACIONES
// ============================================================================
// Nombres tal como están en la base de datos
// Para uso directo con consultas SQL
// ============================================================================

export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: Date; output: Date; }
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
  | 'top';

export type AttributesDisplayType =
  | 'color'
  | 'custom'
  | 'pills'
  | 'radio'
  | 'select';

export type PromotionsDiscountType =
  | 'fixed_amount'
  | 'percentage';

export type VariantImagesImageType =
  | 'back'
  | 'bottom'
  | 'detail'
  | 'front'
  | 'left'
  | 'lifestyle'
  | 'packaging'
  | 'right'
  | 'top';

export interface AttributeOptionImages {
  /** Texto alternativo */
  alt_text?: Maybe<Scalars['String']['output']>;
  attribute_option_id: Scalars['Int']['output'];
  created_at: Scalars['Timestamp']['output'];
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image_type: AttributeOptionImagesImageType;
  /** Imagen normal 600x800 (opcional) */
  image_url_normal?: Maybe<Scalars['String']['output']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom?: Maybe<Scalars['String']['output']>;
  is_primary?: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface AttributeOptions {
  additional_cost?: Maybe<Scalars['Float']['output']>;
  attribute_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  value: Scalars['String']['output'];
}

export interface Attributes {
  display_type: AttributesDisplayType;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
}

export interface Banner {
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface Brands {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
}

export interface Categories {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parent_id?: Maybe<Scalars['Int']['output']>;
}

export interface Customers {
  address_id?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
  username: Scalars['String']['output'];
}

export interface CustomersAddresses {
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  id_customer?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface Permissions {
  created_at: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface ProductCategories {
  category_id: Scalars['Int']['output'];
  product_id: Scalars['Int']['output'];
}

export interface ProductRatingSummary {
  average_rating?: Maybe<Scalars['Float']['output']>;
  five_star?: Maybe<Scalars['Float']['output']>;
  four_star?: Maybe<Scalars['Float']['output']>;
  one_star?: Maybe<Scalars['Float']['output']>;
  product_id: Scalars['Int']['output'];
  three_star?: Maybe<Scalars['Float']['output']>;
  total_ratings: Scalars['BigInt']['output'];
  two_star?: Maybe<Scalars['Float']['output']>;
  verified_purchases?: Maybe<Scalars['Float']['output']>;
}

export interface ProductVariants {
  created_at: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  product_id: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  stock: Scalars['Int']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface Products {
  base_price?: Maybe<Scalars['Float']['output']>;
  brand_id?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface PromotionVariants {
  created_at: Scalars['Timestamp']['output'];
  promotion_id: Scalars['Int']['output'];
  promotion_price?: Maybe<Scalars['Float']['output']>;
  stock_limit?: Maybe<Scalars['Int']['output']>;
  variant_id: Scalars['Int']['output'];
}

export interface Promotions {
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discount_type: PromotionsDiscountType;
  discount_value: Scalars['Float']['output'];
  end_date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  min_purchase_amount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  start_date: Scalars['DateTime']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface RatingImages {
  created_at: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  image_url: Scalars['String']['output'];
  rating_id: Scalars['Int']['output'];
}

export interface Roles {
  created_at: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface RolesSections {
  id: Scalars['Int']['output'];
  id_rol?: Maybe<Scalars['Int']['output']>;
  id_section?: Maybe<Scalars['Int']['output']>;
}

export interface Sections {
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
}

export interface Services {
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface ServicesImages {
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  id_service?: Maybe<Scalars['Int']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface Users {
  created_at: Scalars['Timestamp']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  role_id: Scalars['Int']['output'];
  updated_at: Scalars['Timestamp']['output'];
  username: Scalars['String']['output'];
}

export interface VariantAttributeOptions {
  attribute_option_id: Scalars['Int']['output'];
  variant_id: Scalars['Int']['output'];
}

export interface VariantImages {
  /** Texto alternativo para SEO */
  alt_text?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  /** Orden de visualización */
  display_order?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image_type: VariantImagesImageType;
  /** Imagen normal 600x800 */
  image_url_normal: Scalars['String']['output'];
  /** Imagen thumbnail 140x140 */
  image_url_thumb: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 */
  image_url_zoom: Scalars['String']['output'];
  /** Imagen principal de la variante */
  is_primary?: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['Timestamp']['output'];
  variant_id: Scalars['Int']['output'];
}

export interface VariantRatingSummary {
  average_rating?: Maybe<Scalars['Float']['output']>;
  five_star?: Maybe<Scalars['Float']['output']>;
  four_star?: Maybe<Scalars['Float']['output']>;
  one_star?: Maybe<Scalars['Float']['output']>;
  three_star?: Maybe<Scalars['Float']['output']>;
  total_ratings: Scalars['BigInt']['output'];
  two_star?: Maybe<Scalars['Float']['output']>;
  variant_id: Scalars['Int']['output'];
  verified_purchases?: Maybe<Scalars['Float']['output']>;
}

export interface VariantRatings {
  created_at: Scalars['Timestamp']['output'];
  customer_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  review?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
  variant_id: Scalars['Int']['output'];
  verified_purchase: Scalars['Int']['output'];
}
