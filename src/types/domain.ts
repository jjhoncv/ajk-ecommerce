// ============================================================================
// TIPOS DE DOMINIO
// ============================================================================
// Campos en camelCase con relaciones incluidas
// ============================================================================

export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
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
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: Date; output: Date; }
}

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImages {
  /** Texto alternativo */
  altText: Maybe<Scalars['String']['output']>;
  attributeOptionId: Scalars['Int']['output'];
  attributeOptions: Maybe<Array<Maybe<AttributeOptions>>>;
  createdAt: Scalars['Timestamp']['output'];
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageType: AttributeOptionImagesImageType;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: Maybe<Scalars['String']['output']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
}


/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImagesAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributeOptionsOrderByInput>;
  where: InputMaybe<AttributeOptionsWhereInput>;
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

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImagesInsertInput {
  /** Texto alternativo */
  altText: InputMaybe<Scalars['String']['input']>;
  attributeOptionId: Scalars['Int']['input'];
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageType: InputMaybe<AttributeOptionImagesImageType>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImagesOrderByInput {
  /** Texto alternativo */
  altText: InputMaybe<OrderBy>;
  attributeOptionId: InputMaybe<OrderBy>;
  createdAt: InputMaybe<OrderBy>;
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageType: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImagesUpdateInput {
  /** Texto alternativo */
  altText: InputMaybe<Scalars['String']['input']>;
  attributeOptionId: InputMaybe<Scalars['Int']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageType: InputMaybe<AttributeOptionImagesImageType>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export interface AttributeOptionImagesWhereInput {
  /** Texto alternativo */
  altText: InputMaybe<Scalars['String']['input']>;
  attributeOptionId: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageType: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface AttributeOptions {
  additionalCost: Maybe<Scalars['Float']['output']>;
  attributeId: Scalars['Int']['output'];
  attributeOptionImages: Maybe<Array<Maybe<AttributeOptionImages>>>;
  id: Scalars['Int']['output'];
  value: Scalars['String']['output'];
  variantAttributeOptions: Maybe<Array<Maybe<VariantAttributeOptions>>>;
}


export interface AttributeOptionsAttributeOptionImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributeOptionImagesOrderByInput>;
  where: InputMaybe<AttributeOptionImagesWhereInput>;
}


export interface AttributeOptionsVariantAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantAttributeOptionsOrderByInput>;
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}

export interface AttributeOptionsInsertInput {
  additionalCost: InputMaybe<Scalars['Float']['input']>;
  attributeId: Scalars['Int']['input'];
  id: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['String']['input'];
}

export interface AttributeOptionsOrderByInput {
  additionalCost: InputMaybe<OrderBy>;
  attributeId: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  value: InputMaybe<OrderBy>;
}

export interface AttributeOptionsUpdateInput {
  additionalCost: InputMaybe<Scalars['Float']['input']>;
  attributeId: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  value: InputMaybe<Scalars['String']['input']>;
}

export interface AttributeOptionsWhereInput {
  additionalCost: InputMaybe<Scalars['String']['input']>;
  attributeId: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  value: InputMaybe<Scalars['String']['input']>;
}

export interface Attributes {
  displayType: AttributesDisplayType;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
}

export type AttributesDisplayType =
  | 'color'
  | 'custom'
  | 'pills'
  | 'radio'
  | 'select';

export interface AttributesInsertInput {
  displayType: InputMaybe<AttributesDisplayType>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
}

export interface AttributesOrderByInput {
  displayType: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
}

export interface AttributesUpdateInput {
  displayType: InputMaybe<AttributesDisplayType>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
}

export interface AttributesWhereInput {
  displayType: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
}

export interface Banner {
  createdAt: Scalars['Timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  link: Maybe<Scalars['String']['output']>;
  subtitle: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
}

export interface BannerInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  link: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface BannerOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageUrl: InputMaybe<OrderBy>;
  link: InputMaybe<OrderBy>;
  subtitle: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface BannerUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  link: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface BannerWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  link: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface Brands {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  products: Maybe<Array<Maybe<Products>>>;
}


export interface BrandsProductsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductsOrderByInput>;
  where: InputMaybe<ProductsWhereInput>;
}

export interface BrandsInsertInput {
  id: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
}

export interface BrandsOrderByInput {
  id: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
}

export interface BrandsUpdateInput {
  id: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
}

export interface BrandsWhereInput {
  id: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
}

export interface Categories {
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentId: Maybe<Scalars['Int']['output']>;
}

export interface CategoriesInsertInput {
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId: InputMaybe<Scalars['Int']['input']>;
}

export interface CategoriesOrderByInput {
  description: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageUrl: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  parentId: InputMaybe<OrderBy>;
}

export interface CategoriesUpdateInput {
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  parentId: InputMaybe<Scalars['Int']['input']>;
}

export interface CategoriesWhereInput {
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  parentId: InputMaybe<Scalars['String']['input']>;
}

export interface Customers {
  addressId: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  customersAddresses: Maybe<Array<Maybe<CustomersAddresses>>>;
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  photo: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  username: Scalars['String']['output'];
  variantRatings: Maybe<Array<Maybe<VariantRatings>>>;
}


export interface CustomersCustomersAddressesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CustomersAddressesOrderByInput>;
  where: InputMaybe<CustomersAddressesWhereInput>;
}


export interface CustomersVariantRatingsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantRatingsOrderByInput>;
  where: InputMaybe<VariantRatingsWhereInput>;
}

export interface CustomersAddresses {
  createdAt: Scalars['Timestamp']['output'];
  customers: Maybe<Array<Maybe<Customers>>>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  idCustomer: Maybe<Scalars['Int']['output']>;
  name: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
}


export interface CustomersAddressesCustomersArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CustomersOrderByInput>;
  where: InputMaybe<CustomersWhereInput>;
}

export interface CustomersAddressesInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  idCustomer: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface CustomersAddressesOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  idCustomer: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface CustomersAddressesUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  idCustomer: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface CustomersAddressesWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  idCustomer: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface CustomersInsertInput {
  addressId: InputMaybe<Scalars['Int']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  email: Scalars['String']['input'];
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  lastname: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  photo: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  username: Scalars['String']['input'];
}

export interface CustomersOrderByInput {
  addressId: InputMaybe<OrderBy>;
  createdAt: InputMaybe<OrderBy>;
  email: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  isActive: InputMaybe<OrderBy>;
  lastname: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  password: InputMaybe<OrderBy>;
  photo: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
  username: InputMaybe<OrderBy>;
}

export interface CustomersUpdateInput {
  addressId: InputMaybe<Scalars['Int']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  lastname: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  photo: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
}

export interface CustomersWhereInput {
  addressId: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['String']['input']>;
  lastname: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  photo: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
}

