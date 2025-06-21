// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace DatabaseTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: { input: string; output: string; }
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: { input: boolean; output: boolean; }
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: { input: number; output: number; }
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: { input: number; output: number; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: Date | string | number; output: Date | string | number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: Date | string; output: Date | string; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date | string; output: Date | string; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: bigint; output: bigint; }
};

export type Query = {
  attribute_option_images?: Maybe<Array<Maybe<attribute_option_images>>>;
  count_attribute_option_images?: Maybe<Scalars['Int']['output']>;
  attribute_options?: Maybe<Array<Maybe<attribute_options>>>;
  count_attribute_options?: Maybe<Scalars['Int']['output']>;
  attributes?: Maybe<Array<Maybe<attributes>>>;
  count_attributes?: Maybe<Scalars['Int']['output']>;
  banner?: Maybe<Array<Maybe<banner>>>;
  count_banner?: Maybe<Scalars['Int']['output']>;
  brands?: Maybe<Array<Maybe<brands>>>;
  count_brands?: Maybe<Scalars['Int']['output']>;
  categories?: Maybe<Array<Maybe<categories>>>;
  count_categories?: Maybe<Scalars['Int']['output']>;
  coupon_usage?: Maybe<Array<Maybe<coupon_usage>>>;
  count_coupon_usage?: Maybe<Scalars['Int']['output']>;
  coupons?: Maybe<Array<Maybe<coupons>>>;
  count_coupons?: Maybe<Scalars['Int']['output']>;
  customers?: Maybe<Array<Maybe<customers>>>;
  count_customers?: Maybe<Scalars['Int']['output']>;
  customers_addresses?: Maybe<Array<Maybe<customers_addresses>>>;
  count_customers_addresses?: Maybe<Scalars['Int']['output']>;
  order_items?: Maybe<Array<Maybe<order_items>>>;
  count_order_items?: Maybe<Scalars['Int']['output']>;
  order_summary?: Maybe<Array<Maybe<order_summary>>>;
  count_order_summary?: Maybe<Scalars['Int']['output']>;
  order_tracking?: Maybe<Array<Maybe<order_tracking>>>;
  count_order_tracking?: Maybe<Scalars['Int']['output']>;
  orders?: Maybe<Array<Maybe<orders>>>;
  count_orders?: Maybe<Scalars['Int']['output']>;
  payment_methods?: Maybe<Array<Maybe<payment_methods>>>;
  count_payment_methods?: Maybe<Scalars['Int']['output']>;
  payment_transactions?: Maybe<Array<Maybe<payment_transactions>>>;
  count_payment_transactions?: Maybe<Scalars['Int']['output']>;
  permissions?: Maybe<Array<Maybe<permissions>>>;
  count_permissions?: Maybe<Scalars['Int']['output']>;
  product_categories?: Maybe<Array<Maybe<product_categories>>>;
  count_product_categories?: Maybe<Scalars['Int']['output']>;
  product_rating_summary?: Maybe<Array<Maybe<product_rating_summary>>>;
  count_product_rating_summary?: Maybe<Scalars['Int']['output']>;
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
  count_product_variants?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<Maybe<products>>>;
  count_products?: Maybe<Scalars['Int']['output']>;
  promotion_variants?: Maybe<Array<Maybe<promotion_variants>>>;
  count_promotion_variants?: Maybe<Scalars['Int']['output']>;
  promotions?: Maybe<Array<Maybe<promotions>>>;
  count_promotions?: Maybe<Scalars['Int']['output']>;
  rating_images?: Maybe<Array<Maybe<rating_images>>>;
  count_rating_images?: Maybe<Scalars['Int']['output']>;
  roles?: Maybe<Array<Maybe<roles>>>;
  count_roles?: Maybe<Scalars['Int']['output']>;
  roles_sections?: Maybe<Array<Maybe<roles_sections>>>;
  count_roles_sections?: Maybe<Scalars['Int']['output']>;
  sections?: Maybe<Array<Maybe<sections>>>;
  count_sections?: Maybe<Scalars['Int']['output']>;
  services?: Maybe<Array<Maybe<services>>>;
  count_services?: Maybe<Scalars['Int']['output']>;
  services_images?: Maybe<Array<Maybe<services_images>>>;
  count_services_images?: Maybe<Scalars['Int']['output']>;
  shipping_methods?: Maybe<Array<Maybe<shipping_methods>>>;
  count_shipping_methods?: Maybe<Scalars['Int']['output']>;
  shipping_zone_methods?: Maybe<Array<Maybe<shipping_zone_methods>>>;
  count_shipping_zone_methods?: Maybe<Scalars['Int']['output']>;
  shipping_zones?: Maybe<Array<Maybe<shipping_zones>>>;
  count_shipping_zones?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<Maybe<users>>>;
  count_users?: Maybe<Scalars['Int']['output']>;
  variant_attribute_options?: Maybe<Array<Maybe<variant_attribute_options>>>;
  count_variant_attribute_options?: Maybe<Scalars['Int']['output']>;
  variant_images?: Maybe<Array<Maybe<variant_images>>>;
  count_variant_images?: Maybe<Scalars['Int']['output']>;
  variant_rating_summary?: Maybe<Array<Maybe<variant_rating_summary>>>;
  count_variant_rating_summary?: Maybe<Scalars['Int']['output']>;
  variant_ratings?: Maybe<Array<Maybe<variant_ratings>>>;
  count_variant_ratings?: Maybe<Scalars['Int']['output']>;
};


export type Queryattribute_option_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<attribute_option_images_WhereInput>;
  orderBy?: InputMaybe<attribute_option_images_OrderByInput>;
};


export type Querycount_attribute_option_imagesArgs = {
  where?: InputMaybe<attribute_option_images_WhereInput>;
};


export type Queryattribute_optionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<attribute_options_WhereInput>;
  orderBy?: InputMaybe<attribute_options_OrderByInput>;
};


export type Querycount_attribute_optionsArgs = {
  where?: InputMaybe<attribute_options_WhereInput>;
};


export type QueryattributesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<attributes_WhereInput>;
  orderBy?: InputMaybe<attributes_OrderByInput>;
};


export type Querycount_attributesArgs = {
  where?: InputMaybe<attributes_WhereInput>;
};


export type QuerybannerArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<banner_WhereInput>;
  orderBy?: InputMaybe<banner_OrderByInput>;
};


export type Querycount_bannerArgs = {
  where?: InputMaybe<banner_WhereInput>;
};


export type QuerybrandsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<brands_WhereInput>;
  orderBy?: InputMaybe<brands_OrderByInput>;
};


export type Querycount_brandsArgs = {
  where?: InputMaybe<brands_WhereInput>;
};


export type QuerycategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<categories_WhereInput>;
  orderBy?: InputMaybe<categories_OrderByInput>;
};


export type Querycount_categoriesArgs = {
  where?: InputMaybe<categories_WhereInput>;
};


export type Querycoupon_usageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<coupon_usage_WhereInput>;
  orderBy?: InputMaybe<coupon_usage_OrderByInput>;
};


export type Querycount_coupon_usageArgs = {
  where?: InputMaybe<coupon_usage_WhereInput>;
};


export type QuerycouponsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<coupons_WhereInput>;
  orderBy?: InputMaybe<coupons_OrderByInput>;
};


export type Querycount_couponsArgs = {
  where?: InputMaybe<coupons_WhereInput>;
};


export type QuerycustomersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<customers_WhereInput>;
  orderBy?: InputMaybe<customers_OrderByInput>;
};


export type Querycount_customersArgs = {
  where?: InputMaybe<customers_WhereInput>;
};


export type Querycustomers_addressesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<customers_addresses_WhereInput>;
  orderBy?: InputMaybe<customers_addresses_OrderByInput>;
};


export type Querycount_customers_addressesArgs = {
  where?: InputMaybe<customers_addresses_WhereInput>;
};


export type Queryorder_itemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_items_WhereInput>;
  orderBy?: InputMaybe<order_items_OrderByInput>;
};


export type Querycount_order_itemsArgs = {
  where?: InputMaybe<order_items_WhereInput>;
};


export type Queryorder_summaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_summary_WhereInput>;
  orderBy?: InputMaybe<order_summary_OrderByInput>;
};


export type Querycount_order_summaryArgs = {
  where?: InputMaybe<order_summary_WhereInput>;
};


export type Queryorder_trackingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_tracking_WhereInput>;
  orderBy?: InputMaybe<order_tracking_OrderByInput>;
};


export type Querycount_order_trackingArgs = {
  where?: InputMaybe<order_tracking_WhereInput>;
};


export type QueryordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
};


export type Querycount_ordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
};


export type Querypayment_methodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<payment_methods_WhereInput>;
  orderBy?: InputMaybe<payment_methods_OrderByInput>;
};


export type Querycount_payment_methodsArgs = {
  where?: InputMaybe<payment_methods_WhereInput>;
};


export type Querypayment_transactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<payment_transactions_WhereInput>;
  orderBy?: InputMaybe<payment_transactions_OrderByInput>;
};


export type Querycount_payment_transactionsArgs = {
  where?: InputMaybe<payment_transactions_WhereInput>;
};


export type QuerypermissionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<permissions_WhereInput>;
  orderBy?: InputMaybe<permissions_OrderByInput>;
};


export type Querycount_permissionsArgs = {
  where?: InputMaybe<permissions_WhereInput>;
};


export type Queryproduct_categoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_categories_WhereInput>;
  orderBy?: InputMaybe<product_categories_OrderByInput>;
};


export type Querycount_product_categoriesArgs = {
  where?: InputMaybe<product_categories_WhereInput>;
};


export type Queryproduct_rating_summaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_rating_summary_WhereInput>;
  orderBy?: InputMaybe<product_rating_summary_OrderByInput>;
};


export type Querycount_product_rating_summaryArgs = {
  where?: InputMaybe<product_rating_summary_WhereInput>;
};


export type Queryproduct_variantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
};


export type Querycount_product_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
};


export type QueryproductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<products_WhereInput>;
  orderBy?: InputMaybe<products_OrderByInput>;
};


export type Querycount_productsArgs = {
  where?: InputMaybe<products_WhereInput>;
};


export type Querypromotion_variantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<promotion_variants_WhereInput>;
  orderBy?: InputMaybe<promotion_variants_OrderByInput>;
};


export type Querycount_promotion_variantsArgs = {
  where?: InputMaybe<promotion_variants_WhereInput>;
};


export type QuerypromotionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<promotions_WhereInput>;
  orderBy?: InputMaybe<promotions_OrderByInput>;
};


export type Querycount_promotionsArgs = {
  where?: InputMaybe<promotions_WhereInput>;
};


export type Queryrating_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<rating_images_WhereInput>;
  orderBy?: InputMaybe<rating_images_OrderByInput>;
};


export type Querycount_rating_imagesArgs = {
  where?: InputMaybe<rating_images_WhereInput>;
};


export type QueryrolesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<roles_WhereInput>;
  orderBy?: InputMaybe<roles_OrderByInput>;
};


export type Querycount_rolesArgs = {
  where?: InputMaybe<roles_WhereInput>;
};


export type Queryroles_sectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<roles_sections_WhereInput>;
  orderBy?: InputMaybe<roles_sections_OrderByInput>;
};


export type Querycount_roles_sectionsArgs = {
  where?: InputMaybe<roles_sections_WhereInput>;
};


export type QuerysectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<sections_WhereInput>;
  orderBy?: InputMaybe<sections_OrderByInput>;
};


export type Querycount_sectionsArgs = {
  where?: InputMaybe<sections_WhereInput>;
};


export type QueryservicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<services_WhereInput>;
  orderBy?: InputMaybe<services_OrderByInput>;
};


export type Querycount_servicesArgs = {
  where?: InputMaybe<services_WhereInput>;
};


export type Queryservices_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<services_images_WhereInput>;
  orderBy?: InputMaybe<services_images_OrderByInput>;
};


export type Querycount_services_imagesArgs = {
  where?: InputMaybe<services_images_WhereInput>;
};


export type Queryshipping_methodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<shipping_methods_WhereInput>;
  orderBy?: InputMaybe<shipping_methods_OrderByInput>;
};


export type Querycount_shipping_methodsArgs = {
  where?: InputMaybe<shipping_methods_WhereInput>;
};


export type Queryshipping_zone_methodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
  orderBy?: InputMaybe<shipping_zone_methods_OrderByInput>;
};


export type Querycount_shipping_zone_methodsArgs = {
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
};


export type Queryshipping_zonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<shipping_zones_WhereInput>;
  orderBy?: InputMaybe<shipping_zones_OrderByInput>;
};


export type Querycount_shipping_zonesArgs = {
  where?: InputMaybe<shipping_zones_WhereInput>;
};


export type QueryusersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<users_WhereInput>;
  orderBy?: InputMaybe<users_OrderByInput>;
};


export type Querycount_usersArgs = {
  where?: InputMaybe<users_WhereInput>;
};


export type Queryvariant_attribute_optionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_attribute_options_WhereInput>;
  orderBy?: InputMaybe<variant_attribute_options_OrderByInput>;
};


export type Querycount_variant_attribute_optionsArgs = {
  where?: InputMaybe<variant_attribute_options_WhereInput>;
};


export type Queryvariant_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_images_WhereInput>;
  orderBy?: InputMaybe<variant_images_OrderByInput>;
};


export type Querycount_variant_imagesArgs = {
  where?: InputMaybe<variant_images_WhereInput>;
};


export type Queryvariant_rating_summaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_rating_summary_WhereInput>;
  orderBy?: InputMaybe<variant_rating_summary_OrderByInput>;
};


export type Querycount_variant_rating_summaryArgs = {
  where?: InputMaybe<variant_rating_summary_WhereInput>;
};


export type Queryvariant_ratingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_ratings_WhereInput>;
  orderBy?: InputMaybe<variant_ratings_OrderByInput>;
};


export type Querycount_variant_ratingsArgs = {
  where?: InputMaybe<variant_ratings_WhereInput>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_images = {
  id: Scalars['Int']['output'];
  attribute_option_id: Scalars['Int']['output'];
  image_type: attribute_option_images_image_type;
  display_order?: Maybe<Scalars['Int']['output']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb: Scalars['String']['output'];
  /** Imagen normal 600x800 (opcional) */
  image_url_normal: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom: Scalars['String']['output'];
  /** Texto alternativo */
  alt_text?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  is_primary?: Maybe<Scalars['Int']['output']>;
  attribute_options?: Maybe<Array<Maybe<attribute_options>>>;
};


/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_imagesattribute_optionsArgs = {
  where?: InputMaybe<attribute_options_WhereInput>;
  orderBy?: InputMaybe<attribute_options_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type attribute_option_images_image_type =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'detail'
  | 'lifestyle'
  | 'packaging';

export type attribute_options = {
  id: Scalars['Int']['output'];
  attribute_id: Scalars['Int']['output'];
  value: Scalars['String']['output'];
  additional_cost?: Maybe<Scalars['Float']['output']>;
  attribute_option_images?: Maybe<Array<Maybe<attribute_option_images>>>;
  attributes?: Maybe<Array<Maybe<attributes>>>;
  variant_attribute_options?: Maybe<Array<Maybe<variant_attribute_options>>>;
};


export type attribute_optionsattribute_option_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<attribute_option_images_WhereInput>;
  orderBy?: InputMaybe<attribute_option_images_OrderByInput>;
};


export type attribute_optionsattributesArgs = {
  where?: InputMaybe<attributes_WhereInput>;
  orderBy?: InputMaybe<attributes_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type attribute_optionsvariant_attribute_optionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_attribute_options_WhereInput>;
  orderBy?: InputMaybe<variant_attribute_options_OrderByInput>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_images_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  attribute_option_id?: InputMaybe<Scalars['String']['input']>;
  image_type?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 (opcional) */
  image_url_normal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  is_primary?: InputMaybe<Scalars['String']['input']>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_images_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  attribute_option_id?: InputMaybe<OrderBy>;
  image_type?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb?: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 (opcional) */
  image_url_normal?: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom?: InputMaybe<OrderBy>;
  /** Texto alternativo */
  alt_text?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  is_primary?: InputMaybe<OrderBy>;
};

export type OrderBy =
  | 'asc'
  | 'desc';

export type attributes = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  display_type: attributes_display_type;
  attribute_options?: Maybe<Array<Maybe<attribute_options>>>;
};