export interface Mutation {
  deleteAttributeOptionImages: Maybe<Scalars['Boolean']['output']>;
  deleteAttributeOptions: Maybe<Scalars['Boolean']['output']>;
  deleteAttributes: Maybe<Scalars['Boolean']['output']>;
  deleteBanner: Maybe<Scalars['Boolean']['output']>;
  deleteBrands: Maybe<Scalars['Boolean']['output']>;
  deleteCategories: Maybe<Scalars['Boolean']['output']>;
  deleteCustomers: Maybe<Scalars['Boolean']['output']>;
  deleteCustomersAddresses: Maybe<Scalars['Boolean']['output']>;
  deletePermissions: Maybe<Scalars['Boolean']['output']>;
  deleteProductCategories: Maybe<Scalars['Boolean']['output']>;
  deleteProductRatingSummary: Maybe<Scalars['Boolean']['output']>;
  deleteProductVariants: Maybe<Scalars['Boolean']['output']>;
  deleteProducts: Maybe<Scalars['Boolean']['output']>;
  deletePromotionVariants: Maybe<Scalars['Boolean']['output']>;
  deletePromotions: Maybe<Scalars['Boolean']['output']>;
  deleteRatingImages: Maybe<Scalars['Boolean']['output']>;
  deleteRoles: Maybe<Scalars['Boolean']['output']>;
  deleteRolesSections: Maybe<Scalars['Boolean']['output']>;
  deleteSections: Maybe<Scalars['Boolean']['output']>;
  deleteServices: Maybe<Scalars['Boolean']['output']>;
  deleteServicesImages: Maybe<Scalars['Boolean']['output']>;
  deleteUsers: Maybe<Scalars['Boolean']['output']>;
  deleteVariantAttributeOptions: Maybe<Scalars['Boolean']['output']>;
  deleteVariantImages: Maybe<Scalars['Boolean']['output']>;
  deleteVariantRatingSummary: Maybe<Scalars['Boolean']['output']>;
  deleteVariantRatings: Maybe<Scalars['Boolean']['output']>;
  insertAttributeOptionImages: Maybe<AttributeOptionImages>;
  insertAttributeOptions: Maybe<AttributeOptions>;
  insertAttributes: Maybe<Attributes>;
  insertBanner: Maybe<Banner>;
  insertBrands: Maybe<Brands>;
  insertCategories: Maybe<Categories>;
  insertCustomers: Maybe<Customers>;
  insertCustomersAddresses: Maybe<CustomersAddresses>;
  insertPermissions: Maybe<Permissions>;
  insertProductCategories: Maybe<ProductCategories>;
  insertProductRatingSummary: Maybe<ProductRatingSummary>;
  insertProductVariants: Maybe<ProductVariants>;
  insertProducts: Maybe<Products>;
  insertPromotionVariants: Maybe<PromotionVariants>;
  insertPromotions: Maybe<Promotions>;
  insertRatingImages: Maybe<RatingImages>;
  insertRoles: Maybe<Roles>;
  insertRolesSections: Maybe<RolesSections>;
  insertSections: Maybe<Sections>;
  insertServices: Maybe<Services>;
  insertServicesImages: Maybe<ServicesImages>;
  insertUsers: Maybe<Users>;
  insertVariantAttributeOptions: Maybe<VariantAttributeOptions>;
  insertVariantImages: Maybe<VariantImages>;
  insertVariantRatingSummary: Maybe<VariantRatingSummary>;
  insertVariantRatings: Maybe<VariantRatings>;
  updateAttributeOptionImages: Maybe<AttributeOptionImages>;
  updateAttributeOptions: Maybe<AttributeOptions>;
  updateAttributes: Maybe<Attributes>;
  updateBanner: Maybe<Banner>;
  updateBrands: Maybe<Brands>;
  updateCategories: Maybe<Categories>;
  updateCustomers: Maybe<Customers>;
  updateCustomersAddresses: Maybe<CustomersAddresses>;
  updatePermissions: Maybe<Permissions>;
  updateProductCategories: Maybe<ProductCategories>;
  updateProductRatingSummary: Maybe<ProductRatingSummary>;
  updateProductVariants: Maybe<ProductVariants>;
  updateProducts: Maybe<Products>;
  updatePromotionVariants: Maybe<PromotionVariants>;
  updatePromotions: Maybe<Promotions>;
  updateRatingImages: Maybe<RatingImages>;
  updateRoles: Maybe<Roles>;
  updateRolesSections: Maybe<RolesSections>;
  updateSections: Maybe<Sections>;
  updateServices: Maybe<Services>;
  updateServicesImages: Maybe<ServicesImages>;
  updateUsers: Maybe<Users>;
  updateVariantAttributeOptions: Maybe<VariantAttributeOptions>;
  updateVariantImages: Maybe<VariantImages>;
  updateVariantRatingSummary: Maybe<VariantRatingSummary>;
  updateVariantRatings: Maybe<VariantRatings>;
}


export interface MutationDeleteAttributeOptionImagesArgs {
  where: InputMaybe<AttributeOptionImagesWhereInput>;
}


export interface MutationDeleteAttributeOptionsArgs {
  where: InputMaybe<AttributeOptionsWhereInput>;
}


export interface MutationDeleteAttributesArgs {
  where: InputMaybe<AttributesWhereInput>;
}


export interface MutationDeleteBannerArgs {
  where: InputMaybe<BannerWhereInput>;
}


export interface MutationDeleteBrandsArgs {
  where: InputMaybe<BrandsWhereInput>;
}


export interface MutationDeleteCategoriesArgs {
  where: InputMaybe<CategoriesWhereInput>;
}


export interface MutationDeleteCustomersArgs {
  where: InputMaybe<CustomersWhereInput>;
}


export interface MutationDeleteCustomersAddressesArgs {
  where: InputMaybe<CustomersAddressesWhereInput>;
}


export interface MutationDeletePermissionsArgs {
  where: InputMaybe<PermissionsWhereInput>;
}


export interface MutationDeleteProductCategoriesArgs {
  where: InputMaybe<ProductCategoriesWhereInput>;
}


export interface MutationDeleteProductRatingSummaryArgs {
  where: InputMaybe<ProductRatingSummaryWhereInput>;
}


export interface MutationDeleteProductVariantsArgs {
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface MutationDeleteProductsArgs {
  where: InputMaybe<ProductsWhereInput>;
}


export interface MutationDeletePromotionVariantsArgs {
  where: InputMaybe<PromotionVariantsWhereInput>;
}


export interface MutationDeletePromotionsArgs {
  where: InputMaybe<PromotionsWhereInput>;
}


export interface MutationDeleteRatingImagesArgs {
  where: InputMaybe<RatingImagesWhereInput>;
}


export interface MutationDeleteRolesArgs {
  where: InputMaybe<RolesWhereInput>;
}


export interface MutationDeleteRolesSectionsArgs {
  where: InputMaybe<RolesSectionsWhereInput>;
}


export interface MutationDeleteSectionsArgs {
  where: InputMaybe<SectionsWhereInput>;
}


export interface MutationDeleteServicesArgs {
  where: InputMaybe<ServicesWhereInput>;
}


export interface MutationDeleteServicesImagesArgs {
  where: InputMaybe<ServicesImagesWhereInput>;
}


export interface MutationDeleteUsersArgs {
  where: InputMaybe<UsersWhereInput>;
}


export interface MutationDeleteVariantAttributeOptionsArgs {
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}


export interface MutationDeleteVariantImagesArgs {
  where: InputMaybe<VariantImagesWhereInput>;
}


export interface MutationDeleteVariantRatingSummaryArgs {
  where: InputMaybe<VariantRatingSummaryWhereInput>;
}


export interface MutationDeleteVariantRatingsArgs {
  where: InputMaybe<VariantRatingsWhereInput>;
}


export interface MutationInsertAttributeOptionImagesArgs {
  attribute_option_images: AttributeOptionImagesInsertInput;
}


export interface MutationInsertAttributeOptionsArgs {
  attribute_options: AttributeOptionsInsertInput;
}


export interface MutationInsertAttributesArgs {
  attributes: AttributesInsertInput;
}


export interface MutationInsertBannerArgs {
  banner: BannerInsertInput;
}


export interface MutationInsertBrandsArgs {
  brands: BrandsInsertInput;
}


export interface MutationInsertCategoriesArgs {
  categories: CategoriesInsertInput;
}


export interface MutationInsertCustomersArgs {
  customers: CustomersInsertInput;
}


export interface MutationInsertCustomersAddressesArgs {
  customers_addresses: CustomersAddressesInsertInput;
}


export interface MutationInsertPermissionsArgs {
  permissions: PermissionsInsertInput;
}


export interface MutationInsertProductCategoriesArgs {
  product_categories: ProductCategoriesInsertInput;
}


export interface MutationInsertProductRatingSummaryArgs {
  product_rating_summary: ProductRatingSummaryInsertInput;
}


export interface MutationInsertProductVariantsArgs {
  product_variants: ProductVariantsInsertInput;
}


export interface MutationInsertProductsArgs {
  products: ProductsInsertInput;
}


export interface MutationInsertPromotionVariantsArgs {
  promotion_variants: PromotionVariantsInsertInput;
}


export interface MutationInsertPromotionsArgs {
  promotions: PromotionsInsertInput;
}


export interface MutationInsertRatingImagesArgs {
  rating_images: RatingImagesInsertInput;
}


export interface MutationInsertRolesArgs {
  roles: RolesInsertInput;
}


export interface MutationInsertRolesSectionsArgs {
  roles_sections: RolesSectionsInsertInput;
}


export interface MutationInsertSectionsArgs {
  sections: SectionsInsertInput;
}


export interface MutationInsertServicesArgs {
  services: ServicesInsertInput;
}


export interface MutationInsertServicesImagesArgs {
  services_images: ServicesImagesInsertInput;
}


export interface MutationInsertUsersArgs {
  users: UsersInsertInput;
}


export interface MutationInsertVariantAttributeOptionsArgs {
  variant_attribute_options: VariantAttributeOptionsInsertInput;
}


export interface MutationInsertVariantImagesArgs {
  variant_images: VariantImagesInsertInput;
}


export interface MutationInsertVariantRatingSummaryArgs {
  variant_rating_summary: VariantRatingSummaryInsertInput;
}


export interface MutationInsertVariantRatingsArgs {
  variant_ratings: VariantRatingsInsertInput;
}


export interface MutationUpdateAttributeOptionImagesArgs {
  attribute_option_images: AttributeOptionImagesUpdateInput;
  where: InputMaybe<AttributeOptionImagesWhereInput>;
}


export interface MutationUpdateAttributeOptionsArgs {
  attribute_options: AttributeOptionsUpdateInput;
  where: InputMaybe<AttributeOptionsWhereInput>;
}


export interface MutationUpdateAttributesArgs {
  attributes: AttributesUpdateInput;
  where: InputMaybe<AttributesWhereInput>;
}


export interface MutationUpdateBannerArgs {
  banner: BannerUpdateInput;
  where: InputMaybe<BannerWhereInput>;
}


export interface MutationUpdateBrandsArgs {
  brands: BrandsUpdateInput;
  where: InputMaybe<BrandsWhereInput>;
}


export interface MutationUpdateCategoriesArgs {
  categories: CategoriesUpdateInput;
  where: InputMaybe<CategoriesWhereInput>;
}


export interface MutationUpdateCustomersArgs {
  customers: CustomersUpdateInput;
  where: InputMaybe<CustomersWhereInput>;
}


export interface MutationUpdateCustomersAddressesArgs {
  customers_addresses: CustomersAddressesUpdateInput;
  where: InputMaybe<CustomersAddressesWhereInput>;
}


export interface MutationUpdatePermissionsArgs {
  permissions: PermissionsUpdateInput;
  where: InputMaybe<PermissionsWhereInput>;
}


export interface MutationUpdateProductCategoriesArgs {
  product_categories: ProductCategoriesUpdateInput;
  where: InputMaybe<ProductCategoriesWhereInput>;
}


export interface MutationUpdateProductRatingSummaryArgs {
  product_rating_summary: ProductRatingSummaryUpdateInput;
  where: InputMaybe<ProductRatingSummaryWhereInput>;
}


export interface MutationUpdateProductVariantsArgs {
  product_variants: ProductVariantsUpdateInput;
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface MutationUpdateProductsArgs {
  products: ProductsUpdateInput;
  where: InputMaybe<ProductsWhereInput>;
}


export interface MutationUpdatePromotionVariantsArgs {
  promotion_variants: PromotionVariantsUpdateInput;
  where: InputMaybe<PromotionVariantsWhereInput>;
}


export interface MutationUpdatePromotionsArgs {
  promotions: PromotionsUpdateInput;
  where: InputMaybe<PromotionsWhereInput>;
}


export interface MutationUpdateRatingImagesArgs {
  rating_images: RatingImagesUpdateInput;
  where: InputMaybe<RatingImagesWhereInput>;
}


export interface MutationUpdateRolesArgs {
  roles: RolesUpdateInput;
  where: InputMaybe<RolesWhereInput>;
}


export interface MutationUpdateRolesSectionsArgs {
  roles_sections: RolesSectionsUpdateInput;
  where: InputMaybe<RolesSectionsWhereInput>;
}


export interface MutationUpdateSectionsArgs {
  sections: SectionsUpdateInput;
  where: InputMaybe<SectionsWhereInput>;
}


export interface MutationUpdateServicesArgs {
  services: ServicesUpdateInput;
  where: InputMaybe<ServicesWhereInput>;
}


export interface MutationUpdateServicesImagesArgs {
  services_images: ServicesImagesUpdateInput;
  where: InputMaybe<ServicesImagesWhereInput>;
}


export interface MutationUpdateUsersArgs {
  users: UsersUpdateInput;
  where: InputMaybe<UsersWhereInput>;
}


export interface MutationUpdateVariantAttributeOptionsArgs {
  variant_attribute_options: VariantAttributeOptionsUpdateInput;
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}


export interface MutationUpdateVariantImagesArgs {
  variant_images: VariantImagesUpdateInput;
  where: InputMaybe<VariantImagesWhereInput>;
}


export interface MutationUpdateVariantRatingSummaryArgs {
  variant_rating_summary: VariantRatingSummaryUpdateInput;
  where: InputMaybe<VariantRatingSummaryWhereInput>;
}


export interface MutationUpdateVariantRatingsArgs {
  variant_ratings: VariantRatingsUpdateInput;
  where: InputMaybe<VariantRatingsWhereInput>;
}

export type OrderBy =
  | 'asc'
  | 'desc';

export interface Permissions {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
}

export interface PermissionsInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface PermissionsOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface PermissionsUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface PermissionsWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface ProductCategories {
  categoryId: Scalars['Int']['output'];
  productId: Scalars['Int']['output'];
}

export interface ProductCategoriesInsertInput {
  categoryId: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
}

export interface ProductCategoriesOrderByInput {
  categoryId: InputMaybe<OrderBy>;
  productId: InputMaybe<OrderBy>;
}

export interface ProductCategoriesUpdateInput {
  categoryId: InputMaybe<Scalars['Int']['input']>;
  productId: InputMaybe<Scalars['Int']['input']>;
}

export interface ProductCategoriesWhereInput {
  categoryId: InputMaybe<Scalars['String']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
}

/** VIEW */
export interface ProductRatingSummary {
  averageRating: Maybe<Scalars['Float']['output']>;
  fiveStar: Maybe<Scalars['Float']['output']>;
  fourStar: Maybe<Scalars['Float']['output']>;
  oneStar: Maybe<Scalars['Float']['output']>;
  productId: Scalars['Int']['output'];
  threeStar: Maybe<Scalars['Float']['output']>;
  totalRatings: Scalars['BigInt']['output'];
  twoStar: Maybe<Scalars['Float']['output']>;
  verifiedPurchases: Maybe<Scalars['Float']['output']>;
}

/** VIEW */
export interface ProductRatingSummaryInsertInput {
  averageRating: InputMaybe<Scalars['Float']['input']>;
  fiveStar: InputMaybe<Scalars['Float']['input']>;
  fourStar: InputMaybe<Scalars['Float']['input']>;
  oneStar: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  threeStar: InputMaybe<Scalars['Float']['input']>;
  totalRatings: InputMaybe<Scalars['BigInt']['input']>;
  twoStar: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases: InputMaybe<Scalars['Float']['input']>;
}

/** VIEW */
export interface ProductRatingSummaryOrderByInput {
  averageRating: InputMaybe<OrderBy>;
  fiveStar: InputMaybe<OrderBy>;
  fourStar: InputMaybe<OrderBy>;
  oneStar: InputMaybe<OrderBy>;
  productId: InputMaybe<OrderBy>;
  threeStar: InputMaybe<OrderBy>;
  totalRatings: InputMaybe<OrderBy>;
  twoStar: InputMaybe<OrderBy>;
  verifiedPurchases: InputMaybe<OrderBy>;
}

/** VIEW */
export interface ProductRatingSummaryUpdateInput {
  averageRating: InputMaybe<Scalars['Float']['input']>;
  fiveStar: InputMaybe<Scalars['Float']['input']>;
  fourStar: InputMaybe<Scalars['Float']['input']>;
  oneStar: InputMaybe<Scalars['Float']['input']>;
  productId: InputMaybe<Scalars['Int']['input']>;
  threeStar: InputMaybe<Scalars['Float']['input']>;
  totalRatings: InputMaybe<Scalars['BigInt']['input']>;
  twoStar: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases: InputMaybe<Scalars['Float']['input']>;
}

/** VIEW */
export interface ProductRatingSummaryWhereInput {
  averageRating: InputMaybe<Scalars['String']['input']>;
  fiveStar: InputMaybe<Scalars['String']['input']>;
  fourStar: InputMaybe<Scalars['String']['input']>;
  oneStar: InputMaybe<Scalars['String']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
  threeStar: InputMaybe<Scalars['String']['input']>;
  totalRatings: InputMaybe<Scalars['String']['input']>;
  twoStar: InputMaybe<Scalars['String']['input']>;
  verifiedPurchases: InputMaybe<Scalars['String']['input']>;
}

export interface ProductVariants {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  productId: Scalars['Int']['output'];
  products: Maybe<Array<Maybe<Products>>>;
  promotionVariants: Maybe<Array<Maybe<PromotionVariants>>>;
  sku: Scalars['String']['output'];
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  variantAttributeOptions: Maybe<Array<Maybe<VariantAttributeOptions>>>;
  variantImages: Maybe<Array<Maybe<VariantImages>>>;
  variantRatings: Maybe<Array<Maybe<VariantRatings>>>;
}


export interface ProductVariantsProductsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductsOrderByInput>;
  where: InputMaybe<ProductsWhereInput>;
}


export interface ProductVariantsPromotionVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PromotionVariantsOrderByInput>;
  where: InputMaybe<PromotionVariantsWhereInput>;
}