export type attributesattribute_optionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<attribute_options_WhereInput>;
  orderBy?: InputMaybe<attribute_options_OrderByInput>;
};

export type attributes_display_type =
  | 'radio'
  | 'pills'
  | 'select'
  | 'color'
  | 'custom';

export type attribute_options_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  attribute_id?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  additional_cost?: InputMaybe<Scalars['String']['input']>;
};

export type attribute_options_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  attribute_id?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
  additional_cost?: InputMaybe<OrderBy>;
};

export type attributes_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
};

export type attributes_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  display_type?: InputMaybe<OrderBy>;
};

export type variant_attribute_options = {
  variant_id: Scalars['Int']['output'];
  attribute_option_id: Scalars['Int']['output'];
  attribute_options?: Maybe<Array<Maybe<attribute_options>>>;
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
};


export type variant_attribute_optionsattribute_optionsArgs = {
  where?: InputMaybe<attribute_options_WhereInput>;
  orderBy?: InputMaybe<attribute_options_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type variant_attribute_optionsproduct_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type product_variants = {
  id: Scalars['Int']['output'];
  product_id: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stock: Scalars['Int']['output'];
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  order_items?: Maybe<Array<Maybe<order_items>>>;
  products?: Maybe<Array<Maybe<products>>>;
  promotion_variants?: Maybe<Array<Maybe<promotion_variants>>>;
  variant_attribute_options?: Maybe<Array<Maybe<variant_attribute_options>>>;
  variant_images?: Maybe<Array<Maybe<variant_images>>>;
  variant_ratings?: Maybe<Array<Maybe<variant_ratings>>>;
};


export type product_variantsorder_itemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_items_WhereInput>;
  orderBy?: InputMaybe<order_items_OrderByInput>;
};


export type product_variantsproductsArgs = {
  where?: InputMaybe<products_WhereInput>;
  orderBy?: InputMaybe<products_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type product_variantspromotion_variantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<promotion_variants_WhereInput>;
  orderBy?: InputMaybe<promotion_variants_OrderByInput>;
};


export type product_variantsvariant_attribute_optionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_attribute_options_WhereInput>;
  orderBy?: InputMaybe<variant_attribute_options_OrderByInput>;
};


export type product_variantsvariant_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_images_WhereInput>;
  orderBy?: InputMaybe<variant_images_OrderByInput>;
};


export type product_variantsvariant_ratingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_ratings_WhereInput>;
  orderBy?: InputMaybe<variant_ratings_OrderByInput>;
};

/** Items/productos de cada orden */
export type order_items = {
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  /** Variante del producto comprada */
  variant_id: Scalars['Int']['output'];
  /** Nombre del producto al momento de compra */
  product_name: Scalars['String']['output'];
  /** SKU de la variante */
  variant_sku: Scalars['String']['output'];
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: Maybe<Scalars['JSON']['output']>;
  quantity: Scalars['Int']['output'];
  /** Precio unitario al momento de compra */
  unit_price: Scalars['Float']['output'];
  /** Precio total (quantity * unit_price) */
  total_price: Scalars['Float']['output'];
  /** Descuento aplicado a este item */
  discount_amount?: Maybe<Scalars['Float']['output']>;
  orders?: Maybe<Array<Maybe<orders>>>;
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
};


/** Items/productos de cada orden */
export type order_itemsordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Items/productos de cada orden */
export type order_itemsproduct_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Órdenes principales del ecommerce */
export type orders = {
  id: Scalars['Int']['output'];
  customer_id: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['output'];
  status: orders_status;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  /** Subtotal antes de descuentos */
  subtotal: Scalars['Float']['output'];
  /** Descuento aplicado */
  discount_amount?: Maybe<Scalars['Float']['output']>;
  /** Costo de envío */
  shipping_cost?: Maybe<Scalars['Float']['output']>;
  /** Impuestos (IGV) */
  tax_amount?: Maybe<Scalars['Float']['output']>;
  /** Total final a pagar */
  total_amount: Scalars['Float']['output'];
  /** Dirección de envío */
  shipping_address_id: Scalars['Int']['output'];
  /** Método de envío */
  shipping_method?: Maybe<Scalars['String']['output']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: Maybe<Scalars['Date']['output']>;
  /** Método de pago usado */
  payment_method?: Maybe<Scalars['String']['output']>;
  payment_status: orders_payment_status;
  /** Fecha de pago confirmado */
  paid_at?: Maybe<Scalars['Timestamp']['output']>;
  /** Notas del cliente */
  customer_notes?: Maybe<Scalars['String']['output']>;
  /** Notas internas del admin */
  admin_notes?: Maybe<Scalars['String']['output']>;
  coupon_usage?: Maybe<Array<Maybe<coupon_usage>>>;
  order_items?: Maybe<Array<Maybe<order_items>>>;
  order_tracking?: Maybe<Array<Maybe<order_tracking>>>;
  customers?: Maybe<Array<Maybe<customers>>>;
  customers_addresses?: Maybe<Array<Maybe<customers_addresses>>>;
  payment_transactions?: Maybe<Array<Maybe<payment_transactions>>>;
};


/** Órdenes principales del ecommerce */
export type orderscoupon_usageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<coupon_usage_WhereInput>;
  orderBy?: InputMaybe<coupon_usage_OrderByInput>;
};


/** Órdenes principales del ecommerce */
export type ordersorder_itemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_items_WhereInput>;
  orderBy?: InputMaybe<order_items_OrderByInput>;
};


/** Órdenes principales del ecommerce */
export type ordersorder_trackingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<order_tracking_WhereInput>;
  orderBy?: InputMaybe<order_tracking_OrderByInput>;
};


/** Órdenes principales del ecommerce */
export type orderscustomersArgs = {
  where?: InputMaybe<customers_WhereInput>;
  orderBy?: InputMaybe<customers_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Órdenes principales del ecommerce */
export type orderscustomers_addressesArgs = {
  where?: InputMaybe<customers_addresses_WhereInput>;
  orderBy?: InputMaybe<customers_addresses_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Órdenes principales del ecommerce */
export type orderspayment_transactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<payment_transactions_WhereInput>;
  orderBy?: InputMaybe<payment_transactions_OrderByInput>;
};

export type orders_status =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type orders_payment_status =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type coupon_usage = {
  id: Scalars['Int']['output'];
  coupon_id: Scalars['Int']['output'];
  customer_id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  discount_amount: Scalars['Float']['output'];
  used_at: Scalars['Timestamp']['output'];
  coupons?: Maybe<Array<Maybe<coupons>>>;
  customers?: Maybe<Array<Maybe<customers>>>;
  orders?: Maybe<Array<Maybe<orders>>>;
};


export type coupon_usagecouponsArgs = {
  where?: InputMaybe<coupons_WhereInput>;
  orderBy?: InputMaybe<coupons_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type coupon_usagecustomersArgs = {
  where?: InputMaybe<customers_WhereInput>;
  orderBy?: InputMaybe<customers_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type coupon_usageordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type coupons = {
  id: Scalars['Int']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discount_type: coupons_discount_type;
  discount_value: Scalars['Float']['output'];
  min_purchase_amount?: Maybe<Scalars['Float']['output']>;
  max_discount_amount?: Maybe<Scalars['Float']['output']>;
  usage_limit?: Maybe<Scalars['Int']['output']>;
  usage_limit_per_customer?: Maybe<Scalars['Int']['output']>;
  used_count?: Maybe<Scalars['Int']['output']>;
  start_date: Scalars['DateTime']['output'];
  end_date: Scalars['DateTime']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  applicable_to?: Maybe<coupons_applicable_to>;
  applicable_ids?: Maybe<Scalars['JSON']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  coupon_usage?: Maybe<Array<Maybe<coupon_usage>>>;
};


export type couponscoupon_usageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<coupon_usage_WhereInput>;
  orderBy?: InputMaybe<coupon_usage_OrderByInput>;
};

export type coupons_discount_type =
  | 'fixed_amount'
  | 'percentage';

export type coupons_applicable_to =
  | 'all'
  | 'categories'
  | 'products';

export type coupon_usage_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  coupon_id?: InputMaybe<Scalars['String']['input']>;
  customer_id?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['String']['input']>;
  discount_amount?: InputMaybe<Scalars['String']['input']>;
  used_at?: InputMaybe<Scalars['String']['input']>;
};

export type coupon_usage_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  coupon_id?: InputMaybe<OrderBy>;
  customer_id?: InputMaybe<OrderBy>;
  order_id?: InputMaybe<OrderBy>;
  discount_amount?: InputMaybe<OrderBy>;
  used_at?: InputMaybe<OrderBy>;
};

export type coupons_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount_type?: InputMaybe<Scalars['String']['input']>;
  discount_value?: InputMaybe<Scalars['String']['input']>;
  min_purchase_amount?: InputMaybe<Scalars['String']['input']>;
  max_discount_amount?: InputMaybe<Scalars['String']['input']>;
  usage_limit?: InputMaybe<Scalars['String']['input']>;
  usage_limit_per_customer?: InputMaybe<Scalars['String']['input']>;
  used_count?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  applicable_to?: InputMaybe<Scalars['String']['input']>;
  applicable_ids?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type coupons_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  code?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  discount_type?: InputMaybe<OrderBy>;
  discount_value?: InputMaybe<OrderBy>;
  min_purchase_amount?: InputMaybe<OrderBy>;
  max_discount_amount?: InputMaybe<OrderBy>;
  usage_limit?: InputMaybe<OrderBy>;
  usage_limit_per_customer?: InputMaybe<OrderBy>;
  used_count?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  end_date?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  applicable_to?: InputMaybe<OrderBy>;
  applicable_ids?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type customers = {
  id: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  address_id?: Maybe<Scalars['Int']['output']>;
  is_active?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** numero de celular */
  phone?: Maybe<Scalars['String']['output']>;
  /** Documento de identidad  */
  dni?: Maybe<Scalars['String']['output']>;
  coupon_usage?: Maybe<Array<Maybe<coupon_usage>>>;
  customers_addresses?: Maybe<Array<Maybe<customers_addresses>>>;
  orders?: Maybe<Array<Maybe<orders>>>;
  variant_ratings?: Maybe<Array<Maybe<variant_ratings>>>;
};


export type customerscoupon_usageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<coupon_usage_WhereInput>;
  orderBy?: InputMaybe<coupon_usage_OrderByInput>;
};


export type customerscustomers_addressesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<customers_addresses_WhereInput>;
  orderBy?: InputMaybe<customers_addresses_OrderByInput>;
};


export type customersordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
};


export type customersvariant_ratingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<variant_ratings_WhereInput>;
  orderBy?: InputMaybe<variant_ratings_OrderByInput>;
};

export type customers_addresses = {
  id: Scalars['Int']['output'];
  id_customer: Scalars['Int']['output'];
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias: Scalars['String']['output'];
  department: Scalars['String']['output'];
  province: Scalars['String']['output'];
  district: Scalars['String']['output'];
  /** Nombre de la avenida/calle/jirón */
  street_name: Scalars['String']['output'];
  /** Número de la dirección */
  street_number: Scalars['String']['output'];
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: Maybe<Scalars['String']['output']>;
  /** Latitud GPS */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Longitud GPS */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** 1 = dirección por defecto */
  is_default?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  customers?: Maybe<Array<Maybe<customers>>>;
  orders?: Maybe<Array<Maybe<orders>>>;
};


export type customers_addressescustomersArgs = {
  where?: InputMaybe<customers_WhereInput>;
  orderBy?: InputMaybe<customers_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type customers_addressesordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
};

export type customers_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  address_id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type customers_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  password?: InputMaybe<OrderBy>;
  address_id?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  lastname?: InputMaybe<OrderBy>;
  photo?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** numero de celular */
  phone?: InputMaybe<OrderBy>;
  /** Documento de identidad  */
  dni?: InputMaybe<OrderBy>;
};

/** Órdenes principales del ecommerce */
export type orders_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  customer_id?: InputMaybe<Scalars['String']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<Scalars['String']['input']>;
  /** Descuento aplicado */
  discount_amount?: InputMaybe<Scalars['String']['input']>;
  /** Costo de envío */
  shipping_cost?: InputMaybe<Scalars['String']['input']>;
  /** Impuestos (IGV) */
  tax_amount?: InputMaybe<Scalars['String']['input']>;
  /** Total final a pagar */
  total_amount?: InputMaybe<Scalars['String']['input']>;
  /** Dirección de envío */
  shipping_address_id?: InputMaybe<Scalars['String']['input']>;
  /** Método de envío */
  shipping_method?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['String']['input']>;
  /** Método de pago usado */
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_status?: InputMaybe<Scalars['String']['input']>;
  /** Fecha de pago confirmado */
  paid_at?: InputMaybe<Scalars['String']['input']>;
  /** Notas del cliente */
  customer_notes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  admin_notes?: InputMaybe<Scalars['String']['input']>;
};

/** Órdenes principales del ecommerce */
export type orders_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  customer_id?: InputMaybe<OrderBy>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<OrderBy>;
  /** Descuento aplicado */
  discount_amount?: InputMaybe<OrderBy>;
  /** Costo de envío */
  shipping_cost?: InputMaybe<OrderBy>;
  /** Impuestos (IGV) */
  tax_amount?: InputMaybe<OrderBy>;
  /** Total final a pagar */
  total_amount?: InputMaybe<OrderBy>;
  /** Dirección de envío */
  shipping_address_id?: InputMaybe<OrderBy>;
  /** Método de envío */
  shipping_method?: InputMaybe<OrderBy>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<OrderBy>;
  /** Método de pago usado */
  payment_method?: InputMaybe<OrderBy>;
  payment_status?: InputMaybe<OrderBy>;
  /** Fecha de pago confirmado */
  paid_at?: InputMaybe<OrderBy>;
  /** Notas del cliente */
  customer_notes?: InputMaybe<OrderBy>;
  /** Notas internas del admin */
  admin_notes?: InputMaybe<OrderBy>;
};

export type customers_addresses_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_customer?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la avenida/calle/jirón */
  street_name?: InputMaybe<Scalars['String']['input']>;
  /** Número de la dirección */
  street_number?: InputMaybe<Scalars['String']['input']>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['String']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['String']['input']>;
  /** 1 = dirección por defecto */
  is_default?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type customers_addresses_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  id_customer?: InputMaybe<OrderBy>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<OrderBy>;
  department?: InputMaybe<OrderBy>;
  province?: InputMaybe<OrderBy>;
  district?: InputMaybe<OrderBy>;
  /** Nombre de la avenida/calle/jirón */
  street_name?: InputMaybe<OrderBy>;
  /** Número de la dirección */
  street_number?: InputMaybe<OrderBy>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<OrderBy>;
  /** Latitud GPS */
  latitude?: InputMaybe<OrderBy>;
  /** Longitud GPS */
  longitude?: InputMaybe<OrderBy>;
  /** 1 = dirección por defecto */
  is_default?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type variant_ratings = {
  id: Scalars['Int']['output'];
  variant_id: Scalars['Int']['output'];
  customer_id: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  review?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  verified_purchase: Scalars['Int']['output'];
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  rating_images?: Maybe<Array<Maybe<rating_images>>>;
  customers?: Maybe<Array<Maybe<customers>>>;
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
};


export type variant_ratingsrating_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<rating_images_WhereInput>;
  orderBy?: InputMaybe<rating_images_OrderByInput>;
};


export type variant_ratingscustomersArgs = {
  where?: InputMaybe<customers_WhereInput>;
  orderBy?: InputMaybe<customers_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type variant_ratingsproduct_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type rating_images = {
  id: Scalars['Int']['output'];
  rating_id: Scalars['Int']['output'];
  image_url: Scalars['String']['output'];
  created_at: Scalars['Timestamp']['output'];
  variant_ratings?: Maybe<Array<Maybe<variant_ratings>>>;
};


export type rating_imagesvariant_ratingsArgs = {
  where?: InputMaybe<variant_ratings_WhereInput>;
  orderBy?: InputMaybe<variant_ratings_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type variant_ratings_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  variant_id?: InputMaybe<Scalars['String']['input']>;
  customer_id?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['String']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verified_purchase?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type variant_ratings_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  variant_id?: InputMaybe<OrderBy>;
  customer_id?: InputMaybe<OrderBy>;
  rating?: InputMaybe<OrderBy>;
  review?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  verified_purchase?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type rating_images_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  rating_id?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
};

export type rating_images_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  rating_id?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
};

export type product_variants_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  product_id?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type product_variants_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  product_id?: InputMaybe<OrderBy>;
  sku?: InputMaybe<OrderBy>;
  price?: InputMaybe<OrderBy>;
  stock?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** Items/productos de cada orden */
export type order_items_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['String']['input']>;
  /** Variante del producto comprada */
  variant_id?: InputMaybe<Scalars['String']['input']>;
  /** Nombre del producto al momento de compra */
  product_name?: InputMaybe<Scalars['String']['input']>;
  /** SKU de la variante */
  variant_sku?: InputMaybe<Scalars['String']['input']>;
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  /** Precio unitario al momento de compra */
  unit_price?: InputMaybe<Scalars['String']['input']>;
  /** Precio total (quantity * unit_price) */
  total_price?: InputMaybe<Scalars['String']['input']>;
  /** Descuento aplicado a este item */
  discount_amount?: InputMaybe<Scalars['String']['input']>;
};

/** Items/productos de cada orden */
export type order_items_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  order_id?: InputMaybe<OrderBy>;
  /** Variante del producto comprada */
  variant_id?: InputMaybe<OrderBy>;
  /** Nombre del producto al momento de compra */
  product_name?: InputMaybe<OrderBy>;
  /** SKU de la variante */
  variant_sku?: InputMaybe<OrderBy>;
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  /** Precio unitario al momento de compra */
  unit_price?: InputMaybe<OrderBy>;
  /** Precio total (quantity * unit_price) */
  total_price?: InputMaybe<OrderBy>;
  /** Descuento aplicado a este item */
  discount_amount?: InputMaybe<OrderBy>;
};

/** Seguimiento de envíos */
export type order_tracking = {
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  /** Número de seguimiento del courier */
  tracking_number?: Maybe<Scalars['String']['output']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: Maybe<Scalars['String']['output']>;
  status: order_tracking_status;
  /** Ubicación actual del paquete */
  current_location?: Maybe<Scalars['String']['output']>;
  shipped_at?: Maybe<Scalars['Timestamp']['output']>;
  delivered_at?: Maybe<Scalars['Timestamp']['output']>;
  /** Nombre de quien recibió */
  delivered_to?: Maybe<Scalars['String']['output']>;
  /** Notas de entrega */
  delivery_notes?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  orders?: Maybe<Array<Maybe<orders>>>;
};


/** Seguimiento de envíos */
export type order_trackingordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type order_tracking_status =
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery';

/** Seguimiento de envíos */
export type order_tracking_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['String']['input']>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  /** Ubicación actual del paquete */
  current_location?: InputMaybe<Scalars['String']['input']>;
  shipped_at?: InputMaybe<Scalars['String']['input']>;
  delivered_at?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de quien recibió */
  delivered_to?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  delivery_notes?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

/** Seguimiento de envíos */
export type order_tracking_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  order_id?: InputMaybe<OrderBy>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<OrderBy>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  /** Ubicación actual del paquete */
  current_location?: InputMaybe<OrderBy>;
  shipped_at?: InputMaybe<OrderBy>;
  delivered_at?: InputMaybe<OrderBy>;
  /** Nombre de quien recibió */
  delivered_to?: InputMaybe<OrderBy>;
  /** Notas de entrega */
  delivery_notes?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type payment_transactions = {
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  payment_method_id: Scalars['Int']['output'];
  transaction_id?: Maybe<Scalars['String']['output']>;
  reference_number?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  processing_fee?: Maybe<Scalars['Float']['output']>;
  net_amount: Scalars['Float']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  status?: Maybe<payment_transactions_status>;
  payment_data?: Maybe<Scalars['JSON']['output']>;
  gateway_response?: Maybe<Scalars['JSON']['output']>;
  processed_at?: Maybe<Scalars['Timestamp']['output']>;
  expires_at?: Maybe<Scalars['Timestamp']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  orders?: Maybe<Array<Maybe<orders>>>;
  payment_methods?: Maybe<Array<Maybe<payment_methods>>>;
};


export type payment_transactionsordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
  orderBy?: InputMaybe<orders_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type payment_transactionspayment_methodsArgs = {
  where?: InputMaybe<payment_methods_WhereInput>;
  orderBy?: InputMaybe<payment_methods_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type payment_transactions_status =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type payment_methods = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  processing_fee_type?: Maybe<payment_methods_processing_fee_type>;
  processing_fee_value?: Maybe<Scalars['Float']['output']>;
  min_amount?: Maybe<Scalars['Float']['output']>;
  max_amount?: Maybe<Scalars['Float']['output']>;
  is_active?: Maybe<Scalars['Int']['output']>;
  requires_verification?: Maybe<Scalars['Int']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  payment_transactions?: Maybe<Array<Maybe<payment_transactions>>>;
};


export type payment_methodspayment_transactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<payment_transactions_WhereInput>;
  orderBy?: InputMaybe<payment_transactions_OrderByInput>;
};

export type payment_methods_processing_fee_type =
  | 'fixed'
  | 'percentage';

export type payment_transactions_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['String']['input']>;
  payment_method_id?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['String']['input']>;
  reference_number?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['String']['input']>;
  processing_fee?: InputMaybe<Scalars['String']['input']>;
  net_amount?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  payment_data?: InputMaybe<Scalars['String']['input']>;
  gateway_response?: InputMaybe<Scalars['String']['input']>;
  processed_at?: InputMaybe<Scalars['String']['input']>;
  expires_at?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type payment_transactions_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  order_id?: InputMaybe<OrderBy>;
  payment_method_id?: InputMaybe<OrderBy>;
  transaction_id?: InputMaybe<OrderBy>;
  reference_number?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  processing_fee?: InputMaybe<OrderBy>;
  net_amount?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  payment_data?: InputMaybe<OrderBy>;
  gateway_response?: InputMaybe<OrderBy>;
  processed_at?: InputMaybe<OrderBy>;
  expires_at?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type payment_methods_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon_url?: InputMaybe<Scalars['String']['input']>;
  processing_fee_type?: InputMaybe<Scalars['String']['input']>;
  processing_fee_value?: InputMaybe<Scalars['String']['input']>;
  min_amount?: InputMaybe<Scalars['String']['input']>;
  max_amount?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  requires_verification?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type payment_methods_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  code?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon_url?: InputMaybe<OrderBy>;
  processing_fee_type?: InputMaybe<OrderBy>;
  processing_fee_value?: InputMaybe<OrderBy>;
  min_amount?: InputMaybe<OrderBy>;
  max_amount?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  requires_verification?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
  settings?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type products = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  brand_id?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  base_price?: Maybe<Scalars['Float']['output']>;
  product_categories?: Maybe<Array<Maybe<product_categories>>>;
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
  brands?: Maybe<Array<Maybe<brands>>>;
};


export type productsproduct_categoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_categories_WhereInput>;
  orderBy?: InputMaybe<product_categories_OrderByInput>;
};


export type productsproduct_variantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
};


export type productsbrandsArgs = {
  where?: InputMaybe<brands_WhereInput>;
  orderBy?: InputMaybe<brands_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type product_categories = {
  product_id: Scalars['Int']['output'];
  category_id: Scalars['Int']['output'];
  categories?: Maybe<Array<Maybe<categories>>>;
  products?: Maybe<Array<Maybe<products>>>;
};


export type product_categoriescategoriesArgs = {
  where?: InputMaybe<categories_WhereInput>;
  orderBy?: InputMaybe<categories_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type product_categoriesproductsArgs = {
  where?: InputMaybe<products_WhereInput>;
  orderBy?: InputMaybe<products_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type categories = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  parent_id?: Maybe<Scalars['Int']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  product_categories?: Maybe<Array<Maybe<product_categories>>>;
};


export type categoriesproduct_categoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<product_categories_WhereInput>;
  orderBy?: InputMaybe<product_categories_OrderByInput>;
};

export type product_categories_WhereInput = {
  product_id?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['String']['input']>;
};

export type product_categories_OrderByInput = {
  product_id?: InputMaybe<OrderBy>;
  category_id?: InputMaybe<OrderBy>;
};

export type categories_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type categories_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
};

export type products_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  brand_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  base_price?: InputMaybe<Scalars['String']['input']>;
};

export type products_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  brand_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  base_price?: InputMaybe<OrderBy>;
};

export type brands = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Maybe<products>>>;
};


export type brandsproductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<products_WhereInput>;
  orderBy?: InputMaybe<products_OrderByInput>;
};

export type brands_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type brands_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

export type promotion_variants = {
  promotion_id: Scalars['Int']['output'];
  variant_id: Scalars['Int']['output'];
  promotion_price?: Maybe<Scalars['Float']['output']>;
  stock_limit: Scalars['Int']['output'];
  created_at: Scalars['Timestamp']['output'];
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
  promotions?: Maybe<Array<Maybe<promotions>>>;
};


export type promotion_variantsproduct_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type promotion_variantspromotionsArgs = {
  where?: InputMaybe<promotions_WhereInput>;
  orderBy?: InputMaybe<promotions_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type promotions = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  start_date: Scalars['DateTime']['output'];
  end_date: Scalars['DateTime']['output'];
  discount_type: promotions_discount_type;
  discount_value: Scalars['Float']['output'];
  min_purchase_amount?: Maybe<Scalars['Float']['output']>;
  is_active?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  promotion_variants?: Maybe<Array<Maybe<promotion_variants>>>;
};


export type promotionspromotion_variantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<promotion_variants_WhereInput>;
  orderBy?: InputMaybe<promotion_variants_OrderByInput>;
};

export type promotions_discount_type =
  | 'percentage'
  | 'fixed_amount';

export type promotion_variants_WhereInput = {
  promotion_id?: InputMaybe<Scalars['String']['input']>;
  variant_id?: InputMaybe<Scalars['String']['input']>;
  promotion_price?: InputMaybe<Scalars['String']['input']>;
  stock_limit?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
};

export type promotion_variants_OrderByInput = {
  promotion_id?: InputMaybe<OrderBy>;
  variant_id?: InputMaybe<OrderBy>;
  promotion_price?: InputMaybe<OrderBy>;
  stock_limit?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
};

export type promotions_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['String']['input']>;
  discount_type?: InputMaybe<Scalars['String']['input']>;
  discount_value?: InputMaybe<Scalars['String']['input']>;
  min_purchase_amount?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type promotions_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  end_date?: InputMaybe<OrderBy>;
  discount_type?: InputMaybe<OrderBy>;
  discount_value?: InputMaybe<OrderBy>;
  min_purchase_amount?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type variant_attribute_options_WhereInput = {
  variant_id?: InputMaybe<Scalars['String']['input']>;
  attribute_option_id?: InputMaybe<Scalars['String']['input']>;
};

export type variant_attribute_options_OrderByInput = {
  variant_id?: InputMaybe<OrderBy>;
  attribute_option_id?: InputMaybe<OrderBy>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_images = {
  id: Scalars['Int']['output'];
  variant_id: Scalars['Int']['output'];
  image_type: variant_images_image_type;
  /** Imagen thumbnail 140x140 */
  image_url_thumb: Scalars['String']['output'];
  /** Imagen normal 600x800 */
  image_url_normal: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 */
  image_url_zoom: Scalars['String']['output'];
  /** Imagen principal de la variante */
  is_primary?: Maybe<Scalars['Int']['output']>;
  /** Orden de visualización */
  display_order?: Maybe<Scalars['Int']['output']>;
  /** Texto alternativo para SEO */
  alt_text?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  product_variants?: Maybe<Array<Maybe<product_variants>>>;
};


/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_imagesproduct_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
  orderBy?: InputMaybe<product_variants_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type variant_images_image_type =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'detail'
  | 'lifestyle'
  | 'packaging';

/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_images_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  variant_id?: InputMaybe<Scalars['String']['input']>;
  image_type?: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 */
  image_url_thumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 */
  image_url_normal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  image_url_zoom?: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  is_primary?: InputMaybe<Scalars['String']['input']>;
  /** Orden de visualización */
  display_order?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo para SEO */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_images_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  variant_id?: InputMaybe<OrderBy>;
  image_type?: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 */
  image_url_thumb?: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 */
  image_url_normal?: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 */
  image_url_zoom?: InputMaybe<OrderBy>;
  /** Imagen principal de la variante */
  is_primary?: InputMaybe<OrderBy>;
  /** Orden de visualización */
  display_order?: InputMaybe<OrderBy>;
  /** Texto alternativo para SEO */
  alt_text?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type banner = {
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  display_order?: Maybe<Scalars['Int']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
};

export type banner_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type banner_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
  link?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
};

/** VIEW */
export type order_summary = {
  id: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['output'];
  customer_id: Scalars['Int']['output'];
  customer_name?: Maybe<Scalars['String']['output']>;
  customer_email?: Maybe<Scalars['String']['output']>;
  status: order_summary_status;
  payment_status: order_summary_payment_status;
  /** Total final a pagar */
  total_amount: Scalars['Float']['output'];
  created_at: Scalars['Timestamp']['output'];
  /** Fecha estimada de entrega */
  estimated_delivery?: Maybe<Scalars['Date']['output']>;
  total_items: Scalars['BigInt']['output'];
  total_quantity?: Maybe<Scalars['Float']['output']>;
  /** Número de seguimiento del courier */
  tracking_number?: Maybe<Scalars['String']['output']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: Maybe<Scalars['String']['output']>;
};

export type order_summary_status =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type order_summary_payment_status =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