export interface ProductVariantsVariantAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantAttributeOptionsOrderByInput>;
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}


export interface ProductVariantsVariantImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantImagesOrderByInput>;
  where: InputMaybe<VariantImagesWhereInput>;
}


export interface ProductVariantsVariantRatingsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantRatingsOrderByInput>;
  where: InputMaybe<VariantRatingsWhereInput>;
}

export interface ProductVariantsInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  sku: Scalars['String']['input'];
  stock: InputMaybe<Scalars['Int']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ProductVariantsOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  price: InputMaybe<OrderBy>;
  productId: InputMaybe<OrderBy>;
  sku: InputMaybe<OrderBy>;
  stock: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface ProductVariantsUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  price: InputMaybe<Scalars['Float']['input']>;
  productId: InputMaybe<Scalars['Int']['input']>;
  sku: InputMaybe<Scalars['String']['input']>;
  stock: InputMaybe<Scalars['Int']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ProductVariantsWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  price: InputMaybe<Scalars['String']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
  sku: InputMaybe<Scalars['String']['input']>;
  stock: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface Products {
  basePrice: Maybe<Scalars['Float']['output']>;
  brandId: Maybe<Scalars['Int']['output']>;
  brands: Maybe<Array<Maybe<Brands>>>;
  createdAt: Scalars['Timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  updatedAt: Scalars['Timestamp']['output'];
}


export interface ProductsBrandsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<BrandsOrderByInput>;
  where: InputMaybe<BrandsWhereInput>;
}


export interface ProductsProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
}