/** VIEW */
export type order_summary_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<Scalars['String']['input']>;
  customer_id?: InputMaybe<Scalars['String']['input']>;
  customer_name?: InputMaybe<Scalars['String']['input']>;
  customer_email?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  payment_status?: InputMaybe<Scalars['String']['input']>;
  /** Total final a pagar */
  total_amount?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['String']['input']>;
  total_items?: InputMaybe<Scalars['String']['input']>;
  total_quantity?: InputMaybe<Scalars['String']['input']>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type order_summary_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<OrderBy>;
  customer_id?: InputMaybe<OrderBy>;
  customer_name?: InputMaybe<OrderBy>;
  customer_email?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  payment_status?: InputMaybe<OrderBy>;
  /** Total final a pagar */
  total_amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<OrderBy>;
  total_items?: InputMaybe<OrderBy>;
  total_quantity?: InputMaybe<OrderBy>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<OrderBy>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<OrderBy>;
};

export type permissions = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
};

export type permissions_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type permissions_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** VIEW */
export type product_rating_summary = {
  product_id: Scalars['Int']['output'];
  total_ratings: Scalars['BigInt']['output'];
  average_rating?: Maybe<Scalars['Float']['output']>;
  five_star?: Maybe<Scalars['Float']['output']>;
  four_star?: Maybe<Scalars['Float']['output']>;
  three_star?: Maybe<Scalars['Float']['output']>;
  two_star?: Maybe<Scalars['Float']['output']>;
  one_star?: Maybe<Scalars['Float']['output']>;
  verified_purchases?: Maybe<Scalars['Float']['output']>;
};

/** VIEW */
export type product_rating_summary_WhereInput = {
  product_id?: InputMaybe<Scalars['String']['input']>;
  total_ratings?: InputMaybe<Scalars['String']['input']>;
  average_rating?: InputMaybe<Scalars['String']['input']>;
  five_star?: InputMaybe<Scalars['String']['input']>;
  four_star?: InputMaybe<Scalars['String']['input']>;
  three_star?: InputMaybe<Scalars['String']['input']>;
  two_star?: InputMaybe<Scalars['String']['input']>;
  one_star?: InputMaybe<Scalars['String']['input']>;
  verified_purchases?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type product_rating_summary_OrderByInput = {
  product_id?: InputMaybe<OrderBy>;
  total_ratings?: InputMaybe<OrderBy>;
  average_rating?: InputMaybe<OrderBy>;
  five_star?: InputMaybe<OrderBy>;
  four_star?: InputMaybe<OrderBy>;
  three_star?: InputMaybe<OrderBy>;
  two_star?: InputMaybe<OrderBy>;
  one_star?: InputMaybe<OrderBy>;
  verified_purchases?: InputMaybe<OrderBy>;
};

export type roles = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  roles_sections?: Maybe<Array<Maybe<roles_sections>>>;
  users?: Maybe<Array<Maybe<users>>>;
};


export type rolesroles_sectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<roles_sections_WhereInput>;
  orderBy?: InputMaybe<roles_sections_OrderByInput>;
};


export type rolesusersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<users_WhereInput>;
  orderBy?: InputMaybe<users_OrderByInput>;
};

export type roles_sections = {
  id: Scalars['Int']['output'];
  id_section?: Maybe<Scalars['Int']['output']>;
  id_rol?: Maybe<Scalars['Int']['output']>;
  roles?: Maybe<Array<Maybe<roles>>>;
  sections?: Maybe<Array<Maybe<sections>>>;
};


export type roles_sectionsrolesArgs = {
  where?: InputMaybe<roles_WhereInput>;
  orderBy?: InputMaybe<roles_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type roles_sectionssectionsArgs = {
  where?: InputMaybe<sections_WhereInput>;
  orderBy?: InputMaybe<sections_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type roles_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type roles_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type sections = {
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  roles_sections?: Maybe<Array<Maybe<roles_sections>>>;
};


export type sectionsroles_sectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<roles_sections_WhereInput>;
  orderBy?: InputMaybe<roles_sections_OrderByInput>;
};

export type roles_sections_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_section?: InputMaybe<Scalars['String']['input']>;
  id_rol?: InputMaybe<Scalars['String']['input']>;
};

export type roles_sections_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  id_section?: InputMaybe<OrderBy>;
  id_rol?: InputMaybe<OrderBy>;
};

export type sections_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
};

export type sections_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
};

export type users = {
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  role_id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<roles>>>;
};


export type usersrolesArgs = {
  where?: InputMaybe<roles_WhereInput>;
  orderBy?: InputMaybe<roles_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type users_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type users_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  username?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  password?: InputMaybe<OrderBy>;
  role_id?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  lastname?: InputMaybe<OrderBy>;
  photo?: InputMaybe<OrderBy>;
};

export type services = {
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  display_order?: Maybe<Scalars['Int']['output']>;
  services_images?: Maybe<Array<Maybe<services_images>>>;
};


export type servicesservices_imagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<services_images_WhereInput>;
  orderBy?: InputMaybe<services_images_OrderByInput>;
};

export type services_images = {
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  display_order?: Maybe<Scalars['Int']['output']>;
  id_service?: Maybe<Scalars['Int']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  services?: Maybe<Array<Maybe<services>>>;
};


export type services_imagesservicesArgs = {
  where?: InputMaybe<services_WhereInput>;
  orderBy?: InputMaybe<services_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type services_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
};

export type services_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
  slug?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
};

export type services_images_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
  id_service?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type services_images_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
  id_service?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
};

export type shipping_methods = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  base_cost: Scalars['Float']['output'];
  free_shipping_threshold?: Maybe<Scalars['Float']['output']>;
  estimated_days_min?: Maybe<Scalars['Int']['output']>;
  estimated_days_max?: Maybe<Scalars['Int']['output']>;
  is_active?: Maybe<Scalars['Int']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  shipping_zone_methods?: Maybe<Array<Maybe<shipping_zone_methods>>>;
};


export type shipping_methodsshipping_zone_methodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
  orderBy?: InputMaybe<shipping_zone_methods_OrderByInput>;
};

export type shipping_zone_methods = {
  id: Scalars['Int']['output'];
  shipping_method_id: Scalars['Int']['output'];
  shipping_zone_id: Scalars['Int']['output'];
  cost: Scalars['Float']['output'];
  free_shipping_threshold?: Maybe<Scalars['Float']['output']>;
  estimated_days_min?: Maybe<Scalars['Int']['output']>;
  estimated_days_max?: Maybe<Scalars['Int']['output']>;
  is_active?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  shipping_methods?: Maybe<Array<Maybe<shipping_methods>>>;
  shipping_zones?: Maybe<Array<Maybe<shipping_zones>>>;
};


export type shipping_zone_methodsshipping_methodsArgs = {
  where?: InputMaybe<shipping_methods_WhereInput>;
  orderBy?: InputMaybe<shipping_methods_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type shipping_zone_methodsshipping_zonesArgs = {
  where?: InputMaybe<shipping_zones_WhereInput>;
  orderBy?: InputMaybe<shipping_zones_OrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type shipping_methods_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  base_cost?: InputMaybe<Scalars['String']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['String']['input']>;
  estimated_days_min?: InputMaybe<Scalars['String']['input']>;
  estimated_days_max?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type shipping_methods_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  base_cost?: InputMaybe<OrderBy>;
  free_shipping_threshold?: InputMaybe<OrderBy>;
  estimated_days_min?: InputMaybe<OrderBy>;
  estimated_days_max?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  display_order?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type shipping_zones = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  districts: Scalars['JSON']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  updated_at: Scalars['Timestamp']['output'];
  shipping_zone_methods?: Maybe<Array<Maybe<shipping_zone_methods>>>;
};


export type shipping_zonesshipping_zone_methodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
  orderBy?: InputMaybe<shipping_zone_methods_OrderByInput>;
};

export type shipping_zone_methods_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  shipping_method_id?: InputMaybe<Scalars['String']['input']>;
  shipping_zone_id?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['String']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['String']['input']>;
  estimated_days_min?: InputMaybe<Scalars['String']['input']>;
  estimated_days_max?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type shipping_zone_methods_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  shipping_method_id?: InputMaybe<OrderBy>;
  shipping_zone_id?: InputMaybe<OrderBy>;
  cost?: InputMaybe<OrderBy>;
  free_shipping_threshold?: InputMaybe<OrderBy>;
  estimated_days_min?: InputMaybe<OrderBy>;
  estimated_days_max?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

export type shipping_zones_WhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  districts?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['String']['input']>;
};

export type shipping_zones_OrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  districts?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** VIEW */
export type variant_rating_summary = {
  variant_id: Scalars['Int']['output'];
  total_ratings: Scalars['BigInt']['output'];
  average_rating?: Maybe<Scalars['Float']['output']>;
  five_star?: Maybe<Scalars['Float']['output']>;
  four_star?: Maybe<Scalars['Float']['output']>;
  three_star?: Maybe<Scalars['Float']['output']>;
  two_star?: Maybe<Scalars['Float']['output']>;
  one_star?: Maybe<Scalars['Float']['output']>;
  verified_purchases?: Maybe<Scalars['Float']['output']>;
};

/** VIEW */
export type variant_rating_summary_WhereInput = {
  variant_id?: InputMaybe<Scalars['String']['input']>;
  total_ratings?: InputMaybe<Scalars['String']['input']>;
  average_rating?: InputMaybe<Scalars['String']['input']>;
  five_star?: InputMaybe<Scalars['String']['input']>;
  four_star?: InputMaybe<Scalars['String']['input']>;
  three_star?: InputMaybe<Scalars['String']['input']>;
  two_star?: InputMaybe<Scalars['String']['input']>;
  one_star?: InputMaybe<Scalars['String']['input']>;
  verified_purchases?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type variant_rating_summary_OrderByInput = {
  variant_id?: InputMaybe<OrderBy>;
  total_ratings?: InputMaybe<OrderBy>;
  average_rating?: InputMaybe<OrderBy>;
  five_star?: InputMaybe<OrderBy>;
  four_star?: InputMaybe<OrderBy>;
  three_star?: InputMaybe<OrderBy>;
  two_star?: InputMaybe<OrderBy>;
  one_star?: InputMaybe<OrderBy>;
  verified_purchases?: InputMaybe<OrderBy>;
};

export type Mutation = {
  insert_attribute_option_images?: Maybe<attribute_option_images>;
  update_attribute_option_images?: Maybe<attribute_option_images>;
  delete_attribute_option_images?: Maybe<Scalars['Boolean']['output']>;
  insert_attribute_options?: Maybe<attribute_options>;
  update_attribute_options?: Maybe<attribute_options>;
  delete_attribute_options?: Maybe<Scalars['Boolean']['output']>;
  insert_attributes?: Maybe<attributes>;
  update_attributes?: Maybe<attributes>;
  delete_attributes?: Maybe<Scalars['Boolean']['output']>;
  insert_banner?: Maybe<banner>;
  update_banner?: Maybe<banner>;
  delete_banner?: Maybe<Scalars['Boolean']['output']>;
  insert_brands?: Maybe<brands>;
  update_brands?: Maybe<brands>;
  delete_brands?: Maybe<Scalars['Boolean']['output']>;
  insert_categories?: Maybe<categories>;
  update_categories?: Maybe<categories>;
  delete_categories?: Maybe<Scalars['Boolean']['output']>;
  insert_coupon_usage?: Maybe<coupon_usage>;
  update_coupon_usage?: Maybe<coupon_usage>;
  delete_coupon_usage?: Maybe<Scalars['Boolean']['output']>;
  insert_coupons?: Maybe<coupons>;
  update_coupons?: Maybe<coupons>;
  delete_coupons?: Maybe<Scalars['Boolean']['output']>;
  insert_customers?: Maybe<customers>;
  update_customers?: Maybe<customers>;
  delete_customers?: Maybe<Scalars['Boolean']['output']>;
  insert_customers_addresses?: Maybe<customers_addresses>;
  update_customers_addresses?: Maybe<customers_addresses>;
  delete_customers_addresses?: Maybe<Scalars['Boolean']['output']>;
  insert_order_items?: Maybe<order_items>;
  update_order_items?: Maybe<order_items>;
  delete_order_items?: Maybe<Scalars['Boolean']['output']>;
  insert_order_summary?: Maybe<order_summary>;
  update_order_summary?: Maybe<order_summary>;
  delete_order_summary?: Maybe<Scalars['Boolean']['output']>;
  insert_order_tracking?: Maybe<order_tracking>;
  update_order_tracking?: Maybe<order_tracking>;
  delete_order_tracking?: Maybe<Scalars['Boolean']['output']>;
  insert_orders?: Maybe<orders>;
  update_orders?: Maybe<orders>;
  delete_orders?: Maybe<Scalars['Boolean']['output']>;
  insert_payment_methods?: Maybe<payment_methods>;
  update_payment_methods?: Maybe<payment_methods>;
  delete_payment_methods?: Maybe<Scalars['Boolean']['output']>;
  insert_payment_transactions?: Maybe<payment_transactions>;
  update_payment_transactions?: Maybe<payment_transactions>;
  delete_payment_transactions?: Maybe<Scalars['Boolean']['output']>;
  insert_permissions?: Maybe<permissions>;
  update_permissions?: Maybe<permissions>;
  delete_permissions?: Maybe<Scalars['Boolean']['output']>;
  insert_product_categories?: Maybe<product_categories>;
  update_product_categories?: Maybe<product_categories>;
  delete_product_categories?: Maybe<Scalars['Boolean']['output']>;
  insert_product_rating_summary?: Maybe<product_rating_summary>;
  update_product_rating_summary?: Maybe<product_rating_summary>;
  delete_product_rating_summary?: Maybe<Scalars['Boolean']['output']>;
  insert_product_variants?: Maybe<product_variants>;
  update_product_variants?: Maybe<product_variants>;
  delete_product_variants?: Maybe<Scalars['Boolean']['output']>;
  insert_products?: Maybe<products>;
  update_products?: Maybe<products>;
  delete_products?: Maybe<Scalars['Boolean']['output']>;
  insert_promotion_variants?: Maybe<promotion_variants>;
  update_promotion_variants?: Maybe<promotion_variants>;
  delete_promotion_variants?: Maybe<Scalars['Boolean']['output']>;
  insert_promotions?: Maybe<promotions>;
  update_promotions?: Maybe<promotions>;
  delete_promotions?: Maybe<Scalars['Boolean']['output']>;
  insert_rating_images?: Maybe<rating_images>;
  update_rating_images?: Maybe<rating_images>;
  delete_rating_images?: Maybe<Scalars['Boolean']['output']>;
  insert_roles?: Maybe<roles>;
  update_roles?: Maybe<roles>;
  delete_roles?: Maybe<Scalars['Boolean']['output']>;
  insert_roles_sections?: Maybe<roles_sections>;
  update_roles_sections?: Maybe<roles_sections>;
  delete_roles_sections?: Maybe<Scalars['Boolean']['output']>;
  insert_sections?: Maybe<sections>;
  update_sections?: Maybe<sections>;
  delete_sections?: Maybe<Scalars['Boolean']['output']>;
  insert_services?: Maybe<services>;
  update_services?: Maybe<services>;
  delete_services?: Maybe<Scalars['Boolean']['output']>;
  insert_services_images?: Maybe<services_images>;
  update_services_images?: Maybe<services_images>;
  delete_services_images?: Maybe<Scalars['Boolean']['output']>;
  insert_shipping_methods?: Maybe<shipping_methods>;
  update_shipping_methods?: Maybe<shipping_methods>;
  delete_shipping_methods?: Maybe<Scalars['Boolean']['output']>;
  insert_shipping_zone_methods?: Maybe<shipping_zone_methods>;
  update_shipping_zone_methods?: Maybe<shipping_zone_methods>;
  delete_shipping_zone_methods?: Maybe<Scalars['Boolean']['output']>;
  insert_shipping_zones?: Maybe<shipping_zones>;
  update_shipping_zones?: Maybe<shipping_zones>;
  delete_shipping_zones?: Maybe<Scalars['Boolean']['output']>;
  insert_users?: Maybe<users>;
  update_users?: Maybe<users>;
  delete_users?: Maybe<Scalars['Boolean']['output']>;
  insert_variant_attribute_options?: Maybe<variant_attribute_options>;
  update_variant_attribute_options?: Maybe<variant_attribute_options>;
  delete_variant_attribute_options?: Maybe<Scalars['Boolean']['output']>;
  insert_variant_images?: Maybe<variant_images>;
  update_variant_images?: Maybe<variant_images>;
  delete_variant_images?: Maybe<Scalars['Boolean']['output']>;
  insert_variant_rating_summary?: Maybe<variant_rating_summary>;
  update_variant_rating_summary?: Maybe<variant_rating_summary>;
  delete_variant_rating_summary?: Maybe<Scalars['Boolean']['output']>;
  insert_variant_ratings?: Maybe<variant_ratings>;
  update_variant_ratings?: Maybe<variant_ratings>;
  delete_variant_ratings?: Maybe<Scalars['Boolean']['output']>;
};


export type Mutationinsert_attribute_option_imagesArgs = {
  attribute_option_images: attribute_option_images_InsertInput;
};


export type Mutationupdate_attribute_option_imagesArgs = {
  attribute_option_images: attribute_option_images_UpdateInput;
  where?: InputMaybe<attribute_option_images_WhereInput>;
};


export type Mutationdelete_attribute_option_imagesArgs = {
  where?: InputMaybe<attribute_option_images_WhereInput>;
};


export type Mutationinsert_attribute_optionsArgs = {
  attribute_options: attribute_options_InsertInput;
};


export type Mutationupdate_attribute_optionsArgs = {
  attribute_options: attribute_options_UpdateInput;
  where?: InputMaybe<attribute_options_WhereInput>;
};


export type Mutationdelete_attribute_optionsArgs = {
  where?: InputMaybe<attribute_options_WhereInput>;
};


export type Mutationinsert_attributesArgs = {
  attributes: attributes_InsertInput;
};


export type Mutationupdate_attributesArgs = {
  attributes: attributes_UpdateInput;
  where?: InputMaybe<attributes_WhereInput>;
};


export type Mutationdelete_attributesArgs = {
  where?: InputMaybe<attributes_WhereInput>;
};


export type Mutationinsert_bannerArgs = {
  banner: banner_InsertInput;
};


export type Mutationupdate_bannerArgs = {
  banner: banner_UpdateInput;
  where?: InputMaybe<banner_WhereInput>;
};


export type Mutationdelete_bannerArgs = {
  where?: InputMaybe<banner_WhereInput>;
};


export type Mutationinsert_brandsArgs = {
  brands: brands_InsertInput;
};


export type Mutationupdate_brandsArgs = {
  brands: brands_UpdateInput;
  where?: InputMaybe<brands_WhereInput>;
};


export type Mutationdelete_brandsArgs = {
  where?: InputMaybe<brands_WhereInput>;
};


export type Mutationinsert_categoriesArgs = {
  categories: categories_InsertInput;
};


export type Mutationupdate_categoriesArgs = {
  categories: categories_UpdateInput;
  where?: InputMaybe<categories_WhereInput>;
};


export type Mutationdelete_categoriesArgs = {
  where?: InputMaybe<categories_WhereInput>;
};


export type Mutationinsert_coupon_usageArgs = {
  coupon_usage: coupon_usage_InsertInput;
};


export type Mutationupdate_coupon_usageArgs = {
  coupon_usage: coupon_usage_UpdateInput;
  where?: InputMaybe<coupon_usage_WhereInput>;
};


export type Mutationdelete_coupon_usageArgs = {
  where?: InputMaybe<coupon_usage_WhereInput>;
};


export type Mutationinsert_couponsArgs = {
  coupons: coupons_InsertInput;
};


export type Mutationupdate_couponsArgs = {
  coupons: coupons_UpdateInput;
  where?: InputMaybe<coupons_WhereInput>;
};


export type Mutationdelete_couponsArgs = {
  where?: InputMaybe<coupons_WhereInput>;
};


export type Mutationinsert_customersArgs = {
  customers: customers_InsertInput;
};


export type Mutationupdate_customersArgs = {
  customers: customers_UpdateInput;
  where?: InputMaybe<customers_WhereInput>;
};


export type Mutationdelete_customersArgs = {
  where?: InputMaybe<customers_WhereInput>;
};


export type Mutationinsert_customers_addressesArgs = {
  customers_addresses: customers_addresses_InsertInput;
};


export type Mutationupdate_customers_addressesArgs = {
  customers_addresses: customers_addresses_UpdateInput;
  where?: InputMaybe<customers_addresses_WhereInput>;
};


export type Mutationdelete_customers_addressesArgs = {
  where?: InputMaybe<customers_addresses_WhereInput>;
};


export type Mutationinsert_order_itemsArgs = {
  order_items: order_items_InsertInput;
};


export type Mutationupdate_order_itemsArgs = {
  order_items: order_items_UpdateInput;
  where?: InputMaybe<order_items_WhereInput>;
};


export type Mutationdelete_order_itemsArgs = {
  where?: InputMaybe<order_items_WhereInput>;
};


export type Mutationinsert_order_summaryArgs = {
  order_summary: order_summary_InsertInput;
};


export type Mutationupdate_order_summaryArgs = {
  order_summary: order_summary_UpdateInput;
  where?: InputMaybe<order_summary_WhereInput>;
};


export type Mutationdelete_order_summaryArgs = {
  where?: InputMaybe<order_summary_WhereInput>;
};


export type Mutationinsert_order_trackingArgs = {
  order_tracking: order_tracking_InsertInput;
};


export type Mutationupdate_order_trackingArgs = {
  order_tracking: order_tracking_UpdateInput;
  where?: InputMaybe<order_tracking_WhereInput>;
};


export type Mutationdelete_order_trackingArgs = {
  where?: InputMaybe<order_tracking_WhereInput>;
};


export type Mutationinsert_ordersArgs = {
  orders: orders_InsertInput;
};


export type Mutationupdate_ordersArgs = {
  orders: orders_UpdateInput;
  where?: InputMaybe<orders_WhereInput>;
};


export type Mutationdelete_ordersArgs = {
  where?: InputMaybe<orders_WhereInput>;
};


export type Mutationinsert_payment_methodsArgs = {
  payment_methods: payment_methods_InsertInput;
};


export type Mutationupdate_payment_methodsArgs = {
  payment_methods: payment_methods_UpdateInput;
  where?: InputMaybe<payment_methods_WhereInput>;
};


export type Mutationdelete_payment_methodsArgs = {
  where?: InputMaybe<payment_methods_WhereInput>;
};


export type Mutationinsert_payment_transactionsArgs = {
  payment_transactions: payment_transactions_InsertInput;
};


export type Mutationupdate_payment_transactionsArgs = {
  payment_transactions: payment_transactions_UpdateInput;
  where?: InputMaybe<payment_transactions_WhereInput>;
};


export type Mutationdelete_payment_transactionsArgs = {
  where?: InputMaybe<payment_transactions_WhereInput>;
};


export type Mutationinsert_permissionsArgs = {
  permissions: permissions_InsertInput;
};


export type Mutationupdate_permissionsArgs = {
  permissions: permissions_UpdateInput;
  where?: InputMaybe<permissions_WhereInput>;
};


export type Mutationdelete_permissionsArgs = {
  where?: InputMaybe<permissions_WhereInput>;
};


export type Mutationinsert_product_categoriesArgs = {
  product_categories: product_categories_InsertInput;
};


export type Mutationupdate_product_categoriesArgs = {
  product_categories: product_categories_UpdateInput;
  where?: InputMaybe<product_categories_WhereInput>;
};


export type Mutationdelete_product_categoriesArgs = {
  where?: InputMaybe<product_categories_WhereInput>;
};


export type Mutationinsert_product_rating_summaryArgs = {
  product_rating_summary: product_rating_summary_InsertInput;
};


export type Mutationupdate_product_rating_summaryArgs = {
  product_rating_summary: product_rating_summary_UpdateInput;
  where?: InputMaybe<product_rating_summary_WhereInput>;
};


export type Mutationdelete_product_rating_summaryArgs = {
  where?: InputMaybe<product_rating_summary_WhereInput>;
};


export type Mutationinsert_product_variantsArgs = {
  product_variants: product_variants_InsertInput;
};


export type Mutationupdate_product_variantsArgs = {
  product_variants: product_variants_UpdateInput;
  where?: InputMaybe<product_variants_WhereInput>;
};


export type Mutationdelete_product_variantsArgs = {
  where?: InputMaybe<product_variants_WhereInput>;
};


export type Mutationinsert_productsArgs = {
  products: products_InsertInput;
};


export type Mutationupdate_productsArgs = {
  products: products_UpdateInput;
  where?: InputMaybe<products_WhereInput>;
};


export type Mutationdelete_productsArgs = {
  where?: InputMaybe<products_WhereInput>;
};


export type Mutationinsert_promotion_variantsArgs = {
  promotion_variants: promotion_variants_InsertInput;
};


export type Mutationupdate_promotion_variantsArgs = {
  promotion_variants: promotion_variants_UpdateInput;
  where?: InputMaybe<promotion_variants_WhereInput>;
};


export type Mutationdelete_promotion_variantsArgs = {
  where?: InputMaybe<promotion_variants_WhereInput>;
};


export type Mutationinsert_promotionsArgs = {
  promotions: promotions_InsertInput;
};


export type Mutationupdate_promotionsArgs = {
  promotions: promotions_UpdateInput;
  where?: InputMaybe<promotions_WhereInput>;
};


export type Mutationdelete_promotionsArgs = {
  where?: InputMaybe<promotions_WhereInput>;
};


export type Mutationinsert_rating_imagesArgs = {
  rating_images: rating_images_InsertInput;
};


export type Mutationupdate_rating_imagesArgs = {
  rating_images: rating_images_UpdateInput;
  where?: InputMaybe<rating_images_WhereInput>;
};


export type Mutationdelete_rating_imagesArgs = {
  where?: InputMaybe<rating_images_WhereInput>;
};


export type Mutationinsert_rolesArgs = {
  roles: roles_InsertInput;
};


export type Mutationupdate_rolesArgs = {
  roles: roles_UpdateInput;
  where?: InputMaybe<roles_WhereInput>;
};


export type Mutationdelete_rolesArgs = {
  where?: InputMaybe<roles_WhereInput>;
};


export type Mutationinsert_roles_sectionsArgs = {
  roles_sections: roles_sections_InsertInput;
};


export type Mutationupdate_roles_sectionsArgs = {
  roles_sections: roles_sections_UpdateInput;
  where?: InputMaybe<roles_sections_WhereInput>;
};


export type Mutationdelete_roles_sectionsArgs = {
  where?: InputMaybe<roles_sections_WhereInput>;
};


export type Mutationinsert_sectionsArgs = {
  sections: sections_InsertInput;
};


export type Mutationupdate_sectionsArgs = {
  sections: sections_UpdateInput;
  where?: InputMaybe<sections_WhereInput>;
};


export type Mutationdelete_sectionsArgs = {
  where?: InputMaybe<sections_WhereInput>;
};


export type Mutationinsert_servicesArgs = {
  services: services_InsertInput;
};


export type Mutationupdate_servicesArgs = {
  services: services_UpdateInput;
  where?: InputMaybe<services_WhereInput>;
};


export type Mutationdelete_servicesArgs = {
  where?: InputMaybe<services_WhereInput>;
};


export type Mutationinsert_services_imagesArgs = {
  services_images: services_images_InsertInput;
};


export type Mutationupdate_services_imagesArgs = {
  services_images: services_images_UpdateInput;
  where?: InputMaybe<services_images_WhereInput>;
};


export type Mutationdelete_services_imagesArgs = {
  where?: InputMaybe<services_images_WhereInput>;
};


export type Mutationinsert_shipping_methodsArgs = {
  shipping_methods: shipping_methods_InsertInput;
};


export type Mutationupdate_shipping_methodsArgs = {
  shipping_methods: shipping_methods_UpdateInput;
  where?: InputMaybe<shipping_methods_WhereInput>;
};


export type Mutationdelete_shipping_methodsArgs = {
  where?: InputMaybe<shipping_methods_WhereInput>;
};


export type Mutationinsert_shipping_zone_methodsArgs = {
  shipping_zone_methods: shipping_zone_methods_InsertInput;
};


export type Mutationupdate_shipping_zone_methodsArgs = {
  shipping_zone_methods: shipping_zone_methods_UpdateInput;
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
};


export type Mutationdelete_shipping_zone_methodsArgs = {
  where?: InputMaybe<shipping_zone_methods_WhereInput>;
};


export type Mutationinsert_shipping_zonesArgs = {
  shipping_zones: shipping_zones_InsertInput;
};


export type Mutationupdate_shipping_zonesArgs = {
  shipping_zones: shipping_zones_UpdateInput;
  where?: InputMaybe<shipping_zones_WhereInput>;
};


export type Mutationdelete_shipping_zonesArgs = {
  where?: InputMaybe<shipping_zones_WhereInput>;
};


export type Mutationinsert_usersArgs = {
  users: users_InsertInput;
};


export type Mutationupdate_usersArgs = {
  users: users_UpdateInput;
  where?: InputMaybe<users_WhereInput>;
};


export type Mutationdelete_usersArgs = {
  where?: InputMaybe<users_WhereInput>;
};


export type Mutationinsert_variant_attribute_optionsArgs = {
  variant_attribute_options: variant_attribute_options_InsertInput;
};


export type Mutationupdate_variant_attribute_optionsArgs = {
  variant_attribute_options: variant_attribute_options_UpdateInput;
  where?: InputMaybe<variant_attribute_options_WhereInput>;
};


export type Mutationdelete_variant_attribute_optionsArgs = {
  where?: InputMaybe<variant_attribute_options_WhereInput>;
};


export type Mutationinsert_variant_imagesArgs = {
  variant_images: variant_images_InsertInput;
};


export type Mutationupdate_variant_imagesArgs = {
  variant_images: variant_images_UpdateInput;
  where?: InputMaybe<variant_images_WhereInput>;
};


export type Mutationdelete_variant_imagesArgs = {
  where?: InputMaybe<variant_images_WhereInput>;
};


export type Mutationinsert_variant_rating_summaryArgs = {
  variant_rating_summary: variant_rating_summary_InsertInput;
};


export type Mutationupdate_variant_rating_summaryArgs = {
  variant_rating_summary: variant_rating_summary_UpdateInput;
  where?: InputMaybe<variant_rating_summary_WhereInput>;
};


export type Mutationdelete_variant_rating_summaryArgs = {
  where?: InputMaybe<variant_rating_summary_WhereInput>;
};


export type Mutationinsert_variant_ratingsArgs = {
  variant_ratings: variant_ratings_InsertInput;
};


export type Mutationupdate_variant_ratingsArgs = {
  variant_ratings: variant_ratings_UpdateInput;
  where?: InputMaybe<variant_ratings_WhereInput>;
};


export type Mutationdelete_variant_ratingsArgs = {
  where?: InputMaybe<variant_ratings_WhereInput>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_images_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attribute_option_id: Scalars['Int']['input'];
  image_type?: InputMaybe<attribute_option_images_image_type>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb: Scalars['String']['input'];
  /** Imagen normal 600x800 (opcional) */
  image_url_normal: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom: Scalars['String']['input'];
  /** Texto alternativo */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  is_primary?: InputMaybe<Scalars['Int']['input']>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type attribute_option_images_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attribute_option_id?: InputMaybe<Scalars['Int']['input']>;
  image_type?: InputMaybe<attribute_option_images_image_type>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 (opcional) */
  image_url_normal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  is_primary?: InputMaybe<Scalars['Int']['input']>;
};

export type attribute_options_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attribute_id: Scalars['Int']['input'];
  value: Scalars['String']['input'];
  additional_cost?: InputMaybe<Scalars['Float']['input']>;
};