export interface ProductsInsertInput {
  basePrice: InputMaybe<Scalars['Float']['input']>;
  brandId: InputMaybe<Scalars['Int']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ProductsOrderByInput {
  basePrice: InputMaybe<OrderBy>;
  brandId: InputMaybe<OrderBy>;
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface ProductsUpdateInput {
  basePrice: InputMaybe<Scalars['Float']['input']>;
  brandId: InputMaybe<Scalars['Int']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ProductsWhereInput {
  basePrice: InputMaybe<Scalars['String']['input']>;
  brandId: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface PromotionVariants {
  createdAt: Scalars['Timestamp']['output'];
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  promotionId: Scalars['Int']['output'];
  promotionPrice: Maybe<Scalars['Float']['output']>;
  promotions: Maybe<Array<Maybe<Promotions>>>;
  stockLimit: Maybe<Scalars['Int']['output']>;
  variantId: Scalars['Int']['output'];
}


export interface PromotionVariantsProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface PromotionVariantsPromotionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PromotionsOrderByInput>;
  where: InputMaybe<PromotionsWhereInput>;
}

export interface PromotionVariantsInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  promotionId: Scalars['Int']['input'];
  promotionPrice: InputMaybe<Scalars['Float']['input']>;
  stockLimit: InputMaybe<Scalars['Int']['input']>;
  variantId: Scalars['Int']['input'];
}

export interface PromotionVariantsOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  promotionId: InputMaybe<OrderBy>;
  promotionPrice: InputMaybe<OrderBy>;
  stockLimit: InputMaybe<OrderBy>;
  variantId: InputMaybe<OrderBy>;
}

export interface PromotionVariantsUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  promotionId: InputMaybe<Scalars['Int']['input']>;
  promotionPrice: InputMaybe<Scalars['Float']['input']>;
  stockLimit: InputMaybe<Scalars['Int']['input']>;
  variantId: InputMaybe<Scalars['Int']['input']>;
}

export interface PromotionVariantsWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  promotionId: InputMaybe<Scalars['String']['input']>;
  promotionPrice: InputMaybe<Scalars['String']['input']>;
  stockLimit: InputMaybe<Scalars['String']['input']>;
  variantId: InputMaybe<Scalars['String']['input']>;
}

export interface Promotions {
  createdAt: Scalars['Timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  discountType: PromotionsDiscountType;
  discountValue: Scalars['Float']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isActive: Maybe<Scalars['Int']['output']>;
  minPurchaseAmount: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  promotionVariants: Maybe<Array<Maybe<PromotionVariants>>>;
  startDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['Timestamp']['output'];
}


export interface PromotionsPromotionVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PromotionVariantsOrderByInput>;
  where: InputMaybe<PromotionVariantsWhereInput>;
}

export type PromotionsDiscountType =
  | 'fixed_amount'
  | 'percentage';

export interface PromotionsInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  discountType: InputMaybe<PromotionsDiscountType>;
  discountValue: Scalars['Float']['input'];
  endDate: Scalars['DateTime']['input'];
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  minPurchaseAmount: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface PromotionsOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  discountType: InputMaybe<OrderBy>;
  discountValue: InputMaybe<OrderBy>;
  endDate: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  isActive: InputMaybe<OrderBy>;
  minPurchaseAmount: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  startDate: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface PromotionsUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  discountType: InputMaybe<PromotionsDiscountType>;
  discountValue: InputMaybe<Scalars['Float']['input']>;
  endDate: InputMaybe<Scalars['DateTime']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  minPurchaseAmount: InputMaybe<Scalars['Float']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface PromotionsWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  discountType: InputMaybe<Scalars['String']['input']>;
  discountValue: InputMaybe<Scalars['String']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['String']['input']>;
  minPurchaseAmount: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface Query {
  attributeOptionImages: Maybe<Array<Maybe<AttributeOptionImages>>>;
  attributeOptions: Maybe<Array<Maybe<AttributeOptions>>>;
  attributes: Maybe<Array<Maybe<Attributes>>>;
  banner: Maybe<Array<Maybe<Banner>>>;
  brands: Maybe<Array<Maybe<Brands>>>;
  categories: Maybe<Array<Maybe<Categories>>>;
  countAttributeOptionImages: Maybe<Scalars['Int']['output']>;
  countAttributeOptions: Maybe<Scalars['Int']['output']>;
  countAttributes: Maybe<Scalars['Int']['output']>;
  countBanner: Maybe<Scalars['Int']['output']>;
  countBrands: Maybe<Scalars['Int']['output']>;
  countCategories: Maybe<Scalars['Int']['output']>;
  countCustomers: Maybe<Scalars['Int']['output']>;
  countCustomersAddresses: Maybe<Scalars['Int']['output']>;
  countPermissions: Maybe<Scalars['Int']['output']>;
  countProductCategories: Maybe<Scalars['Int']['output']>;
  countProductRatingSummary: Maybe<Scalars['Int']['output']>;
  countProductVariants: Maybe<Scalars['Int']['output']>;
  countProducts: Maybe<Scalars['Int']['output']>;
  countPromotionVariants: Maybe<Scalars['Int']['output']>;
  countPromotions: Maybe<Scalars['Int']['output']>;
  countRatingImages: Maybe<Scalars['Int']['output']>;
  countRoles: Maybe<Scalars['Int']['output']>;
  countRolesSections: Maybe<Scalars['Int']['output']>;
  countSections: Maybe<Scalars['Int']['output']>;
  countServices: Maybe<Scalars['Int']['output']>;
  countServicesImages: Maybe<Scalars['Int']['output']>;
  countUsers: Maybe<Scalars['Int']['output']>;
  countVariantAttributeOptions: Maybe<Scalars['Int']['output']>;
  countVariantImages: Maybe<Scalars['Int']['output']>;
  countVariantRatingSummary: Maybe<Scalars['Int']['output']>;
  countVariantRatings: Maybe<Scalars['Int']['output']>;
  customers: Maybe<Array<Maybe<Customers>>>;
  customersAddresses: Maybe<Array<Maybe<CustomersAddresses>>>;
  permissions: Maybe<Array<Maybe<Permissions>>>;
  productCategories: Maybe<Array<Maybe<ProductCategories>>>;
  productRatingSummary: Maybe<Array<Maybe<ProductRatingSummary>>>;
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  products: Maybe<Array<Maybe<Products>>>;
  promotionVariants: Maybe<Array<Maybe<PromotionVariants>>>;
  promotions: Maybe<Array<Maybe<Promotions>>>;
  ratingImages: Maybe<Array<Maybe<RatingImages>>>;
  roles: Maybe<Array<Maybe<Roles>>>;
  rolesSections: Maybe<Array<Maybe<RolesSections>>>;
  sections: Maybe<Array<Maybe<Sections>>>;
  services: Maybe<Array<Maybe<Services>>>;
  servicesImages: Maybe<Array<Maybe<ServicesImages>>>;
  users: Maybe<Array<Maybe<Users>>>;
  variantAttributeOptions: Maybe<Array<Maybe<VariantAttributeOptions>>>;
  variantImages: Maybe<Array<Maybe<VariantImages>>>;
  variantRatingSummary: Maybe<Array<Maybe<VariantRatingSummary>>>;
  variantRatings: Maybe<Array<Maybe<VariantRatings>>>;
}