export type attribute_options_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attribute_id?: InputMaybe<Scalars['Int']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  additional_cost?: InputMaybe<Scalars['Float']['input']>;
};

export type attributes_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  display_type?: InputMaybe<attributes_display_type>;
};

export type attributes_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  display_type?: InputMaybe<attributes_display_type>;
};

export type banner_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type banner_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type brands_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type brands_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type categories_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type categories_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type coupon_usage_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  coupon_id: Scalars['Int']['input'];
  customer_id: Scalars['Int']['input'];
  order_id: Scalars['Int']['input'];
  discount_amount: Scalars['Float']['input'];
  used_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type coupon_usage_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  coupon_id?: InputMaybe<Scalars['Int']['input']>;
  customer_id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  discount_amount?: InputMaybe<Scalars['Float']['input']>;
  used_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type coupons_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discount_type: coupons_discount_type;
  discount_value: Scalars['Float']['input'];
  min_purchase_amount?: InputMaybe<Scalars['Float']['input']>;
  max_discount_amount?: InputMaybe<Scalars['Float']['input']>;
  usage_limit?: InputMaybe<Scalars['Int']['input']>;
  usage_limit_per_customer?: InputMaybe<Scalars['Int']['input']>;
  used_count?: InputMaybe<Scalars['Int']['input']>;
  start_date: Scalars['DateTime']['input'];
  end_date: Scalars['DateTime']['input'];
  is_active?: InputMaybe<Scalars['Int']['input']>;
  applicable_to?: InputMaybe<coupons_applicable_to>;
  applicable_ids?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type coupons_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount_type?: InputMaybe<coupons_discount_type>;
  discount_value?: InputMaybe<Scalars['Float']['input']>;
  min_purchase_amount?: InputMaybe<Scalars['Float']['input']>;
  max_discount_amount?: InputMaybe<Scalars['Float']['input']>;
  usage_limit?: InputMaybe<Scalars['Int']['input']>;
  usage_limit_per_customer?: InputMaybe<Scalars['Int']['input']>;
  used_count?: InputMaybe<Scalars['Int']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  applicable_to?: InputMaybe<coupons_applicable_to>;
  applicable_ids?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type customers_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  address_id?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type customers_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  address_id?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type customers_addresses_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_customer: Scalars['Int']['input'];
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district: Scalars['String']['input'];
  /** Nombre de la avenida/calle/jirón */
  street_name: Scalars['String']['input'];
  /** Número de la dirección */
  street_number: Scalars['String']['input'];
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** 1 = dirección por defecto */
  is_default?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type customers_addresses_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_customer?: InputMaybe<Scalars['Int']['input']>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la avenida/calle/jirón */
  street_name?: InputMaybe<Scalars['String']['input']>;
  /** Número de la dirección */
  street_number?: InputMaybe<Scalars['String']['input']>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** 1 = dirección por defecto */
  is_default?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Items/productos de cada orden */
export type order_items_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id: Scalars['Int']['input'];
  /** Variante del producto comprada */
  variant_id: Scalars['Int']['input'];
  /** Nombre del producto al momento de compra */
  product_name: Scalars['String']['input'];
  /** SKU de la variante */
  variant_sku: Scalars['String']['input'];
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: InputMaybe<Scalars['JSON']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Precio unitario al momento de compra */
  unit_price: Scalars['Float']['input'];
  /** Precio total (quantity * unit_price) */
  total_price: Scalars['Float']['input'];
  /** Descuento aplicado a este item */
  discount_amount?: InputMaybe<Scalars['Float']['input']>;
};

/** Items/productos de cada orden */
export type order_items_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  /** Variante del producto comprada */
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  /** Nombre del producto al momento de compra */
  product_name?: InputMaybe<Scalars['String']['input']>;
  /** SKU de la variante */
  variant_sku?: InputMaybe<Scalars['String']['input']>;
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: InputMaybe<Scalars['JSON']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Precio unitario al momento de compra */
  unit_price?: InputMaybe<Scalars['Float']['input']>;
  /** Precio total (quantity * unit_price) */
  total_price?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento aplicado a este item */
  discount_amount?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type order_summary_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['input'];
  customer_id: Scalars['Int']['input'];
  customer_name?: InputMaybe<Scalars['String']['input']>;
  customer_email?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<order_summary_status>;
  payment_status?: InputMaybe<order_summary_payment_status>;
  /** Total final a pagar */
  total_amount: Scalars['Float']['input'];
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['Date']['input']>;
  total_items?: InputMaybe<Scalars['BigInt']['input']>;
  total_quantity?: InputMaybe<Scalars['Float']['input']>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type order_summary_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<Scalars['String']['input']>;
  customer_id?: InputMaybe<Scalars['Int']['input']>;
  customer_name?: InputMaybe<Scalars['String']['input']>;
  customer_email?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<order_summary_status>;
  payment_status?: InputMaybe<order_summary_payment_status>;
  /** Total final a pagar */
  total_amount?: InputMaybe<Scalars['Float']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['Date']['input']>;
  total_items?: InputMaybe<Scalars['BigInt']['input']>;
  total_quantity?: InputMaybe<Scalars['Float']['input']>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
};

/** Seguimiento de envíos */
export type order_tracking_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id: Scalars['Int']['input'];
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<order_tracking_status>;
  /** Ubicación actual del paquete */
  current_location?: InputMaybe<Scalars['String']['input']>;
  shipped_at?: InputMaybe<Scalars['Timestamp']['input']>;
  delivered_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Nombre de quien recibió */
  delivered_to?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  delivery_notes?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Seguimiento de envíos */
export type order_tracking_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  /** Número de seguimiento del courier */
  tracking_number?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<order_tracking_status>;
  /** Ubicación actual del paquete */
  current_location?: InputMaybe<Scalars['String']['input']>;
  shipped_at?: InputMaybe<Scalars['Timestamp']['input']>;
  delivered_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Nombre de quien recibió */
  delivered_to?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  delivery_notes?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Órdenes principales del ecommerce */
export type orders_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  customer_id: Scalars['Int']['input'];
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['input'];
  status?: InputMaybe<orders_status>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Subtotal antes de descuentos */
  subtotal: Scalars['Float']['input'];
  /** Descuento aplicado */
  discount_amount?: InputMaybe<Scalars['Float']['input']>;
  /** Costo de envío */
  shipping_cost?: InputMaybe<Scalars['Float']['input']>;
  /** Impuestos (IGV) */
  tax_amount?: InputMaybe<Scalars['Float']['input']>;
  /** Total final a pagar */
  total_amount: Scalars['Float']['input'];
  /** Dirección de envío */
  shipping_address_id: Scalars['Int']['input'];
  /** Método de envío */
  shipping_method?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['Date']['input']>;
  /** Método de pago usado */
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_status?: InputMaybe<orders_payment_status>;
  /** Fecha de pago confirmado */
  paid_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Notas del cliente */
  customer_notes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  admin_notes?: InputMaybe<Scalars['String']['input']>;
};

/** Órdenes principales del ecommerce */
export type orders_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  customer_id?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  order_number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<orders_status>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento aplicado */
  discount_amount?: InputMaybe<Scalars['Float']['input']>;
  /** Costo de envío */
  shipping_cost?: InputMaybe<Scalars['Float']['input']>;
  /** Impuestos (IGV) */
  tax_amount?: InputMaybe<Scalars['Float']['input']>;
  /** Total final a pagar */
  total_amount?: InputMaybe<Scalars['Float']['input']>;
  /** Dirección de envío */
  shipping_address_id?: InputMaybe<Scalars['Int']['input']>;
  /** Método de envío */
  shipping_method?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: InputMaybe<Scalars['Date']['input']>;
  /** Método de pago usado */
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_status?: InputMaybe<orders_payment_status>;
  /** Fecha de pago confirmado */
  paid_at?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Notas del cliente */
  customer_notes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  admin_notes?: InputMaybe<Scalars['String']['input']>;
};

export type payment_methods_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  icon_url?: InputMaybe<Scalars['String']['input']>;
  processing_fee_type?: InputMaybe<payment_methods_processing_fee_type>;
  processing_fee_value?: InputMaybe<Scalars['Float']['input']>;
  min_amount?: InputMaybe<Scalars['Float']['input']>;
  max_amount?: InputMaybe<Scalars['Float']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  requires_verification?: InputMaybe<Scalars['Int']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  settings?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type payment_methods_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon_url?: InputMaybe<Scalars['String']['input']>;
  processing_fee_type?: InputMaybe<payment_methods_processing_fee_type>;
  processing_fee_value?: InputMaybe<Scalars['Float']['input']>;
  min_amount?: InputMaybe<Scalars['Float']['input']>;
  max_amount?: InputMaybe<Scalars['Float']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  requires_verification?: InputMaybe<Scalars['Int']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  settings?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type payment_transactions_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id: Scalars['Int']['input'];
  payment_method_id: Scalars['Int']['input'];
  transaction_id?: InputMaybe<Scalars['String']['input']>;
  reference_number?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
  processing_fee?: InputMaybe<Scalars['Float']['input']>;
  net_amount: Scalars['Float']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<payment_transactions_status>;
  payment_data?: InputMaybe<Scalars['JSON']['input']>;
  gateway_response?: InputMaybe<Scalars['JSON']['input']>;
  processed_at?: InputMaybe<Scalars['Timestamp']['input']>;
  expires_at?: InputMaybe<Scalars['Timestamp']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type payment_transactions_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  payment_method_id?: InputMaybe<Scalars['Int']['input']>;
  transaction_id?: InputMaybe<Scalars['String']['input']>;
  reference_number?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  processing_fee?: InputMaybe<Scalars['Float']['input']>;
  net_amount?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<payment_transactions_status>;
  payment_data?: InputMaybe<Scalars['JSON']['input']>;
  gateway_response?: InputMaybe<Scalars['JSON']['input']>;
  processed_at?: InputMaybe<Scalars['Timestamp']['input']>;
  expires_at?: InputMaybe<Scalars['Timestamp']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type permissions_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type permissions_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type product_categories_InsertInput = {
  product_id: Scalars['Int']['input'];
  category_id: Scalars['Int']['input'];
};

export type product_categories_UpdateInput = {
  product_id?: InputMaybe<Scalars['Int']['input']>;
  category_id?: InputMaybe<Scalars['Int']['input']>;
};

/** VIEW */
export type product_rating_summary_InsertInput = {
  product_id: Scalars['Int']['input'];
  total_ratings?: InputMaybe<Scalars['BigInt']['input']>;
  average_rating?: InputMaybe<Scalars['Float']['input']>;
  five_star?: InputMaybe<Scalars['Float']['input']>;
  four_star?: InputMaybe<Scalars['Float']['input']>;
  three_star?: InputMaybe<Scalars['Float']['input']>;
  two_star?: InputMaybe<Scalars['Float']['input']>;
  one_star?: InputMaybe<Scalars['Float']['input']>;
  verified_purchases?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type product_rating_summary_UpdateInput = {
  product_id?: InputMaybe<Scalars['Int']['input']>;
  total_ratings?: InputMaybe<Scalars['BigInt']['input']>;
  average_rating?: InputMaybe<Scalars['Float']['input']>;
  five_star?: InputMaybe<Scalars['Float']['input']>;
  four_star?: InputMaybe<Scalars['Float']['input']>;
  three_star?: InputMaybe<Scalars['Float']['input']>;
  two_star?: InputMaybe<Scalars['Float']['input']>;
  one_star?: InputMaybe<Scalars['Float']['input']>;
  verified_purchases?: InputMaybe<Scalars['Float']['input']>;
};

export type product_variants_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_id: Scalars['Int']['input'];
  sku: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type product_variants_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_id?: InputMaybe<Scalars['Int']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type products_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  brand_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  base_price?: InputMaybe<Scalars['Float']['input']>;
};

export type products_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  brand_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  base_price?: InputMaybe<Scalars['Float']['input']>;
};

export type promotion_variants_InsertInput = {
  promotion_id: Scalars['Int']['input'];
  variant_id: Scalars['Int']['input'];
  promotion_price?: InputMaybe<Scalars['Float']['input']>;
  stock_limit: Scalars['Int']['input'];
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type promotion_variants_UpdateInput = {
  promotion_id?: InputMaybe<Scalars['Int']['input']>;
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  promotion_price?: InputMaybe<Scalars['Float']['input']>;
  stock_limit?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type promotions_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  start_date: Scalars['DateTime']['input'];
  end_date: Scalars['DateTime']['input'];
  discount_type?: InputMaybe<promotions_discount_type>;
  discount_value: Scalars['Float']['input'];
  min_purchase_amount?: InputMaybe<Scalars['Float']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type promotions_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  discount_type?: InputMaybe<promotions_discount_type>;
  discount_value?: InputMaybe<Scalars['Float']['input']>;
  min_purchase_amount?: InputMaybe<Scalars['Float']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type rating_images_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  rating_id: Scalars['Int']['input'];
  image_url: Scalars['String']['input'];
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type rating_images_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  rating_id?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type roles_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type roles_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type roles_sections_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_section?: InputMaybe<Scalars['Int']['input']>;
  id_rol?: InputMaybe<Scalars['Int']['input']>;
};

export type roles_sections_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_section?: InputMaybe<Scalars['Int']['input']>;
  id_rol?: InputMaybe<Scalars['Int']['input']>;
};

export type sections_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
};

export type sections_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
};

export type services_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
};

export type services_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
};

export type services_images_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  id_service?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type services_images_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  id_service?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
};

export type shipping_methods_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  base_cost?: InputMaybe<Scalars['Float']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['Float']['input']>;
  estimated_days_min?: InputMaybe<Scalars['Int']['input']>;
  estimated_days_max?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type shipping_methods_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  base_cost?: InputMaybe<Scalars['Float']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['Float']['input']>;
  estimated_days_min?: InputMaybe<Scalars['Int']['input']>;
  estimated_days_max?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type shipping_zone_methods_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shipping_method_id: Scalars['Int']['input'];
  shipping_zone_id: Scalars['Int']['input'];
  cost?: InputMaybe<Scalars['Float']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['Float']['input']>;
  estimated_days_min?: InputMaybe<Scalars['Int']['input']>;
  estimated_days_max?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type shipping_zone_methods_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shipping_method_id?: InputMaybe<Scalars['Int']['input']>;
  shipping_zone_id?: InputMaybe<Scalars['Int']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  free_shipping_threshold?: InputMaybe<Scalars['Float']['input']>;
  estimated_days_min?: InputMaybe<Scalars['Int']['input']>;
  estimated_days_max?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type shipping_zones_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  districts: Scalars['JSON']['input'];
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type shipping_zones_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  districts?: InputMaybe<Scalars['JSON']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type users_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role_id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type users_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type variant_attribute_options_InsertInput = {
  variant_id: Scalars['Int']['input'];
  attribute_option_id: Scalars['Int']['input'];
};