export interface QueryAttributeOptionImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributeOptionImagesOrderByInput>;
  where: InputMaybe<AttributeOptionImagesWhereInput>;
}


export interface QueryAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributeOptionsOrderByInput>;
  where: InputMaybe<AttributeOptionsWhereInput>;
}


export interface QueryAttributesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributesOrderByInput>;
  where: InputMaybe<AttributesWhereInput>;
}


export interface QueryBannerArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<BannerOrderByInput>;
  where: InputMaybe<BannerWhereInput>;
}


export interface QueryBrandsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<BrandsOrderByInput>;
  where: InputMaybe<BrandsWhereInput>;
}


export interface QueryCategoriesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CategoriesOrderByInput>;
  where: InputMaybe<CategoriesWhereInput>;
}


export interface QueryCountAttributeOptionImagesArgs {
  where: InputMaybe<AttributeOptionImagesWhereInput>;
}


export interface QueryCountAttributeOptionsArgs {
  where: InputMaybe<AttributeOptionsWhereInput>;
}


export interface QueryCountAttributesArgs {
  where: InputMaybe<AttributesWhereInput>;
}


export interface QueryCountBannerArgs {
  where: InputMaybe<BannerWhereInput>;
}


export interface QueryCountBrandsArgs {
  where: InputMaybe<BrandsWhereInput>;
}


export interface QueryCountCategoriesArgs {
  where: InputMaybe<CategoriesWhereInput>;
}


export interface QueryCountCustomersArgs {
  where: InputMaybe<CustomersWhereInput>;
}


export interface QueryCountCustomersAddressesArgs {
  where: InputMaybe<CustomersAddressesWhereInput>;
}


export interface QueryCountPermissionsArgs {
  where: InputMaybe<PermissionsWhereInput>;
}


export interface QueryCountProductCategoriesArgs {
  where: InputMaybe<ProductCategoriesWhereInput>;
}


export interface QueryCountProductRatingSummaryArgs {
  where: InputMaybe<ProductRatingSummaryWhereInput>;
}


export interface QueryCountProductVariantsArgs {
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface QueryCountProductsArgs {
  where: InputMaybe<ProductsWhereInput>;
}


export interface QueryCountPromotionVariantsArgs {
  where: InputMaybe<PromotionVariantsWhereInput>;
}


export interface QueryCountPromotionsArgs {
  where: InputMaybe<PromotionsWhereInput>;
}


export interface QueryCountRatingImagesArgs {
  where: InputMaybe<RatingImagesWhereInput>;
}


export interface QueryCountRolesArgs {
  where: InputMaybe<RolesWhereInput>;
}


export interface QueryCountRolesSectionsArgs {
  where: InputMaybe<RolesSectionsWhereInput>;
}


export interface QueryCountSectionsArgs {
  where: InputMaybe<SectionsWhereInput>;
}


export interface QueryCountServicesArgs {
  where: InputMaybe<ServicesWhereInput>;
}


export interface QueryCountServicesImagesArgs {
  where: InputMaybe<ServicesImagesWhereInput>;
}


export interface QueryCountUsersArgs {
  where: InputMaybe<UsersWhereInput>;
}


export interface QueryCountVariantAttributeOptionsArgs {
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}


export interface QueryCountVariantImagesArgs {
  where: InputMaybe<VariantImagesWhereInput>;
}


export interface QueryCountVariantRatingSummaryArgs {
  where: InputMaybe<VariantRatingSummaryWhereInput>;
}


export interface QueryCountVariantRatingsArgs {
  where: InputMaybe<VariantRatingsWhereInput>;
}


export interface QueryCustomersArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CustomersOrderByInput>;
  where: InputMaybe<CustomersWhereInput>;
}


export interface QueryCustomersAddressesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CustomersAddressesOrderByInput>;
  where: InputMaybe<CustomersAddressesWhereInput>;
}


export interface QueryPermissionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PermissionsOrderByInput>;
  where: InputMaybe<PermissionsWhereInput>;
}


export interface QueryProductCategoriesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductCategoriesOrderByInput>;
  where: InputMaybe<ProductCategoriesWhereInput>;
}


export interface QueryProductRatingSummaryArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductRatingSummaryOrderByInput>;
  where: InputMaybe<ProductRatingSummaryWhereInput>;
}


export interface QueryProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface QueryProductsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductsOrderByInput>;
  where: InputMaybe<ProductsWhereInput>;
}


export interface QueryPromotionVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PromotionVariantsOrderByInput>;
  where: InputMaybe<PromotionVariantsWhereInput>;
}


export interface QueryPromotionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<PromotionsOrderByInput>;
  where: InputMaybe<PromotionsWhereInput>;
}


export interface QueryRatingImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RatingImagesOrderByInput>;
  where: InputMaybe<RatingImagesWhereInput>;
}


export interface QueryRolesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesOrderByInput>;
  where: InputMaybe<RolesWhereInput>;
}


export interface QueryRolesSectionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesSectionsOrderByInput>;
  where: InputMaybe<RolesSectionsWhereInput>;
}


export interface QuerySectionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<SectionsOrderByInput>;
  where: InputMaybe<SectionsWhereInput>;
}


export interface QueryServicesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ServicesOrderByInput>;
  where: InputMaybe<ServicesWhereInput>;
}


export interface QueryServicesImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ServicesImagesOrderByInput>;
  where: InputMaybe<ServicesImagesWhereInput>;
}


export interface QueryUsersArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<UsersOrderByInput>;
  where: InputMaybe<UsersWhereInput>;
}


export interface QueryVariantAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantAttributeOptionsOrderByInput>;
  where: InputMaybe<VariantAttributeOptionsWhereInput>;
}


export interface QueryVariantImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantImagesOrderByInput>;
  where: InputMaybe<VariantImagesWhereInput>;
}


export interface QueryVariantRatingSummaryArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantRatingSummaryOrderByInput>;
  where: InputMaybe<VariantRatingSummaryWhereInput>;
}


export interface QueryVariantRatingsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantRatingsOrderByInput>;
  where: InputMaybe<VariantRatingsWhereInput>;
}

export interface RatingImages {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  ratingId: Scalars['Int']['output'];
  variantRatings: Maybe<Array<Maybe<VariantRatings>>>;
}


export interface RatingImagesVariantRatingsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<VariantRatingsOrderByInput>;
  where: InputMaybe<VariantRatingsWhereInput>;
}

export interface RatingImagesInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: Scalars['String']['input'];
  ratingId: Scalars['Int']['input'];
}

export interface RatingImagesOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageUrl: InputMaybe<OrderBy>;
  ratingId: InputMaybe<OrderBy>;
}

export interface RatingImagesUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  ratingId: InputMaybe<Scalars['Int']['input']>;
}

export interface RatingImagesWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  ratingId: InputMaybe<Scalars['String']['input']>;
}

export interface Roles {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rolesSections: Maybe<Array<Maybe<RolesSections>>>;
  updatedAt: Scalars['Timestamp']['output'];
  users: Maybe<Array<Maybe<Users>>>;
}