export type variant_attribute_options_UpdateInput = {
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  attribute_option_id?: InputMaybe<Scalars['Int']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_images_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variant_id: Scalars['Int']['input'];
  image_type?: InputMaybe<variant_images_image_type>;
  /** Imagen thumbnail 140x140 */
  image_url_thumb: Scalars['String']['input'];
  /** Imagen normal 600x800 */
  image_url_normal: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 */
  image_url_zoom: Scalars['String']['input'];
  /** Imagen principal de la variante */
  is_primary?: InputMaybe<Scalars['Int']['input']>;
  /** Orden de visualización */
  display_order?: InputMaybe<Scalars['Int']['input']>;
  /** Texto alternativo para SEO */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type variant_images_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  image_type?: InputMaybe<variant_images_image_type>;
  /** Imagen thumbnail 140x140 */
  image_url_thumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 */
  image_url_normal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  image_url_zoom?: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  is_primary?: InputMaybe<Scalars['Int']['input']>;
  /** Orden de visualización */
  display_order?: InputMaybe<Scalars['Int']['input']>;
  /** Texto alternativo para SEO */
  alt_text?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** VIEW */
export type variant_rating_summary_InsertInput = {
  variant_id: Scalars['Int']['input'];
  total_ratings?: InputMaybe<Scalars['BigInt']['input']>;
  average_rating?: InputMaybe<Scalars['Float']['input']>;
  five_star?: InputMaybe<Scalars['Float']['input']>;
  four_star?: InputMaybe<Scalars['Float']['input']>;
  three_star?: InputMaybe<Scalars['Float']['input']>;
  two_star?: InputMaybe<Scalars['Float']['input']>;
  one_star?: InputMaybe<Scalars['Float']['input']>;
  verified_purchases?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type variant_rating_summary_UpdateInput = {
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  total_ratings?: InputMaybe<Scalars['BigInt']['input']>;
  average_rating?: InputMaybe<Scalars['Float']['input']>;
  five_star?: InputMaybe<Scalars['Float']['input']>;
  four_star?: InputMaybe<Scalars['Float']['input']>;
  three_star?: InputMaybe<Scalars['Float']['input']>;
  two_star?: InputMaybe<Scalars['Float']['input']>;
  one_star?: InputMaybe<Scalars['Float']['input']>;
  verified_purchases?: InputMaybe<Scalars['Float']['input']>;
};

export type variant_ratings_InsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variant_id: Scalars['Int']['input'];
  customer_id: Scalars['Int']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verified_purchase?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type variant_ratings_UpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variant_id?: InputMaybe<Scalars['Int']['input']>;
  customer_id?: InputMaybe<Scalars['Int']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verified_purchase?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['Timestamp']['input']>;
  updated_at?: InputMaybe<Scalars['Timestamp']['input']>;
};

  export type QuerySdk = {
      /** undefined **/
  attribute_option_images: InContextSdkMethod<Query['attribute_option_images'], Queryattribute_option_imagesArgs, MeshContext>,
  /** undefined **/
  count_attribute_option_images: InContextSdkMethod<Query['count_attribute_option_images'], Querycount_attribute_option_imagesArgs, MeshContext>,
  /** undefined **/
  attribute_options: InContextSdkMethod<Query['attribute_options'], Queryattribute_optionsArgs, MeshContext>,
  /** undefined **/
  count_attribute_options: InContextSdkMethod<Query['count_attribute_options'], Querycount_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  attributes: InContextSdkMethod<Query['attributes'], QueryattributesArgs, MeshContext>,
  /** undefined **/
  count_attributes: InContextSdkMethod<Query['count_attributes'], Querycount_attributesArgs, MeshContext>,
  /** undefined **/
  banner: InContextSdkMethod<Query['banner'], QuerybannerArgs, MeshContext>,
  /** undefined **/
  count_banner: InContextSdkMethod<Query['count_banner'], Querycount_bannerArgs, MeshContext>,
  /** undefined **/
  brands: InContextSdkMethod<Query['brands'], QuerybrandsArgs, MeshContext>,
  /** undefined **/
  count_brands: InContextSdkMethod<Query['count_brands'], Querycount_brandsArgs, MeshContext>,
  /** undefined **/
  categories: InContextSdkMethod<Query['categories'], QuerycategoriesArgs, MeshContext>,
  /** undefined **/
  count_categories: InContextSdkMethod<Query['count_categories'], Querycount_categoriesArgs, MeshContext>,
  /** undefined **/
  coupon_usage: InContextSdkMethod<Query['coupon_usage'], Querycoupon_usageArgs, MeshContext>,
  /** undefined **/
  count_coupon_usage: InContextSdkMethod<Query['count_coupon_usage'], Querycount_coupon_usageArgs, MeshContext>,
  /** undefined **/
  coupons: InContextSdkMethod<Query['coupons'], QuerycouponsArgs, MeshContext>,
  /** undefined **/
  count_coupons: InContextSdkMethod<Query['count_coupons'], Querycount_couponsArgs, MeshContext>,
  /** undefined **/
  customers: InContextSdkMethod<Query['customers'], QuerycustomersArgs, MeshContext>,
  /** undefined **/
  count_customers: InContextSdkMethod<Query['count_customers'], Querycount_customersArgs, MeshContext>,
  /** undefined **/
  customers_addresses: InContextSdkMethod<Query['customers_addresses'], Querycustomers_addressesArgs, MeshContext>,
  /** undefined **/
  count_customers_addresses: InContextSdkMethod<Query['count_customers_addresses'], Querycount_customers_addressesArgs, MeshContext>,
  /** undefined **/
  order_items: InContextSdkMethod<Query['order_items'], Queryorder_itemsArgs, MeshContext>,
  /** undefined **/
  count_order_items: InContextSdkMethod<Query['count_order_items'], Querycount_order_itemsArgs, MeshContext>,
  /** undefined **/
  order_summary: InContextSdkMethod<Query['order_summary'], Queryorder_summaryArgs, MeshContext>,
  /** undefined **/
  count_order_summary: InContextSdkMethod<Query['count_order_summary'], Querycount_order_summaryArgs, MeshContext>,
  /** undefined **/
  order_tracking: InContextSdkMethod<Query['order_tracking'], Queryorder_trackingArgs, MeshContext>,
  /** undefined **/
  count_order_tracking: InContextSdkMethod<Query['count_order_tracking'], Querycount_order_trackingArgs, MeshContext>,
  /** undefined **/
  orders: InContextSdkMethod<Query['orders'], QueryordersArgs, MeshContext>,
  /** undefined **/
  count_orders: InContextSdkMethod<Query['count_orders'], Querycount_ordersArgs, MeshContext>,
  /** undefined **/
  payment_methods: InContextSdkMethod<Query['payment_methods'], Querypayment_methodsArgs, MeshContext>,
  /** undefined **/
  count_payment_methods: InContextSdkMethod<Query['count_payment_methods'], Querycount_payment_methodsArgs, MeshContext>,
  /** undefined **/
  payment_transactions: InContextSdkMethod<Query['payment_transactions'], Querypayment_transactionsArgs, MeshContext>,
  /** undefined **/
  count_payment_transactions: InContextSdkMethod<Query['count_payment_transactions'], Querycount_payment_transactionsArgs, MeshContext>,
  /** undefined **/
  permissions: InContextSdkMethod<Query['permissions'], QuerypermissionsArgs, MeshContext>,
  /** undefined **/
  count_permissions: InContextSdkMethod<Query['count_permissions'], Querycount_permissionsArgs, MeshContext>,
  /** undefined **/
  product_categories: InContextSdkMethod<Query['product_categories'], Queryproduct_categoriesArgs, MeshContext>,
  /** undefined **/
  count_product_categories: InContextSdkMethod<Query['count_product_categories'], Querycount_product_categoriesArgs, MeshContext>,
  /** undefined **/
  product_rating_summary: InContextSdkMethod<Query['product_rating_summary'], Queryproduct_rating_summaryArgs, MeshContext>,
  /** undefined **/
  count_product_rating_summary: InContextSdkMethod<Query['count_product_rating_summary'], Querycount_product_rating_summaryArgs, MeshContext>,
  /** undefined **/
  product_variants: InContextSdkMethod<Query['product_variants'], Queryproduct_variantsArgs, MeshContext>,
  /** undefined **/
  count_product_variants: InContextSdkMethod<Query['count_product_variants'], Querycount_product_variantsArgs, MeshContext>,
  /** undefined **/
  products: InContextSdkMethod<Query['products'], QueryproductsArgs, MeshContext>,
  /** undefined **/
  count_products: InContextSdkMethod<Query['count_products'], Querycount_productsArgs, MeshContext>,
  /** undefined **/
  promotion_variants: InContextSdkMethod<Query['promotion_variants'], Querypromotion_variantsArgs, MeshContext>,
  /** undefined **/
  count_promotion_variants: InContextSdkMethod<Query['count_promotion_variants'], Querycount_promotion_variantsArgs, MeshContext>,
  /** undefined **/
  promotions: InContextSdkMethod<Query['promotions'], QuerypromotionsArgs, MeshContext>,
  /** undefined **/
  count_promotions: InContextSdkMethod<Query['count_promotions'], Querycount_promotionsArgs, MeshContext>,
  /** undefined **/
  rating_images: InContextSdkMethod<Query['rating_images'], Queryrating_imagesArgs, MeshContext>,
  /** undefined **/
  count_rating_images: InContextSdkMethod<Query['count_rating_images'], Querycount_rating_imagesArgs, MeshContext>,
  /** undefined **/
  roles: InContextSdkMethod<Query['roles'], QueryrolesArgs, MeshContext>,
  /** undefined **/
  count_roles: InContextSdkMethod<Query['count_roles'], Querycount_rolesArgs, MeshContext>,
  /** undefined **/
  roles_sections: InContextSdkMethod<Query['roles_sections'], Queryroles_sectionsArgs, MeshContext>,
  /** undefined **/
  count_roles_sections: InContextSdkMethod<Query['count_roles_sections'], Querycount_roles_sectionsArgs, MeshContext>,
  /** undefined **/
  sections: InContextSdkMethod<Query['sections'], QuerysectionsArgs, MeshContext>,
  /** undefined **/
  count_sections: InContextSdkMethod<Query['count_sections'], Querycount_sectionsArgs, MeshContext>,
  /** undefined **/
  services: InContextSdkMethod<Query['services'], QueryservicesArgs, MeshContext>,
  /** undefined **/
  count_services: InContextSdkMethod<Query['count_services'], Querycount_servicesArgs, MeshContext>,
  /** undefined **/
  services_images: InContextSdkMethod<Query['services_images'], Queryservices_imagesArgs, MeshContext>,
  /** undefined **/
  count_services_images: InContextSdkMethod<Query['count_services_images'], Querycount_services_imagesArgs, MeshContext>,
  /** undefined **/
  shipping_methods: InContextSdkMethod<Query['shipping_methods'], Queryshipping_methodsArgs, MeshContext>,
  /** undefined **/
  count_shipping_methods: InContextSdkMethod<Query['count_shipping_methods'], Querycount_shipping_methodsArgs, MeshContext>,
  /** undefined **/
  shipping_zone_methods: InContextSdkMethod<Query['shipping_zone_methods'], Queryshipping_zone_methodsArgs, MeshContext>,
  /** undefined **/
  count_shipping_zone_methods: InContextSdkMethod<Query['count_shipping_zone_methods'], Querycount_shipping_zone_methodsArgs, MeshContext>,
  /** undefined **/
  shipping_zones: InContextSdkMethod<Query['shipping_zones'], Queryshipping_zonesArgs, MeshContext>,
  /** undefined **/
  count_shipping_zones: InContextSdkMethod<Query['count_shipping_zones'], Querycount_shipping_zonesArgs, MeshContext>,
  /** undefined **/
  users: InContextSdkMethod<Query['users'], QueryusersArgs, MeshContext>,
  /** undefined **/
  count_users: InContextSdkMethod<Query['count_users'], Querycount_usersArgs, MeshContext>,
  /** undefined **/
  variant_attribute_options: InContextSdkMethod<Query['variant_attribute_options'], Queryvariant_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  count_variant_attribute_options: InContextSdkMethod<Query['count_variant_attribute_options'], Querycount_variant_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  variant_images: InContextSdkMethod<Query['variant_images'], Queryvariant_imagesArgs, MeshContext>,
  /** undefined **/
  count_variant_images: InContextSdkMethod<Query['count_variant_images'], Querycount_variant_imagesArgs, MeshContext>,
  /** undefined **/
  variant_rating_summary: InContextSdkMethod<Query['variant_rating_summary'], Queryvariant_rating_summaryArgs, MeshContext>,
  /** undefined **/
  count_variant_rating_summary: InContextSdkMethod<Query['count_variant_rating_summary'], Querycount_variant_rating_summaryArgs, MeshContext>,
  /** undefined **/
  variant_ratings: InContextSdkMethod<Query['variant_ratings'], Queryvariant_ratingsArgs, MeshContext>,
  /** undefined **/
  count_variant_ratings: InContextSdkMethod<Query['count_variant_ratings'], Querycount_variant_ratingsArgs, MeshContext>
  };

  export type MutationSdk = {
      /** undefined **/
  insert_attribute_option_images: InContextSdkMethod<Mutation['insert_attribute_option_images'], Mutationinsert_attribute_option_imagesArgs, MeshContext>,
  /** undefined **/
  update_attribute_option_images: InContextSdkMethod<Mutation['update_attribute_option_images'], Mutationupdate_attribute_option_imagesArgs, MeshContext>,
  /** undefined **/
  delete_attribute_option_images: InContextSdkMethod<Mutation['delete_attribute_option_images'], Mutationdelete_attribute_option_imagesArgs, MeshContext>,
  /** undefined **/
  insert_attribute_options: InContextSdkMethod<Mutation['insert_attribute_options'], Mutationinsert_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  update_attribute_options: InContextSdkMethod<Mutation['update_attribute_options'], Mutationupdate_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  delete_attribute_options: InContextSdkMethod<Mutation['delete_attribute_options'], Mutationdelete_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  insert_attributes: InContextSdkMethod<Mutation['insert_attributes'], Mutationinsert_attributesArgs, MeshContext>,
  /** undefined **/
  update_attributes: InContextSdkMethod<Mutation['update_attributes'], Mutationupdate_attributesArgs, MeshContext>,
  /** undefined **/
  delete_attributes: InContextSdkMethod<Mutation['delete_attributes'], Mutationdelete_attributesArgs, MeshContext>,
  /** undefined **/
  insert_banner: InContextSdkMethod<Mutation['insert_banner'], Mutationinsert_bannerArgs, MeshContext>,
  /** undefined **/
  update_banner: InContextSdkMethod<Mutation['update_banner'], Mutationupdate_bannerArgs, MeshContext>,
  /** undefined **/
  delete_banner: InContextSdkMethod<Mutation['delete_banner'], Mutationdelete_bannerArgs, MeshContext>,
  /** undefined **/
  insert_brands: InContextSdkMethod<Mutation['insert_brands'], Mutationinsert_brandsArgs, MeshContext>,
  /** undefined **/
  update_brands: InContextSdkMethod<Mutation['update_brands'], Mutationupdate_brandsArgs, MeshContext>,
  /** undefined **/
  delete_brands: InContextSdkMethod<Mutation['delete_brands'], Mutationdelete_brandsArgs, MeshContext>,
  /** undefined **/
  insert_categories: InContextSdkMethod<Mutation['insert_categories'], Mutationinsert_categoriesArgs, MeshContext>,
  /** undefined **/
  update_categories: InContextSdkMethod<Mutation['update_categories'], Mutationupdate_categoriesArgs, MeshContext>,
  /** undefined **/
  delete_categories: InContextSdkMethod<Mutation['delete_categories'], Mutationdelete_categoriesArgs, MeshContext>,
  /** undefined **/
  insert_coupon_usage: InContextSdkMethod<Mutation['insert_coupon_usage'], Mutationinsert_coupon_usageArgs, MeshContext>,
  /** undefined **/
  update_coupon_usage: InContextSdkMethod<Mutation['update_coupon_usage'], Mutationupdate_coupon_usageArgs, MeshContext>,
  /** undefined **/
  delete_coupon_usage: InContextSdkMethod<Mutation['delete_coupon_usage'], Mutationdelete_coupon_usageArgs, MeshContext>,
  /** undefined **/
  insert_coupons: InContextSdkMethod<Mutation['insert_coupons'], Mutationinsert_couponsArgs, MeshContext>,
  /** undefined **/
  update_coupons: InContextSdkMethod<Mutation['update_coupons'], Mutationupdate_couponsArgs, MeshContext>,
  /** undefined **/
  delete_coupons: InContextSdkMethod<Mutation['delete_coupons'], Mutationdelete_couponsArgs, MeshContext>,
  /** undefined **/
  insert_customers: InContextSdkMethod<Mutation['insert_customers'], Mutationinsert_customersArgs, MeshContext>,
  /** undefined **/
  update_customers: InContextSdkMethod<Mutation['update_customers'], Mutationupdate_customersArgs, MeshContext>,
  /** undefined **/
  delete_customers: InContextSdkMethod<Mutation['delete_customers'], Mutationdelete_customersArgs, MeshContext>,
  /** undefined **/
  insert_customers_addresses: InContextSdkMethod<Mutation['insert_customers_addresses'], Mutationinsert_customers_addressesArgs, MeshContext>,
  /** undefined **/
  update_customers_addresses: InContextSdkMethod<Mutation['update_customers_addresses'], Mutationupdate_customers_addressesArgs, MeshContext>,
  /** undefined **/
  delete_customers_addresses: InContextSdkMethod<Mutation['delete_customers_addresses'], Mutationdelete_customers_addressesArgs, MeshContext>,
  /** undefined **/
  insert_order_items: InContextSdkMethod<Mutation['insert_order_items'], Mutationinsert_order_itemsArgs, MeshContext>,
  /** undefined **/
  update_order_items: InContextSdkMethod<Mutation['update_order_items'], Mutationupdate_order_itemsArgs, MeshContext>,
  /** undefined **/
  delete_order_items: InContextSdkMethod<Mutation['delete_order_items'], Mutationdelete_order_itemsArgs, MeshContext>,
  /** undefined **/
  insert_order_summary: InContextSdkMethod<Mutation['insert_order_summary'], Mutationinsert_order_summaryArgs, MeshContext>,
  /** undefined **/
  update_order_summary: InContextSdkMethod<Mutation['update_order_summary'], Mutationupdate_order_summaryArgs, MeshContext>,
  /** undefined **/
  delete_order_summary: InContextSdkMethod<Mutation['delete_order_summary'], Mutationdelete_order_summaryArgs, MeshContext>,
  /** undefined **/
  insert_order_tracking: InContextSdkMethod<Mutation['insert_order_tracking'], Mutationinsert_order_trackingArgs, MeshContext>,
  /** undefined **/
  update_order_tracking: InContextSdkMethod<Mutation['update_order_tracking'], Mutationupdate_order_trackingArgs, MeshContext>,
  /** undefined **/
  delete_order_tracking: InContextSdkMethod<Mutation['delete_order_tracking'], Mutationdelete_order_trackingArgs, MeshContext>,
  /** undefined **/
  insert_orders: InContextSdkMethod<Mutation['insert_orders'], Mutationinsert_ordersArgs, MeshContext>,
  /** undefined **/
  update_orders: InContextSdkMethod<Mutation['update_orders'], Mutationupdate_ordersArgs, MeshContext>,
  /** undefined **/
  delete_orders: InContextSdkMethod<Mutation['delete_orders'], Mutationdelete_ordersArgs, MeshContext>,
  /** undefined **/
  insert_payment_methods: InContextSdkMethod<Mutation['insert_payment_methods'], Mutationinsert_payment_methodsArgs, MeshContext>,
  /** undefined **/
  update_payment_methods: InContextSdkMethod<Mutation['update_payment_methods'], Mutationupdate_payment_methodsArgs, MeshContext>,
  /** undefined **/
  delete_payment_methods: InContextSdkMethod<Mutation['delete_payment_methods'], Mutationdelete_payment_methodsArgs, MeshContext>,
  /** undefined **/
  insert_payment_transactions: InContextSdkMethod<Mutation['insert_payment_transactions'], Mutationinsert_payment_transactionsArgs, MeshContext>,
  /** undefined **/
  update_payment_transactions: InContextSdkMethod<Mutation['update_payment_transactions'], Mutationupdate_payment_transactionsArgs, MeshContext>,
  /** undefined **/
  delete_payment_transactions: InContextSdkMethod<Mutation['delete_payment_transactions'], Mutationdelete_payment_transactionsArgs, MeshContext>,
  /** undefined **/
  insert_permissions: InContextSdkMethod<Mutation['insert_permissions'], Mutationinsert_permissionsArgs, MeshContext>,
  /** undefined **/
  update_permissions: InContextSdkMethod<Mutation['update_permissions'], Mutationupdate_permissionsArgs, MeshContext>,
  /** undefined **/
  delete_permissions: InContextSdkMethod<Mutation['delete_permissions'], Mutationdelete_permissionsArgs, MeshContext>,
  /** undefined **/
  insert_product_categories: InContextSdkMethod<Mutation['insert_product_categories'], Mutationinsert_product_categoriesArgs, MeshContext>,
  /** undefined **/
  update_product_categories: InContextSdkMethod<Mutation['update_product_categories'], Mutationupdate_product_categoriesArgs, MeshContext>,
  /** undefined **/
  delete_product_categories: InContextSdkMethod<Mutation['delete_product_categories'], Mutationdelete_product_categoriesArgs, MeshContext>,
  /** undefined **/
  insert_product_rating_summary: InContextSdkMethod<Mutation['insert_product_rating_summary'], Mutationinsert_product_rating_summaryArgs, MeshContext>,
  /** undefined **/
  update_product_rating_summary: InContextSdkMethod<Mutation['update_product_rating_summary'], Mutationupdate_product_rating_summaryArgs, MeshContext>,
  /** undefined **/
  delete_product_rating_summary: InContextSdkMethod<Mutation['delete_product_rating_summary'], Mutationdelete_product_rating_summaryArgs, MeshContext>,
  /** undefined **/
  insert_product_variants: InContextSdkMethod<Mutation['insert_product_variants'], Mutationinsert_product_variantsArgs, MeshContext>,
  /** undefined **/
  update_product_variants: InContextSdkMethod<Mutation['update_product_variants'], Mutationupdate_product_variantsArgs, MeshContext>,
  /** undefined **/
  delete_product_variants: InContextSdkMethod<Mutation['delete_product_variants'], Mutationdelete_product_variantsArgs, MeshContext>,
  /** undefined **/
  insert_products: InContextSdkMethod<Mutation['insert_products'], Mutationinsert_productsArgs, MeshContext>,
  /** undefined **/
  update_products: InContextSdkMethod<Mutation['update_products'], Mutationupdate_productsArgs, MeshContext>,
  /** undefined **/
  delete_products: InContextSdkMethod<Mutation['delete_products'], Mutationdelete_productsArgs, MeshContext>,
  /** undefined **/
  insert_promotion_variants: InContextSdkMethod<Mutation['insert_promotion_variants'], Mutationinsert_promotion_variantsArgs, MeshContext>,
  /** undefined **/
  update_promotion_variants: InContextSdkMethod<Mutation['update_promotion_variants'], Mutationupdate_promotion_variantsArgs, MeshContext>,
  /** undefined **/
  delete_promotion_variants: InContextSdkMethod<Mutation['delete_promotion_variants'], Mutationdelete_promotion_variantsArgs, MeshContext>,
  /** undefined **/
  insert_promotions: InContextSdkMethod<Mutation['insert_promotions'], Mutationinsert_promotionsArgs, MeshContext>,
  /** undefined **/
  update_promotions: InContextSdkMethod<Mutation['update_promotions'], Mutationupdate_promotionsArgs, MeshContext>,
  /** undefined **/
  delete_promotions: InContextSdkMethod<Mutation['delete_promotions'], Mutationdelete_promotionsArgs, MeshContext>,
  /** undefined **/
  insert_rating_images: InContextSdkMethod<Mutation['insert_rating_images'], Mutationinsert_rating_imagesArgs, MeshContext>,
  /** undefined **/
  update_rating_images: InContextSdkMethod<Mutation['update_rating_images'], Mutationupdate_rating_imagesArgs, MeshContext>,
  /** undefined **/
  delete_rating_images: InContextSdkMethod<Mutation['delete_rating_images'], Mutationdelete_rating_imagesArgs, MeshContext>,
  /** undefined **/
  insert_roles: InContextSdkMethod<Mutation['insert_roles'], Mutationinsert_rolesArgs, MeshContext>,
  /** undefined **/
  update_roles: InContextSdkMethod<Mutation['update_roles'], Mutationupdate_rolesArgs, MeshContext>,
  /** undefined **/
  delete_roles: InContextSdkMethod<Mutation['delete_roles'], Mutationdelete_rolesArgs, MeshContext>,
  /** undefined **/
  insert_roles_sections: InContextSdkMethod<Mutation['insert_roles_sections'], Mutationinsert_roles_sectionsArgs, MeshContext>,
  /** undefined **/
  update_roles_sections: InContextSdkMethod<Mutation['update_roles_sections'], Mutationupdate_roles_sectionsArgs, MeshContext>,
  /** undefined **/
  delete_roles_sections: InContextSdkMethod<Mutation['delete_roles_sections'], Mutationdelete_roles_sectionsArgs, MeshContext>,
  /** undefined **/
  insert_sections: InContextSdkMethod<Mutation['insert_sections'], Mutationinsert_sectionsArgs, MeshContext>,
  /** undefined **/
  update_sections: InContextSdkMethod<Mutation['update_sections'], Mutationupdate_sectionsArgs, MeshContext>,
  /** undefined **/
  delete_sections: InContextSdkMethod<Mutation['delete_sections'], Mutationdelete_sectionsArgs, MeshContext>,
  /** undefined **/
  insert_services: InContextSdkMethod<Mutation['insert_services'], Mutationinsert_servicesArgs, MeshContext>,
  /** undefined **/
  update_services: InContextSdkMethod<Mutation['update_services'], Mutationupdate_servicesArgs, MeshContext>,
  /** undefined **/
  delete_services: InContextSdkMethod<Mutation['delete_services'], Mutationdelete_servicesArgs, MeshContext>,
  /** undefined **/
  insert_services_images: InContextSdkMethod<Mutation['insert_services_images'], Mutationinsert_services_imagesArgs, MeshContext>,
  /** undefined **/
  update_services_images: InContextSdkMethod<Mutation['update_services_images'], Mutationupdate_services_imagesArgs, MeshContext>,
  /** undefined **/
  delete_services_images: InContextSdkMethod<Mutation['delete_services_images'], Mutationdelete_services_imagesArgs, MeshContext>,
  /** undefined **/
  insert_shipping_methods: InContextSdkMethod<Mutation['insert_shipping_methods'], Mutationinsert_shipping_methodsArgs, MeshContext>,
  /** undefined **/
  update_shipping_methods: InContextSdkMethod<Mutation['update_shipping_methods'], Mutationupdate_shipping_methodsArgs, MeshContext>,
  /** undefined **/
  delete_shipping_methods: InContextSdkMethod<Mutation['delete_shipping_methods'], Mutationdelete_shipping_methodsArgs, MeshContext>,
  /** undefined **/
  insert_shipping_zone_methods: InContextSdkMethod<Mutation['insert_shipping_zone_methods'], Mutationinsert_shipping_zone_methodsArgs, MeshContext>,
  /** undefined **/
  update_shipping_zone_methods: InContextSdkMethod<Mutation['update_shipping_zone_methods'], Mutationupdate_shipping_zone_methodsArgs, MeshContext>,
  /** undefined **/
  delete_shipping_zone_methods: InContextSdkMethod<Mutation['delete_shipping_zone_methods'], Mutationdelete_shipping_zone_methodsArgs, MeshContext>,
  /** undefined **/
  insert_shipping_zones: InContextSdkMethod<Mutation['insert_shipping_zones'], Mutationinsert_shipping_zonesArgs, MeshContext>,
  /** undefined **/
  update_shipping_zones: InContextSdkMethod<Mutation['update_shipping_zones'], Mutationupdate_shipping_zonesArgs, MeshContext>,
  /** undefined **/
  delete_shipping_zones: InContextSdkMethod<Mutation['delete_shipping_zones'], Mutationdelete_shipping_zonesArgs, MeshContext>,
  /** undefined **/
  insert_users: InContextSdkMethod<Mutation['insert_users'], Mutationinsert_usersArgs, MeshContext>,
  /** undefined **/
  update_users: InContextSdkMethod<Mutation['update_users'], Mutationupdate_usersArgs, MeshContext>,
  /** undefined **/
  delete_users: InContextSdkMethod<Mutation['delete_users'], Mutationdelete_usersArgs, MeshContext>,
  /** undefined **/
  insert_variant_attribute_options: InContextSdkMethod<Mutation['insert_variant_attribute_options'], Mutationinsert_variant_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  update_variant_attribute_options: InContextSdkMethod<Mutation['update_variant_attribute_options'], Mutationupdate_variant_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  delete_variant_attribute_options: InContextSdkMethod<Mutation['delete_variant_attribute_options'], Mutationdelete_variant_attribute_optionsArgs, MeshContext>,
  /** undefined **/
  insert_variant_images: InContextSdkMethod<Mutation['insert_variant_images'], Mutationinsert_variant_imagesArgs, MeshContext>,
  /** undefined **/
  update_variant_images: InContextSdkMethod<Mutation['update_variant_images'], Mutationupdate_variant_imagesArgs, MeshContext>,
  /** undefined **/
  delete_variant_images: InContextSdkMethod<Mutation['delete_variant_images'], Mutationdelete_variant_imagesArgs, MeshContext>,
  /** undefined **/
  insert_variant_rating_summary: InContextSdkMethod<Mutation['insert_variant_rating_summary'], Mutationinsert_variant_rating_summaryArgs, MeshContext>,
  /** undefined **/
  update_variant_rating_summary: InContextSdkMethod<Mutation['update_variant_rating_summary'], Mutationupdate_variant_rating_summaryArgs, MeshContext>,
  /** undefined **/
  delete_variant_rating_summary: InContextSdkMethod<Mutation['delete_variant_rating_summary'], Mutationdelete_variant_rating_summaryArgs, MeshContext>,
  /** undefined **/
  insert_variant_ratings: InContextSdkMethod<Mutation['insert_variant_ratings'], Mutationinsert_variant_ratingsArgs, MeshContext>,
  /** undefined **/
  update_variant_ratings: InContextSdkMethod<Mutation['update_variant_ratings'], Mutationupdate_variant_ratingsArgs, MeshContext>,
  /** undefined **/
  delete_variant_ratings: InContextSdkMethod<Mutation['delete_variant_ratings'], Mutationdelete_variant_ratingsArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Database"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