export interface RolesRolesSectionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesSectionsOrderByInput>;
  where: InputMaybe<RolesSectionsWhereInput>;
}


export interface RolesUsersArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<UsersOrderByInput>;
  where: InputMaybe<UsersWhereInput>;
}

export interface RolesInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface RolesOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface RolesSections {
  id: Scalars['Int']['output'];
  idRol: Maybe<Scalars['Int']['output']>;
  idSection: Maybe<Scalars['Int']['output']>;
  roles: Maybe<Array<Maybe<Roles>>>;
  sections: Maybe<Array<Maybe<Sections>>>;
}


export interface RolesSectionsRolesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesOrderByInput>;
  where: InputMaybe<RolesWhereInput>;
}


export interface RolesSectionsSectionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<SectionsOrderByInput>;
  where: InputMaybe<SectionsWhereInput>;
}

export interface RolesSectionsInsertInput {
  id: InputMaybe<Scalars['Int']['input']>;
  idRol: InputMaybe<Scalars['Int']['input']>;
  idSection: InputMaybe<Scalars['Int']['input']>;
}

export interface RolesSectionsOrderByInput {
  id: InputMaybe<OrderBy>;
  idRol: InputMaybe<OrderBy>;
  idSection: InputMaybe<OrderBy>;
}

export interface RolesSectionsUpdateInput {
  id: InputMaybe<Scalars['Int']['input']>;
  idRol: InputMaybe<Scalars['Int']['input']>;
  idSection: InputMaybe<Scalars['Int']['input']>;
}

export interface RolesSectionsWhereInput {
  id: InputMaybe<Scalars['String']['input']>;
  idRol: InputMaybe<Scalars['String']['input']>;
  idSection: InputMaybe<Scalars['String']['input']>;
}

export interface RolesUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface RolesWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface Sections {
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  rolesSections: Maybe<Array<Maybe<RolesSections>>>;
  url: Maybe<Scalars['String']['output']>;
}


export interface SectionsRolesSectionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesSectionsOrderByInput>;
  where: InputMaybe<RolesSectionsWhereInput>;
}

export interface SectionsInsertInput {
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  url: InputMaybe<Scalars['String']['input']>;
}

export interface SectionsOrderByInput {
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  image: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  url: InputMaybe<OrderBy>;
}

export interface SectionsUpdateInput {
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  url: InputMaybe<Scalars['String']['input']>;
}

export interface SectionsWhereInput {
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  url: InputMaybe<Scalars['String']['input']>;
}

export interface Services {
  createdAt: Scalars['Timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  servicesImages: Maybe<Array<Maybe<ServicesImages>>>;
  slug: Maybe<Scalars['String']['output']>;
  subtitle: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
}


export interface ServicesServicesImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ServicesImagesOrderByInput>;
  where: InputMaybe<ServicesImagesWhereInput>;
}

export interface ServicesImages {
  createdAt: Scalars['Timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  idService: Maybe<Scalars['Int']['output']>;
  imageUrl: Maybe<Scalars['String']['output']>;
  services: Maybe<Array<Maybe<Services>>>;
  subtitle: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
}


export interface ServicesImagesServicesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ServicesOrderByInput>;
  where: InputMaybe<ServicesWhereInput>;
}

export interface ServicesImagesInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  idService: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ServicesImagesOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  idService: InputMaybe<OrderBy>;
  imageUrl: InputMaybe<OrderBy>;
  subtitle: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface ServicesImagesUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  idService: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ServicesImagesWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  idService: InputMaybe<Scalars['String']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface ServicesInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ServicesOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageUrl: InputMaybe<OrderBy>;
  slug: InputMaybe<OrderBy>;
  subtitle: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
}

export interface ServicesUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
}

export interface ServicesWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageUrl: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
  subtitle: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
}

export interface Users {
  createdAt: Scalars['Timestamp']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  photo: Maybe<Scalars['String']['output']>;
  roleId: Scalars['Int']['output'];
  roles: Maybe<Array<Maybe<Roles>>>;
  updatedAt: Scalars['Timestamp']['output'];
  username: Scalars['String']['output'];
}


export interface UsersRolesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RolesOrderByInput>;
  where: InputMaybe<RolesWhereInput>;
}

export interface UsersInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  email: Scalars['String']['input'];
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  photo: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['Int']['input'];
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  username: Scalars['String']['input'];
}

export interface UsersOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  email: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  isActive: InputMaybe<OrderBy>;
  lastname: InputMaybe<OrderBy>;
  password: InputMaybe<OrderBy>;
  photo: InputMaybe<OrderBy>;
  roleId: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
  username: InputMaybe<OrderBy>;
}

export interface UsersUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  isActive: InputMaybe<Scalars['Int']['input']>;
  lastname: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  photo: InputMaybe<Scalars['String']['input']>;
  roleId: InputMaybe<Scalars['Int']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
}

export interface UsersWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['String']['input']>;
  lastname: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  photo: InputMaybe<Scalars['String']['input']>;
  roleId: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
}

export interface VariantAttributeOptions {
  attributeOptionId: Scalars['Int']['output'];
  attributeOptions: Maybe<Array<Maybe<AttributeOptions>>>;
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  variantId: Scalars['Int']['output'];
}


export interface VariantAttributeOptionsAttributeOptionsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<AttributeOptionsOrderByInput>;
  where: InputMaybe<AttributeOptionsWhereInput>;
}


export interface VariantAttributeOptionsProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
}

export interface VariantAttributeOptionsInsertInput {
  attributeOptionId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
}

export interface VariantAttributeOptionsOrderByInput {
  attributeOptionId: InputMaybe<OrderBy>;
  variantId: InputMaybe<OrderBy>;
}

export interface VariantAttributeOptionsUpdateInput {
  attributeOptionId: InputMaybe<Scalars['Int']['input']>;
  variantId: InputMaybe<Scalars['Int']['input']>;
}

export interface VariantAttributeOptionsWhereInput {
  attributeOptionId: InputMaybe<Scalars['String']['input']>;
  variantId: InputMaybe<Scalars['String']['input']>;
}

/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImages {
  /** Texto alternativo para SEO */
  altText: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  /** Orden de visualización */
  displayOrder: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageType: VariantImagesImageType;
  /** Imagen normal 600x800 */
  imageUrlNormal: Scalars['String']['output'];
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: Scalars['String']['output'];
  /** Imagen principal de la variante */
  isPrimary: Maybe<Scalars['Int']['output']>;
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  updatedAt: Scalars['Timestamp']['output'];
  variantId: Scalars['Int']['output'];
}


/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImagesProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
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
  | 'top';

/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImagesInsertInput {
  /** Texto alternativo para SEO */
  altText: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  /** Orden de visualización */
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageType: InputMaybe<VariantImagesImageType>;
  /** Imagen normal 600x800 */
  imageUrlNormal: Scalars['String']['input'];
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: Scalars['String']['input'];
  /** Imagen principal de la variante */
  isPrimary: InputMaybe<Scalars['Int']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  variantId: Scalars['Int']['input'];
}

/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImagesOrderByInput {
  /** Texto alternativo para SEO */
  altText: InputMaybe<OrderBy>;
  createdAt: InputMaybe<OrderBy>;
  /** Orden de visualización */
  displayOrder: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  imageType: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 */
  imageUrlNormal: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: InputMaybe<OrderBy>;
  /** Imagen principal de la variante */
  isPrimary: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
  variantId: InputMaybe<OrderBy>;
}

/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImagesUpdateInput {
  /** Texto alternativo para SEO */
  altText: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  /** Orden de visualización */
  displayOrder: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  imageType: InputMaybe<VariantImagesImageType>;
  /** Imagen normal 600x800 */
  imageUrlNormal: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  isPrimary: InputMaybe<Scalars['Int']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  variantId: InputMaybe<Scalars['Int']['input']>;
}

/** Imágenes de variantes con múltiples tamaños y tipos */
export interface VariantImagesWhereInput {
  /** Texto alternativo para SEO */
  altText: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['String']['input']>;
  /** Orden de visualización */
  displayOrder: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  imageType: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 */
  imageUrlNormal: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  isPrimary: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
  variantId: InputMaybe<Scalars['String']['input']>;
}

/** VIEW */
export interface VariantRatingSummary {
  averageRating: Maybe<Scalars['Float']['output']>;
  fiveStar: Maybe<Scalars['Float']['output']>;
  fourStar: Maybe<Scalars['Float']['output']>;
  oneStar: Maybe<Scalars['Float']['output']>;
  threeStar: Maybe<Scalars['Float']['output']>;
  totalRatings: Scalars['BigInt']['output'];
  twoStar: Maybe<Scalars['Float']['output']>;
  variantId: Scalars['Int']['output'];
  verifiedPurchases: Maybe<Scalars['Float']['output']>;
}

/** VIEW */
export interface VariantRatingSummaryInsertInput {
  averageRating: InputMaybe<Scalars['Float']['input']>;
  fiveStar: InputMaybe<Scalars['Float']['input']>;
  fourStar: InputMaybe<Scalars['Float']['input']>;
  oneStar: InputMaybe<Scalars['Float']['input']>;
  threeStar: InputMaybe<Scalars['Float']['input']>;
  totalRatings: InputMaybe<Scalars['BigInt']['input']>;
  twoStar: InputMaybe<Scalars['Float']['input']>;
  variantId: Scalars['Int']['input'];
  verifiedPurchases: InputMaybe<Scalars['Float']['input']>;
}

/** VIEW */
export interface VariantRatingSummaryOrderByInput {
  averageRating: InputMaybe<OrderBy>;
  fiveStar: InputMaybe<OrderBy>;
  fourStar: InputMaybe<OrderBy>;
  oneStar: InputMaybe<OrderBy>;
  threeStar: InputMaybe<OrderBy>;
  totalRatings: InputMaybe<OrderBy>;
  twoStar: InputMaybe<OrderBy>;
  variantId: InputMaybe<OrderBy>;
  verifiedPurchases: InputMaybe<OrderBy>;
}

/** VIEW */
export interface VariantRatingSummaryUpdateInput {
  averageRating: InputMaybe<Scalars['Float']['input']>;
  fiveStar: InputMaybe<Scalars['Float']['input']>;
  fourStar: InputMaybe<Scalars['Float']['input']>;
  oneStar: InputMaybe<Scalars['Float']['input']>;
  threeStar: InputMaybe<Scalars['Float']['input']>;
  totalRatings: InputMaybe<Scalars['BigInt']['input']>;
  twoStar: InputMaybe<Scalars['Float']['input']>;
  variantId: InputMaybe<Scalars['Int']['input']>;
  verifiedPurchases: InputMaybe<Scalars['Float']['input']>;
}

/** VIEW */
export interface VariantRatingSummaryWhereInput {
  averageRating: InputMaybe<Scalars['String']['input']>;
  fiveStar: InputMaybe<Scalars['String']['input']>;
  fourStar: InputMaybe<Scalars['String']['input']>;
  oneStar: InputMaybe<Scalars['String']['input']>;
  threeStar: InputMaybe<Scalars['String']['input']>;
  totalRatings: InputMaybe<Scalars['String']['input']>;
  twoStar: InputMaybe<Scalars['String']['input']>;
  variantId: InputMaybe<Scalars['String']['input']>;
  verifiedPurchases: InputMaybe<Scalars['String']['input']>;
}

export interface VariantRatings {
  createdAt: Scalars['Timestamp']['output'];
  customerId: Scalars['Int']['output'];
  customers: Maybe<Array<Maybe<Customers>>>;
  id: Scalars['Int']['output'];
  productVariants: Maybe<Array<Maybe<ProductVariants>>>;
  rating: Scalars['Int']['output'];
  ratingImages: Maybe<Array<Maybe<RatingImages>>>;
  review: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  variantId: Scalars['Int']['output'];
  verifiedPurchase: Scalars['Int']['output'];
}


export interface VariantRatingsCustomersArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<CustomersOrderByInput>;
  where: InputMaybe<CustomersWhereInput>;
}


export interface VariantRatingsProductVariantsArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<ProductVariantsOrderByInput>;
  where: InputMaybe<ProductVariantsWhereInput>;
}


export interface VariantRatingsRatingImagesArgs {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<RatingImagesOrderByInput>;
  where: InputMaybe<RatingImagesWhereInput>;
}

export interface VariantRatingsInsertInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  customerId: Scalars['Int']['input'];
  id: InputMaybe<Scalars['Int']['input']>;
  rating: InputMaybe<Scalars['Int']['input']>;
  review: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  variantId: Scalars['Int']['input'];
  verifiedPurchase: InputMaybe<Scalars['Int']['input']>;
}

export interface VariantRatingsOrderByInput {
  createdAt: InputMaybe<OrderBy>;
  customerId: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  rating: InputMaybe<OrderBy>;
  review: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
  variantId: InputMaybe<OrderBy>;
  verifiedPurchase: InputMaybe<OrderBy>;
}

export interface VariantRatingsUpdateInput {
  createdAt: InputMaybe<Scalars['Timestamp']['input']>;
  customerId: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  rating: InputMaybe<Scalars['Int']['input']>;
  review: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['Timestamp']['input']>;
  variantId: InputMaybe<Scalars['Int']['input']>;
  verifiedPurchase: InputMaybe<Scalars['Int']['input']>;
}

export interface VariantRatingsWhereInput {
  createdAt: InputMaybe<Scalars['String']['input']>;
  customerId: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  rating: InputMaybe<Scalars['String']['input']>;
  review: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['String']['input']>;
  variantId: InputMaybe<Scalars['String']['input']>;
  verifiedPurchase: InputMaybe<Scalars['String']['input']>;
}
