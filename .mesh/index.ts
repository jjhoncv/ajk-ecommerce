// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { defaultImportFn, handleImport } from '@graphql-mesh/utils';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import type { MeshResolvedSource } from '@graphql-mesh/runtime';
import type { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import { parse } from 'graphql';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, type ExecuteMeshFn, type SubscribeMeshFn, type MeshContext as BaseMeshContext, type MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import type { ImportFn } from '@graphql-mesh/types';
import type { DatabaseTypes } from './sources/Database/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  Timestamp: { input: Date | string | number; output: Date | string | number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: Date | string; output: Date | string; }
  DateTime: { input: Date | string; output: Date | string; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: bigint; output: bigint; }
};

export type Query = {
  attributeOptionImages?: Maybe<Array<Maybe<AttributeOptionImages>>>;
  countAttributeOptionImages?: Maybe<Scalars['Int']['output']>;
  attributeOptions?: Maybe<Array<Maybe<AttributeOptions>>>;
  countAttributeOptions?: Maybe<Scalars['Int']['output']>;
  attributes?: Maybe<Array<Maybe<Attributes>>>;
  countAttributes?: Maybe<Scalars['Int']['output']>;
  banner?: Maybe<Array<Maybe<Banner>>>;
  countBanner?: Maybe<Scalars['Int']['output']>;
  brands?: Maybe<Array<Maybe<Brands>>>;
  countBrands?: Maybe<Scalars['Int']['output']>;
  categories?: Maybe<Array<Maybe<Categories>>>;
  countCategories?: Maybe<Scalars['Int']['output']>;
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;
  countCouponUsage?: Maybe<Scalars['Int']['output']>;
  coupons?: Maybe<Array<Maybe<Coupons>>>;
  countCoupons?: Maybe<Scalars['Int']['output']>;
  customers?: Maybe<Array<Maybe<Customers>>>;
  countCustomers?: Maybe<Scalars['Int']['output']>;
  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>;
  countCustomersAddresses?: Maybe<Scalars['Int']['output']>;
  orderItems?: Maybe<Array<Maybe<OrderItems>>>;
  countOrderItems?: Maybe<Scalars['Int']['output']>;
  orderSummary?: Maybe<Array<Maybe<OrderSummary>>>;
  countOrderSummary?: Maybe<Scalars['Int']['output']>;
  orderTracking?: Maybe<Array<Maybe<OrderTracking>>>;
  countOrderTracking?: Maybe<Scalars['Int']['output']>;
  orders?: Maybe<Array<Maybe<Orders>>>;
  countOrders?: Maybe<Scalars['Int']['output']>;
  paymentMethods?: Maybe<Array<Maybe<PaymentMethods>>>;
  countPaymentMethods?: Maybe<Scalars['Int']['output']>;
  paymentTransactions?: Maybe<Array<Maybe<PaymentTransactions>>>;
  countPaymentTransactions?: Maybe<Scalars['Int']['output']>;
  permissions?: Maybe<Array<Maybe<Permissions>>>;
  countPermissions?: Maybe<Scalars['Int']['output']>;
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>;
  countProductCategories?: Maybe<Scalars['Int']['output']>;
  productRatingSummary?: Maybe<Array<Maybe<ProductRatingSummary>>>;
  countProductRatingSummary?: Maybe<Scalars['Int']['output']>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  countProductVariants?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<Maybe<Products>>>;
  countProducts?: Maybe<Scalars['Int']['output']>;
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>;
  countPromotionVariants?: Maybe<Scalars['Int']['output']>;
  promotions?: Maybe<Array<Maybe<Promotions>>>;
  countPromotions?: Maybe<Scalars['Int']['output']>;
  ratingImages?: Maybe<Array<Maybe<RatingImages>>>;
  countRatingImages?: Maybe<Scalars['Int']['output']>;
  roles?: Maybe<Array<Maybe<Roles>>>;
  countRoles?: Maybe<Scalars['Int']['output']>;
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>;
  countRolesSections?: Maybe<Scalars['Int']['output']>;
  sections?: Maybe<Array<Maybe<Sections>>>;
  countSections?: Maybe<Scalars['Int']['output']>;
  services?: Maybe<Array<Maybe<Services>>>;
  countServices?: Maybe<Scalars['Int']['output']>;
  servicesImages?: Maybe<Array<Maybe<ServicesImages>>>;
  countServicesImages?: Maybe<Scalars['Int']['output']>;
  shippingMethods?: Maybe<Array<Maybe<ShippingMethods>>>;
  countShippingMethods?: Maybe<Scalars['Int']['output']>;
  shippingZoneMethods?: Maybe<Array<Maybe<ShippingZoneMethods>>>;
  countShippingZoneMethods?: Maybe<Scalars['Int']['output']>;
  shippingZones?: Maybe<Array<Maybe<ShippingZones>>>;
  countShippingZones?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<Maybe<Users>>>;
  countUsers?: Maybe<Scalars['Int']['output']>;
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>;
  countVariantAttributeOptions?: Maybe<Scalars['Int']['output']>;
  variantImages?: Maybe<Array<Maybe<VariantImages>>>;
  countVariantImages?: Maybe<Scalars['Int']['output']>;
  variantRatingSummary?: Maybe<Array<Maybe<VariantRatingSummary>>>;
  countVariantRatingSummary?: Maybe<Scalars['Int']['output']>;
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
  countVariantRatings?: Maybe<Scalars['Int']['output']>;
};


export type QueryattributeOptionImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AttributeOptionImagesWhereInput>;
  orderBy?: InputMaybe<AttributeOptionImagesOrderByInput>;
};


export type QuerycountAttributeOptionImagesArgs = {
  where?: InputMaybe<AttributeOptionImagesWhereInput>;
};


export type QueryattributeOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AttributeOptionsWhereInput>;
  orderBy?: InputMaybe<AttributeOptionsOrderByInput>;
};


export type QuerycountAttributeOptionsArgs = {
  where?: InputMaybe<AttributeOptionsWhereInput>;
};


export type QueryattributesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AttributesWhereInput>;
  orderBy?: InputMaybe<AttributesOrderByInput>;
};


export type QuerycountAttributesArgs = {
  where?: InputMaybe<AttributesWhereInput>;
};


export type QuerybannerArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BannerWhereInput>;
  orderBy?: InputMaybe<BannerOrderByInput>;
};


export type QuerycountBannerArgs = {
  where?: InputMaybe<BannerWhereInput>;
};


export type QuerybrandsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BrandsWhereInput>;
  orderBy?: InputMaybe<BrandsOrderByInput>;
};


export type QuerycountBrandsArgs = {
  where?: InputMaybe<BrandsWhereInput>;
};


export type QuerycategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CategoriesWhereInput>;
  orderBy?: InputMaybe<CategoriesOrderByInput>;
};


export type QuerycountCategoriesArgs = {
  where?: InputMaybe<CategoriesWhereInput>;
};


export type QuerycouponUsageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponUsageWhereInput>;
  orderBy?: InputMaybe<CouponUsageOrderByInput>;
};


export type QuerycountCouponUsageArgs = {
  where?: InputMaybe<CouponUsageWhereInput>;
};


export type QuerycouponsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponsWhereInput>;
  orderBy?: InputMaybe<CouponsOrderByInput>;
};


export type QuerycountCouponsArgs = {
  where?: InputMaybe<CouponsWhereInput>;
};


export type QuerycustomersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CustomersWhereInput>;
  orderBy?: InputMaybe<CustomersOrderByInput>;
};


export type QuerycountCustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
};


export type QuerycustomersAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CustomersAddressesWhereInput>;
  orderBy?: InputMaybe<CustomersAddressesOrderByInput>;
};


export type QuerycountCustomersAddressesArgs = {
  where?: InputMaybe<CustomersAddressesWhereInput>;
};


export type QueryorderItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderItemsWhereInput>;
  orderBy?: InputMaybe<OrderItemsOrderByInput>;
};


export type QuerycountOrderItemsArgs = {
  where?: InputMaybe<OrderItemsWhereInput>;
};


export type QueryorderSummaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderSummaryWhereInput>;
  orderBy?: InputMaybe<OrderSummaryOrderByInput>;
};


export type QuerycountOrderSummaryArgs = {
  where?: InputMaybe<OrderSummaryWhereInput>;
};


export type QueryorderTrackingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderTrackingWhereInput>;
  orderBy?: InputMaybe<OrderTrackingOrderByInput>;
};


export type QuerycountOrderTrackingArgs = {
  where?: InputMaybe<OrderTrackingWhereInput>;
};


export type QueryordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
};


export type QuerycountOrdersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
};


export type QuerypaymentMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentMethodsWhereInput>;
  orderBy?: InputMaybe<PaymentMethodsOrderByInput>;
};


export type QuerycountPaymentMethodsArgs = {
  where?: InputMaybe<PaymentMethodsWhereInput>;
};


export type QuerypaymentTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentTransactionsWhereInput>;
  orderBy?: InputMaybe<PaymentTransactionsOrderByInput>;
};


export type QuerycountPaymentTransactionsArgs = {
  where?: InputMaybe<PaymentTransactionsWhereInput>;
};


export type QuerypermissionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PermissionsWhereInput>;
  orderBy?: InputMaybe<PermissionsOrderByInput>;
};


export type QuerycountPermissionsArgs = {
  where?: InputMaybe<PermissionsWhereInput>;
};


export type QueryproductCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductCategoriesWhereInput>;
  orderBy?: InputMaybe<ProductCategoriesOrderByInput>;
};


export type QuerycountProductCategoriesArgs = {
  where?: InputMaybe<ProductCategoriesWhereInput>;
};


export type QueryproductRatingSummaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductRatingSummaryWhereInput>;
  orderBy?: InputMaybe<ProductRatingSummaryOrderByInput>;
};


export type QuerycountProductRatingSummaryArgs = {
  where?: InputMaybe<ProductRatingSummaryWhereInput>;
};


export type QueryproductVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
};


export type QuerycountProductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
};


export type QueryproductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductsWhereInput>;
  orderBy?: InputMaybe<ProductsOrderByInput>;
};


export type QuerycountProductsArgs = {
  where?: InputMaybe<ProductsWhereInput>;
};


export type QuerypromotionVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PromotionVariantsWhereInput>;
  orderBy?: InputMaybe<PromotionVariantsOrderByInput>;
};


export type QuerycountPromotionVariantsArgs = {
  where?: InputMaybe<PromotionVariantsWhereInput>;
};


export type QuerypromotionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PromotionsWhereInput>;
  orderBy?: InputMaybe<PromotionsOrderByInput>;
};


export type QuerycountPromotionsArgs = {
  where?: InputMaybe<PromotionsWhereInput>;
};


export type QueryratingImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RatingImagesWhereInput>;
  orderBy?: InputMaybe<RatingImagesOrderByInput>;
};


export type QuerycountRatingImagesArgs = {
  where?: InputMaybe<RatingImagesWhereInput>;
};


export type QueryrolesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RolesWhereInput>;
  orderBy?: InputMaybe<RolesOrderByInput>;
};


export type QuerycountRolesArgs = {
  where?: InputMaybe<RolesWhereInput>;
};


export type QueryrolesSectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RolesSectionsWhereInput>;
  orderBy?: InputMaybe<RolesSectionsOrderByInput>;
};


export type QuerycountRolesSectionsArgs = {
  where?: InputMaybe<RolesSectionsWhereInput>;
};


export type QuerysectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SectionsWhereInput>;
  orderBy?: InputMaybe<SectionsOrderByInput>;
};


export type QuerycountSectionsArgs = {
  where?: InputMaybe<SectionsWhereInput>;
};


export type QueryservicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ServicesWhereInput>;
  orderBy?: InputMaybe<ServicesOrderByInput>;
};


export type QuerycountServicesArgs = {
  where?: InputMaybe<ServicesWhereInput>;
};


export type QueryservicesImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ServicesImagesWhereInput>;
  orderBy?: InputMaybe<ServicesImagesOrderByInput>;
};


export type QuerycountServicesImagesArgs = {
  where?: InputMaybe<ServicesImagesWhereInput>;
};


export type QueryshippingMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ShippingMethodsWhereInput>;
  orderBy?: InputMaybe<ShippingMethodsOrderByInput>;
};


export type QuerycountShippingMethodsArgs = {
  where?: InputMaybe<ShippingMethodsWhereInput>;
};


export type QueryshippingZoneMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
  orderBy?: InputMaybe<ShippingZoneMethodsOrderByInput>;
};


export type QuerycountShippingZoneMethodsArgs = {
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
};


export type QueryshippingZonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ShippingZonesWhereInput>;
  orderBy?: InputMaybe<ShippingZonesOrderByInput>;
};


export type QuerycountShippingZonesArgs = {
  where?: InputMaybe<ShippingZonesWhereInput>;
};


export type QueryusersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsersWhereInput>;
  orderBy?: InputMaybe<UsersOrderByInput>;
};


export type QuerycountUsersArgs = {
  where?: InputMaybe<UsersWhereInput>;
};


export type QueryvariantAttributeOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
  orderBy?: InputMaybe<VariantAttributeOptionsOrderByInput>;
};


export type QuerycountVariantAttributeOptionsArgs = {
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
};


export type QueryvariantImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantImagesWhereInput>;
  orderBy?: InputMaybe<VariantImagesOrderByInput>;
};


export type QuerycountVariantImagesArgs = {
  where?: InputMaybe<VariantImagesWhereInput>;
};


export type QueryvariantRatingSummaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantRatingSummaryWhereInput>;
  orderBy?: InputMaybe<VariantRatingSummaryOrderByInput>;
};


export type QuerycountVariantRatingSummaryArgs = {
  where?: InputMaybe<VariantRatingSummaryWhereInput>;
};


export type QueryvariantRatingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantRatingsWhereInput>;
  orderBy?: InputMaybe<VariantRatingsOrderByInput>;
};


export type QuerycountVariantRatingsArgs = {
  where?: InputMaybe<VariantRatingsWhereInput>;
};

export type Mutation = {
  insertAttributeOptionImages?: Maybe<AttributeOptionImages>;
  updateAttributeOptionImages?: Maybe<AttributeOptionImages>;
  deleteAttributeOptionImages?: Maybe<Scalars['Boolean']['output']>;
  insertAttributeOptions?: Maybe<AttributeOptions>;
  updateAttributeOptions?: Maybe<AttributeOptions>;
  deleteAttributeOptions?: Maybe<Scalars['Boolean']['output']>;
  insertAttributes?: Maybe<Attributes>;
  updateAttributes?: Maybe<Attributes>;
  deleteAttributes?: Maybe<Scalars['Boolean']['output']>;
  insertBanner?: Maybe<Banner>;
  updateBanner?: Maybe<Banner>;
  deleteBanner?: Maybe<Scalars['Boolean']['output']>;
  insertBrands?: Maybe<Brands>;
  updateBrands?: Maybe<Brands>;
  deleteBrands?: Maybe<Scalars['Boolean']['output']>;
  insertCategories?: Maybe<Categories>;
  updateCategories?: Maybe<Categories>;
  deleteCategories?: Maybe<Scalars['Boolean']['output']>;
  insertCouponUsage?: Maybe<CouponUsage>;
  updateCouponUsage?: Maybe<CouponUsage>;
  deleteCouponUsage?: Maybe<Scalars['Boolean']['output']>;
  insertCoupons?: Maybe<Coupons>;
  updateCoupons?: Maybe<Coupons>;
  deleteCoupons?: Maybe<Scalars['Boolean']['output']>;
  insertCustomers?: Maybe<Customers>;
  updateCustomers?: Maybe<Customers>;
  deleteCustomers?: Maybe<Scalars['Boolean']['output']>;
  insertCustomersAddresses?: Maybe<CustomersAddresses>;
  updateCustomersAddresses?: Maybe<CustomersAddresses>;
  deleteCustomersAddresses?: Maybe<Scalars['Boolean']['output']>;
  insertOrderItems?: Maybe<OrderItems>;
  updateOrderItems?: Maybe<OrderItems>;
  deleteOrderItems?: Maybe<Scalars['Boolean']['output']>;
  insertOrderSummary?: Maybe<OrderSummary>;
  updateOrderSummary?: Maybe<OrderSummary>;
  deleteOrderSummary?: Maybe<Scalars['Boolean']['output']>;
  insertOrderTracking?: Maybe<OrderTracking>;
  updateOrderTracking?: Maybe<OrderTracking>;
  deleteOrderTracking?: Maybe<Scalars['Boolean']['output']>;
  insertOrders?: Maybe<Orders>;
  updateOrders?: Maybe<Orders>;
  deleteOrders?: Maybe<Scalars['Boolean']['output']>;
  insertPaymentMethods?: Maybe<PaymentMethods>;
  updatePaymentMethods?: Maybe<PaymentMethods>;
  deletePaymentMethods?: Maybe<Scalars['Boolean']['output']>;
  insertPaymentTransactions?: Maybe<PaymentTransactions>;
  updatePaymentTransactions?: Maybe<PaymentTransactions>;
  deletePaymentTransactions?: Maybe<Scalars['Boolean']['output']>;
  insertPermissions?: Maybe<Permissions>;
  updatePermissions?: Maybe<Permissions>;
  deletePermissions?: Maybe<Scalars['Boolean']['output']>;
  insertProductCategories?: Maybe<ProductCategories>;
  updateProductCategories?: Maybe<ProductCategories>;
  deleteProductCategories?: Maybe<Scalars['Boolean']['output']>;
  insertProductRatingSummary?: Maybe<ProductRatingSummary>;
  updateProductRatingSummary?: Maybe<ProductRatingSummary>;
  deleteProductRatingSummary?: Maybe<Scalars['Boolean']['output']>;
  insertProductVariants?: Maybe<ProductVariants>;
  updateProductVariants?: Maybe<ProductVariants>;
  deleteProductVariants?: Maybe<Scalars['Boolean']['output']>;
  insertProducts?: Maybe<Products>;
  updateProducts?: Maybe<Products>;
  deleteProducts?: Maybe<Scalars['Boolean']['output']>;
  insertPromotionVariants?: Maybe<PromotionVariants>;
  updatePromotionVariants?: Maybe<PromotionVariants>;
  deletePromotionVariants?: Maybe<Scalars['Boolean']['output']>;
  insertPromotions?: Maybe<Promotions>;
  updatePromotions?: Maybe<Promotions>;
  deletePromotions?: Maybe<Scalars['Boolean']['output']>;
  insertRatingImages?: Maybe<RatingImages>;
  updateRatingImages?: Maybe<RatingImages>;
  deleteRatingImages?: Maybe<Scalars['Boolean']['output']>;
  insertRoles?: Maybe<Roles>;
  updateRoles?: Maybe<Roles>;
  deleteRoles?: Maybe<Scalars['Boolean']['output']>;
  insertRolesSections?: Maybe<RolesSections>;
  updateRolesSections?: Maybe<RolesSections>;
  deleteRolesSections?: Maybe<Scalars['Boolean']['output']>;
  insertSections?: Maybe<Sections>;
  updateSections?: Maybe<Sections>;
  deleteSections?: Maybe<Scalars['Boolean']['output']>;
  insertServices?: Maybe<Services>;
  updateServices?: Maybe<Services>;
  deleteServices?: Maybe<Scalars['Boolean']['output']>;
  insertServicesImages?: Maybe<ServicesImages>;
  updateServicesImages?: Maybe<ServicesImages>;
  deleteServicesImages?: Maybe<Scalars['Boolean']['output']>;
  insertShippingMethods?: Maybe<ShippingMethods>;
  updateShippingMethods?: Maybe<ShippingMethods>;
  deleteShippingMethods?: Maybe<Scalars['Boolean']['output']>;
  insertShippingZoneMethods?: Maybe<ShippingZoneMethods>;
  updateShippingZoneMethods?: Maybe<ShippingZoneMethods>;
  deleteShippingZoneMethods?: Maybe<Scalars['Boolean']['output']>;
  insertShippingZones?: Maybe<ShippingZones>;
  updateShippingZones?: Maybe<ShippingZones>;
  deleteShippingZones?: Maybe<Scalars['Boolean']['output']>;
  insertUsers?: Maybe<Users>;
  updateUsers?: Maybe<Users>;
  deleteUsers?: Maybe<Scalars['Boolean']['output']>;
  insertVariantAttributeOptions?: Maybe<VariantAttributeOptions>;
  updateVariantAttributeOptions?: Maybe<VariantAttributeOptions>;
  deleteVariantAttributeOptions?: Maybe<Scalars['Boolean']['output']>;
  insertVariantImages?: Maybe<VariantImages>;
  updateVariantImages?: Maybe<VariantImages>;
  deleteVariantImages?: Maybe<Scalars['Boolean']['output']>;
  insertVariantRatingSummary?: Maybe<VariantRatingSummary>;
  updateVariantRatingSummary?: Maybe<VariantRatingSummary>;
  deleteVariantRatingSummary?: Maybe<Scalars['Boolean']['output']>;
  insertVariantRatings?: Maybe<VariantRatings>;
  updateVariantRatings?: Maybe<VariantRatings>;
  deleteVariantRatings?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationinsertAttributeOptionImagesArgs = {
  attribute_option_images: AttributeOptionImagesInsertInput;
};


export type MutationupdateAttributeOptionImagesArgs = {
  attribute_option_images: AttributeOptionImagesUpdateInput;
  where?: InputMaybe<AttributeOptionImagesWhereInput>;
};


export type MutationdeleteAttributeOptionImagesArgs = {
  where?: InputMaybe<AttributeOptionImagesWhereInput>;
};


export type MutationinsertAttributeOptionsArgs = {
  attribute_options: AttributeOptionsInsertInput;
};


export type MutationupdateAttributeOptionsArgs = {
  attribute_options: AttributeOptionsUpdateInput;
  where?: InputMaybe<AttributeOptionsWhereInput>;
};


export type MutationdeleteAttributeOptionsArgs = {
  where?: InputMaybe<AttributeOptionsWhereInput>;
};


export type MutationinsertAttributesArgs = {
  attributes: AttributesInsertInput;
};


export type MutationupdateAttributesArgs = {
  attributes: AttributesUpdateInput;
  where?: InputMaybe<AttributesWhereInput>;
};


export type MutationdeleteAttributesArgs = {
  where?: InputMaybe<AttributesWhereInput>;
};


export type MutationinsertBannerArgs = {
  banner: BannerInsertInput;
};


export type MutationupdateBannerArgs = {
  banner: BannerUpdateInput;
  where?: InputMaybe<BannerWhereInput>;
};


export type MutationdeleteBannerArgs = {
  where?: InputMaybe<BannerWhereInput>;
};


export type MutationinsertBrandsArgs = {
  brands: BrandsInsertInput;
};


export type MutationupdateBrandsArgs = {
  brands: BrandsUpdateInput;
  where?: InputMaybe<BrandsWhereInput>;
};


export type MutationdeleteBrandsArgs = {
  where?: InputMaybe<BrandsWhereInput>;
};


export type MutationinsertCategoriesArgs = {
  categories: CategoriesInsertInput;
};


export type MutationupdateCategoriesArgs = {
  categories: CategoriesUpdateInput;
  where?: InputMaybe<CategoriesWhereInput>;
};


export type MutationdeleteCategoriesArgs = {
  where?: InputMaybe<CategoriesWhereInput>;
};


export type MutationinsertCouponUsageArgs = {
  coupon_usage: CouponUsageInsertInput;
};


export type MutationupdateCouponUsageArgs = {
  coupon_usage: CouponUsageUpdateInput;
  where?: InputMaybe<CouponUsageWhereInput>;
};


export type MutationdeleteCouponUsageArgs = {
  where?: InputMaybe<CouponUsageWhereInput>;
};


export type MutationinsertCouponsArgs = {
  coupons: CouponsInsertInput;
};


export type MutationupdateCouponsArgs = {
  coupons: CouponsUpdateInput;
  where?: InputMaybe<CouponsWhereInput>;
};


export type MutationdeleteCouponsArgs = {
  where?: InputMaybe<CouponsWhereInput>;
};


export type MutationinsertCustomersArgs = {
  customers: CustomersInsertInput;
};


export type MutationupdateCustomersArgs = {
  customers: CustomersUpdateInput;
  where?: InputMaybe<CustomersWhereInput>;
};


export type MutationdeleteCustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
};


export type MutationinsertCustomersAddressesArgs = {
  customers_addresses: CustomersAddressesInsertInput;
};


export type MutationupdateCustomersAddressesArgs = {
  customers_addresses: CustomersAddressesUpdateInput;
  where?: InputMaybe<CustomersAddressesWhereInput>;
};


export type MutationdeleteCustomersAddressesArgs = {
  where?: InputMaybe<CustomersAddressesWhereInput>;
};


export type MutationinsertOrderItemsArgs = {
  order_items: OrderItemsInsertInput;
};


export type MutationupdateOrderItemsArgs = {
  order_items: OrderItemsUpdateInput;
  where?: InputMaybe<OrderItemsWhereInput>;
};


export type MutationdeleteOrderItemsArgs = {
  where?: InputMaybe<OrderItemsWhereInput>;
};


export type MutationinsertOrderSummaryArgs = {
  order_summary: OrderSummaryInsertInput;
};


export type MutationupdateOrderSummaryArgs = {
  order_summary: OrderSummaryUpdateInput;
  where?: InputMaybe<OrderSummaryWhereInput>;
};


export type MutationdeleteOrderSummaryArgs = {
  where?: InputMaybe<OrderSummaryWhereInput>;
};


export type MutationinsertOrderTrackingArgs = {
  order_tracking: OrderTrackingInsertInput;
};


export type MutationupdateOrderTrackingArgs = {
  order_tracking: OrderTrackingUpdateInput;
  where?: InputMaybe<OrderTrackingWhereInput>;
};


export type MutationdeleteOrderTrackingArgs = {
  where?: InputMaybe<OrderTrackingWhereInput>;
};


export type MutationinsertOrdersArgs = {
  orders: OrdersInsertInput;
};


export type MutationupdateOrdersArgs = {
  orders: OrdersUpdateInput;
  where?: InputMaybe<OrdersWhereInput>;
};


export type MutationdeleteOrdersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
};


export type MutationinsertPaymentMethodsArgs = {
  payment_methods: PaymentMethodsInsertInput;
};


export type MutationupdatePaymentMethodsArgs = {
  payment_methods: PaymentMethodsUpdateInput;
  where?: InputMaybe<PaymentMethodsWhereInput>;
};


export type MutationdeletePaymentMethodsArgs = {
  where?: InputMaybe<PaymentMethodsWhereInput>;
};


export type MutationinsertPaymentTransactionsArgs = {
  payment_transactions: PaymentTransactionsInsertInput;
};


export type MutationupdatePaymentTransactionsArgs = {
  payment_transactions: PaymentTransactionsUpdateInput;
  where?: InputMaybe<PaymentTransactionsWhereInput>;
};


export type MutationdeletePaymentTransactionsArgs = {
  where?: InputMaybe<PaymentTransactionsWhereInput>;
};


export type MutationinsertPermissionsArgs = {
  permissions: PermissionsInsertInput;
};


export type MutationupdatePermissionsArgs = {
  permissions: PermissionsUpdateInput;
  where?: InputMaybe<PermissionsWhereInput>;
};


export type MutationdeletePermissionsArgs = {
  where?: InputMaybe<PermissionsWhereInput>;
};


export type MutationinsertProductCategoriesArgs = {
  product_categories: ProductCategoriesInsertInput;
};


export type MutationupdateProductCategoriesArgs = {
  product_categories: ProductCategoriesUpdateInput;
  where?: InputMaybe<ProductCategoriesWhereInput>;
};


export type MutationdeleteProductCategoriesArgs = {
  where?: InputMaybe<ProductCategoriesWhereInput>;
};


export type MutationinsertProductRatingSummaryArgs = {
  product_rating_summary: ProductRatingSummaryInsertInput;
};


export type MutationupdateProductRatingSummaryArgs = {
  product_rating_summary: ProductRatingSummaryUpdateInput;
  where?: InputMaybe<ProductRatingSummaryWhereInput>;
};


export type MutationdeleteProductRatingSummaryArgs = {
  where?: InputMaybe<ProductRatingSummaryWhereInput>;
};


export type MutationinsertProductVariantsArgs = {
  product_variants: ProductVariantsInsertInput;
};


export type MutationupdateProductVariantsArgs = {
  product_variants: ProductVariantsUpdateInput;
  where?: InputMaybe<ProductVariantsWhereInput>;
};


export type MutationdeleteProductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
};


export type MutationinsertProductsArgs = {
  products: ProductsInsertInput;
};


export type MutationupdateProductsArgs = {
  products: ProductsUpdateInput;
  where?: InputMaybe<ProductsWhereInput>;
};


export type MutationdeleteProductsArgs = {
  where?: InputMaybe<ProductsWhereInput>;
};


export type MutationinsertPromotionVariantsArgs = {
  promotion_variants: PromotionVariantsInsertInput;
};


export type MutationupdatePromotionVariantsArgs = {
  promotion_variants: PromotionVariantsUpdateInput;
  where?: InputMaybe<PromotionVariantsWhereInput>;
};


export type MutationdeletePromotionVariantsArgs = {
  where?: InputMaybe<PromotionVariantsWhereInput>;
};


export type MutationinsertPromotionsArgs = {
  promotions: PromotionsInsertInput;
};


export type MutationupdatePromotionsArgs = {
  promotions: PromotionsUpdateInput;
  where?: InputMaybe<PromotionsWhereInput>;
};


export type MutationdeletePromotionsArgs = {
  where?: InputMaybe<PromotionsWhereInput>;
};


export type MutationinsertRatingImagesArgs = {
  rating_images: RatingImagesInsertInput;
};


export type MutationupdateRatingImagesArgs = {
  rating_images: RatingImagesUpdateInput;
  where?: InputMaybe<RatingImagesWhereInput>;
};


export type MutationdeleteRatingImagesArgs = {
  where?: InputMaybe<RatingImagesWhereInput>;
};


export type MutationinsertRolesArgs = {
  roles: RolesInsertInput;
};


export type MutationupdateRolesArgs = {
  roles: RolesUpdateInput;
  where?: InputMaybe<RolesWhereInput>;
};


export type MutationdeleteRolesArgs = {
  where?: InputMaybe<RolesWhereInput>;
};


export type MutationinsertRolesSectionsArgs = {
  roles_sections: RolesSectionsInsertInput;
};


export type MutationupdateRolesSectionsArgs = {
  roles_sections: RolesSectionsUpdateInput;
  where?: InputMaybe<RolesSectionsWhereInput>;
};


export type MutationdeleteRolesSectionsArgs = {
  where?: InputMaybe<RolesSectionsWhereInput>;
};


export type MutationinsertSectionsArgs = {
  sections: SectionsInsertInput;
};


export type MutationupdateSectionsArgs = {
  sections: SectionsUpdateInput;
  where?: InputMaybe<SectionsWhereInput>;
};


export type MutationdeleteSectionsArgs = {
  where?: InputMaybe<SectionsWhereInput>;
};


export type MutationinsertServicesArgs = {
  services: ServicesInsertInput;
};


export type MutationupdateServicesArgs = {
  services: ServicesUpdateInput;
  where?: InputMaybe<ServicesWhereInput>;
};


export type MutationdeleteServicesArgs = {
  where?: InputMaybe<ServicesWhereInput>;
};


export type MutationinsertServicesImagesArgs = {
  services_images: ServicesImagesInsertInput;
};


export type MutationupdateServicesImagesArgs = {
  services_images: ServicesImagesUpdateInput;
  where?: InputMaybe<ServicesImagesWhereInput>;
};


export type MutationdeleteServicesImagesArgs = {
  where?: InputMaybe<ServicesImagesWhereInput>;
};


export type MutationinsertShippingMethodsArgs = {
  shipping_methods: ShippingMethodsInsertInput;
};


export type MutationupdateShippingMethodsArgs = {
  shipping_methods: ShippingMethodsUpdateInput;
  where?: InputMaybe<ShippingMethodsWhereInput>;
};


export type MutationdeleteShippingMethodsArgs = {
  where?: InputMaybe<ShippingMethodsWhereInput>;
};


export type MutationinsertShippingZoneMethodsArgs = {
  shipping_zone_methods: ShippingZoneMethodsInsertInput;
};


export type MutationupdateShippingZoneMethodsArgs = {
  shipping_zone_methods: ShippingZoneMethodsUpdateInput;
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
};


export type MutationdeleteShippingZoneMethodsArgs = {
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
};


export type MutationinsertShippingZonesArgs = {
  shipping_zones: ShippingZonesInsertInput;
};


export type MutationupdateShippingZonesArgs = {
  shipping_zones: ShippingZonesUpdateInput;
  where?: InputMaybe<ShippingZonesWhereInput>;
};


export type MutationdeleteShippingZonesArgs = {
  where?: InputMaybe<ShippingZonesWhereInput>;
};


export type MutationinsertUsersArgs = {
  users: UsersInsertInput;
};


export type MutationupdateUsersArgs = {
  users: UsersUpdateInput;
  where?: InputMaybe<UsersWhereInput>;
};


export type MutationdeleteUsersArgs = {
  where?: InputMaybe<UsersWhereInput>;
};


export type MutationinsertVariantAttributeOptionsArgs = {
  variant_attribute_options: VariantAttributeOptionsInsertInput;
};


export type MutationupdateVariantAttributeOptionsArgs = {
  variant_attribute_options: VariantAttributeOptionsUpdateInput;
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
};


export type MutationdeleteVariantAttributeOptionsArgs = {
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
};


export type MutationinsertVariantImagesArgs = {
  variant_images: VariantImagesInsertInput;
};


export type MutationupdateVariantImagesArgs = {
  variant_images: VariantImagesUpdateInput;
  where?: InputMaybe<VariantImagesWhereInput>;
};


export type MutationdeleteVariantImagesArgs = {
  where?: InputMaybe<VariantImagesWhereInput>;
};


export type MutationinsertVariantRatingSummaryArgs = {
  variant_rating_summary: VariantRatingSummaryInsertInput;
};


export type MutationupdateVariantRatingSummaryArgs = {
  variant_rating_summary: VariantRatingSummaryUpdateInput;
  where?: InputMaybe<VariantRatingSummaryWhereInput>;
};


export type MutationdeleteVariantRatingSummaryArgs = {
  where?: InputMaybe<VariantRatingSummaryWhereInput>;
};


export type MutationinsertVariantRatingsArgs = {
  variant_ratings: VariantRatingsInsertInput;
};


export type MutationupdateVariantRatingsArgs = {
  variant_ratings: VariantRatingsUpdateInput;
  where?: InputMaybe<VariantRatingsWhereInput>;
};


export type MutationdeleteVariantRatingsArgs = {
  where?: InputMaybe<VariantRatingsWhereInput>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImages = {
  id: Scalars['Int']['output'];
  attributeOptionId: Scalars['Int']['output'];
  imageType: AttributeOptionImagesImageType;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: Scalars['String']['output'];
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: Scalars['String']['output'];
  /** Texto alternativo */
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  isPrimary?: Maybe<Scalars['Int']['output']>;
  attributeOptions?: Maybe<Array<Maybe<AttributeOptions>>>;
};


/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImagesattributeOptionsArgs = {
  where?: InputMaybe<AttributeOptionsWhereInput>;
  orderBy?: InputMaybe<AttributeOptionsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AttributeOptionImagesImageType =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'detail'
  | 'lifestyle'
  | 'packaging';

export type AttributeOptions = {
  id: Scalars['Int']['output'];
  attributeId: Scalars['Int']['output'];
  value: Scalars['String']['output'];
  additionalCost?: Maybe<Scalars['Float']['output']>;
  attributeOptionImages?: Maybe<Array<Maybe<AttributeOptionImages>>>;
  attributes?: Maybe<Array<Maybe<Attributes>>>;
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>;
};


export type AttributeOptionsattributeOptionImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AttributeOptionImagesWhereInput>;
  orderBy?: InputMaybe<AttributeOptionImagesOrderByInput>;
};


export type AttributeOptionsattributesArgs = {
  where?: InputMaybe<AttributesWhereInput>;
  orderBy?: InputMaybe<AttributesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type AttributeOptionsvariantAttributeOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
  orderBy?: InputMaybe<VariantAttributeOptionsOrderByInput>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImagesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  attributeOptionId?: InputMaybe<Scalars['String']['input']>;
  imageType?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['String']['input']>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImagesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  attributeOptionId?: InputMaybe<OrderBy>;
  imageType?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb?: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal?: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom?: InputMaybe<OrderBy>;
  /** Texto alternativo */
  altText?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  isPrimary?: InputMaybe<OrderBy>;
};

export type OrderBy =
  | 'asc'
  | 'desc';

export type Attributes = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  displayType: AttributesDisplayType;
  attributeOptions?: Maybe<Array<Maybe<AttributeOptions>>>;
};


export type AttributesattributeOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AttributeOptionsWhereInput>;
  orderBy?: InputMaybe<AttributeOptionsOrderByInput>;
};

export type AttributesDisplayType =
  | 'radio'
  | 'pills'
  | 'select'
  | 'color'
  | 'custom';

export type AttributeOptionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  attributeId?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  additionalCost?: InputMaybe<Scalars['String']['input']>;
};

export type AttributeOptionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  attributeId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
  additionalCost?: InputMaybe<OrderBy>;
};

export type AttributesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  displayType?: InputMaybe<Scalars['String']['input']>;
};

export type AttributesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  displayType?: InputMaybe<OrderBy>;
};

export type VariantAttributeOptions = {
  variantId: Scalars['Int']['output'];
  attributeOptionId: Scalars['Int']['output'];
  attributeOptions?: Maybe<Array<Maybe<AttributeOptions>>>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
};


export type VariantAttributeOptionsattributeOptionsArgs = {
  where?: InputMaybe<AttributeOptionsWhereInput>;
  orderBy?: InputMaybe<AttributeOptionsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type VariantAttributeOptionsproductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductVariants = {
  id: Scalars['Int']['output'];
  productId: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stock: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  orderItems?: Maybe<Array<Maybe<OrderItems>>>;
  products?: Maybe<Array<Maybe<Products>>>;
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>;
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>;
  variantImages?: Maybe<Array<Maybe<VariantImages>>>;
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
};


export type ProductVariantsorderItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderItemsWhereInput>;
  orderBy?: InputMaybe<OrderItemsOrderByInput>;
};


export type ProductVariantsproductsArgs = {
  where?: InputMaybe<ProductsWhereInput>;
  orderBy?: InputMaybe<ProductsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ProductVariantspromotionVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PromotionVariantsWhereInput>;
  orderBy?: InputMaybe<PromotionVariantsOrderByInput>;
};


export type ProductVariantsvariantAttributeOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantAttributeOptionsWhereInput>;
  orderBy?: InputMaybe<VariantAttributeOptionsOrderByInput>;
};


export type ProductVariantsvariantImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantImagesWhereInput>;
  orderBy?: InputMaybe<VariantImagesOrderByInput>;
};


export type ProductVariantsvariantRatingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantRatingsWhereInput>;
  orderBy?: InputMaybe<VariantRatingsOrderByInput>;
};

/** Items/productos de cada orden */
export type OrderItems = {
  id: Scalars['Int']['output'];
  orderId: Scalars['Int']['output'];
  /** Variante del producto comprada */
  variantId: Scalars['Int']['output'];
  /** Nombre del producto al momento de compra */
  productName: Scalars['String']['output'];
  /** SKU de la variante */
  variantSku: Scalars['String']['output'];
  /** Atributos de la variante (color, talla, etc.) */
  variantAttributes?: Maybe<Scalars['JSON']['output']>;
  quantity: Scalars['Int']['output'];
  /** Precio unitario al momento de compra */
  unitPrice: Scalars['Float']['output'];
  /** Precio total (quantity * unit_price) */
  totalPrice: Scalars['Float']['output'];
  /** Descuento aplicado a este item */
  discountAmount?: Maybe<Scalars['Float']['output']>;
  orders?: Maybe<Array<Maybe<Orders>>>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
};


/** Items/productos de cada orden */
export type OrderItemsordersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Items/productos de cada orden */
export type OrderItemsproductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Órdenes principales del ecommerce */
export type Orders = {
  id: Scalars['Int']['output'];
  customerId: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  orderNumber: Scalars['String']['output'];
  status: OrdersStatus;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  /** Subtotal antes de descuentos */
  subtotal: Scalars['Float']['output'];
  /** Descuento aplicado */
  discountAmount?: Maybe<Scalars['Float']['output']>;
  /** Costo de envío */
  shippingCost?: Maybe<Scalars['Float']['output']>;
  /** Impuestos (IGV) */
  taxAmount?: Maybe<Scalars['Float']['output']>;
  /** Total final a pagar */
  totalAmount: Scalars['Float']['output'];
  /** Dirección de envío */
  shippingAddressId: Scalars['Int']['output'];
  /** Método de envío */
  shippingMethod?: Maybe<Scalars['String']['output']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: Maybe<Scalars['Date']['output']>;
  /** Método de pago usado */
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus: OrdersPaymentStatus;
  /** Fecha de pago confirmado */
  paidAt?: Maybe<Scalars['Timestamp']['output']>;
  /** Notas del cliente */
  customerNotes?: Maybe<Scalars['String']['output']>;
  /** Notas internas del admin */
  adminNotes?: Maybe<Scalars['String']['output']>;
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;
  orderItems?: Maybe<Array<Maybe<OrderItems>>>;
  orderTracking?: Maybe<Array<Maybe<OrderTracking>>>;
  customers?: Maybe<Array<Maybe<Customers>>>;
  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>;
  paymentTransactions?: Maybe<Array<Maybe<PaymentTransactions>>>;
};


/** Órdenes principales del ecommerce */
export type OrderscouponUsageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponUsageWhereInput>;
  orderBy?: InputMaybe<CouponUsageOrderByInput>;
};


/** Órdenes principales del ecommerce */
export type OrdersorderItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderItemsWhereInput>;
  orderBy?: InputMaybe<OrderItemsOrderByInput>;
};


/** Órdenes principales del ecommerce */
export type OrdersorderTrackingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderTrackingWhereInput>;
  orderBy?: InputMaybe<OrderTrackingOrderByInput>;
};


/** Órdenes principales del ecommerce */
export type OrderscustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
  orderBy?: InputMaybe<CustomersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Órdenes principales del ecommerce */
export type OrderscustomersAddressesArgs = {
  where?: InputMaybe<CustomersAddressesWhereInput>;
  orderBy?: InputMaybe<CustomersAddressesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Órdenes principales del ecommerce */
export type OrderspaymentTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentTransactionsWhereInput>;
  orderBy?: InputMaybe<PaymentTransactionsOrderByInput>;
};

export type OrdersStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrdersPaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type CouponUsage = {
  id: Scalars['Int']['output'];
  couponId: Scalars['Int']['output'];
  customerId: Scalars['Int']['output'];
  orderId: Scalars['Int']['output'];
  discountAmount: Scalars['Float']['output'];
  usedAt: Scalars['Timestamp']['output'];
  coupons?: Maybe<Array<Maybe<Coupons>>>;
  customers?: Maybe<Array<Maybe<Customers>>>;
  orders?: Maybe<Array<Maybe<Orders>>>;
};


export type CouponUsagecouponsArgs = {
  where?: InputMaybe<CouponsWhereInput>;
  orderBy?: InputMaybe<CouponsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CouponUsagecustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
  orderBy?: InputMaybe<CustomersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CouponUsageordersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Coupons = {
  id: Scalars['Int']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discountType: CouponsDiscountType;
  discountValue: Scalars['Float']['output'];
  minPurchaseAmount?: Maybe<Scalars['Float']['output']>;
  maxDiscountAmount?: Maybe<Scalars['Float']['output']>;
  usageLimit?: Maybe<Scalars['Int']['output']>;
  usageLimitPerCustomer?: Maybe<Scalars['Int']['output']>;
  usedCount?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  applicableTo?: Maybe<CouponsApplicableTo>;
  applicableIds?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;
};


export type CouponscouponUsageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponUsageWhereInput>;
  orderBy?: InputMaybe<CouponUsageOrderByInput>;
};

export type CouponsDiscountType =
  | 'fixed_amount'
  | 'percentage';

export type CouponsApplicableTo =
  | 'all'
  | 'categories'
  | 'products';

export type CouponUsageWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  couponId?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['String']['input']>;
  usedAt?: InputMaybe<Scalars['String']['input']>;
};

export type CouponUsageOrderByInput = {
  id?: InputMaybe<OrderBy>;
  couponId?: InputMaybe<OrderBy>;
  customerId?: InputMaybe<OrderBy>;
  orderId?: InputMaybe<OrderBy>;
  discountAmount?: InputMaybe<OrderBy>;
  usedAt?: InputMaybe<OrderBy>;
};

export type CouponsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discountType?: InputMaybe<Scalars['String']['input']>;
  discountValue?: InputMaybe<Scalars['String']['input']>;
  minPurchaseAmount?: InputMaybe<Scalars['String']['input']>;
  maxDiscountAmount?: InputMaybe<Scalars['String']['input']>;
  usageLimit?: InputMaybe<Scalars['String']['input']>;
  usageLimitPerCustomer?: InputMaybe<Scalars['String']['input']>;
  usedCount?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  applicableTo?: InputMaybe<Scalars['String']['input']>;
  applicableIds?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type CouponsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  code?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  discountType?: InputMaybe<OrderBy>;
  discountValue?: InputMaybe<OrderBy>;
  minPurchaseAmount?: InputMaybe<OrderBy>;
  maxDiscountAmount?: InputMaybe<OrderBy>;
  usageLimit?: InputMaybe<OrderBy>;
  usageLimitPerCustomer?: InputMaybe<OrderBy>;
  usedCount?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  applicableTo?: InputMaybe<OrderBy>;
  applicableIds?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type Customers = {
  id: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  addressId?: Maybe<Scalars['Int']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** numero de celular */
  phone?: Maybe<Scalars['String']['output']>;
  /** Documento de identidad  */
  dni?: Maybe<Scalars['String']['output']>;
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;
  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>;
  orders?: Maybe<Array<Maybe<Orders>>>;
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
};


export type CustomerscouponUsageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponUsageWhereInput>;
  orderBy?: InputMaybe<CouponUsageOrderByInput>;
};


export type CustomerscustomersAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CustomersAddressesWhereInput>;
  orderBy?: InputMaybe<CustomersAddressesOrderByInput>;
};


export type CustomersordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
};


export type CustomersvariantRatingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VariantRatingsWhereInput>;
  orderBy?: InputMaybe<VariantRatingsOrderByInput>;
};

export type CustomersAddresses = {
  id: Scalars['Int']['output'];
  idCustomer: Scalars['Int']['output'];
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias: Scalars['String']['output'];
  department: Scalars['String']['output'];
  province: Scalars['String']['output'];
  district: Scalars['String']['output'];
  /** Nombre de la avenida/calle/jirón */
  streetName: Scalars['String']['output'];
  /** Número de la dirección */
  streetNumber: Scalars['String']['output'];
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: Maybe<Scalars['String']['output']>;
  /** Latitud GPS */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Longitud GPS */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** 1 = dirección por defecto */
  isDefault?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  customers?: Maybe<Array<Maybe<Customers>>>;
  orders?: Maybe<Array<Maybe<Orders>>>;
};


export type CustomersAddressescustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
  orderBy?: InputMaybe<CustomersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomersAddressesordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
};

export type CustomersWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  addressId?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type CustomersOrderByInput = {
  id?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  password?: InputMaybe<OrderBy>;
  addressId?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  lastname?: InputMaybe<OrderBy>;
  photo?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** numero de celular */
  phone?: InputMaybe<OrderBy>;
  /** Documento de identidad  */
  dni?: InputMaybe<OrderBy>;
};

/** Órdenes principales del ecommerce */
export type OrdersWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<Scalars['String']['input']>;
  /** Descuento aplicado */
  discountAmount?: InputMaybe<Scalars['String']['input']>;
  /** Costo de envío */
  shippingCost?: InputMaybe<Scalars['String']['input']>;
  /** Impuestos (IGV) */
  taxAmount?: InputMaybe<Scalars['String']['input']>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<Scalars['String']['input']>;
  /** Dirección de envío */
  shippingAddressId?: InputMaybe<Scalars['String']['input']>;
  /** Método de envío */
  shippingMethod?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['String']['input']>;
  /** Método de pago usado */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  paymentStatus?: InputMaybe<Scalars['String']['input']>;
  /** Fecha de pago confirmado */
  paidAt?: InputMaybe<Scalars['String']['input']>;
  /** Notas del cliente */
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  adminNotes?: InputMaybe<Scalars['String']['input']>;
};

/** Órdenes principales del ecommerce */
export type OrdersOrderByInput = {
  id?: InputMaybe<OrderBy>;
  customerId?: InputMaybe<OrderBy>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<OrderBy>;
  /** Descuento aplicado */
  discountAmount?: InputMaybe<OrderBy>;
  /** Costo de envío */
  shippingCost?: InputMaybe<OrderBy>;
  /** Impuestos (IGV) */
  taxAmount?: InputMaybe<OrderBy>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<OrderBy>;
  /** Dirección de envío */
  shippingAddressId?: InputMaybe<OrderBy>;
  /** Método de envío */
  shippingMethod?: InputMaybe<OrderBy>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<OrderBy>;
  /** Método de pago usado */
  paymentMethod?: InputMaybe<OrderBy>;
  paymentStatus?: InputMaybe<OrderBy>;
  /** Fecha de pago confirmado */
  paidAt?: InputMaybe<OrderBy>;
  /** Notas del cliente */
  customerNotes?: InputMaybe<OrderBy>;
  /** Notas internas del admin */
  adminNotes?: InputMaybe<OrderBy>;
};

export type CustomersAddressesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  idCustomer?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la avenida/calle/jirón */
  streetName?: InputMaybe<Scalars['String']['input']>;
  /** Número de la dirección */
  streetNumber?: InputMaybe<Scalars['String']['input']>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['String']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['String']['input']>;
  /** 1 = dirección por defecto */
  isDefault?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type CustomersAddressesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  idCustomer?: InputMaybe<OrderBy>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<OrderBy>;
  department?: InputMaybe<OrderBy>;
  province?: InputMaybe<OrderBy>;
  district?: InputMaybe<OrderBy>;
  /** Nombre de la avenida/calle/jirón */
  streetName?: InputMaybe<OrderBy>;
  /** Número de la dirección */
  streetNumber?: InputMaybe<OrderBy>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<OrderBy>;
  /** Latitud GPS */
  latitude?: InputMaybe<OrderBy>;
  /** Longitud GPS */
  longitude?: InputMaybe<OrderBy>;
  /** 1 = dirección por defecto */
  isDefault?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type VariantRatings = {
  id: Scalars['Int']['output'];
  variantId: Scalars['Int']['output'];
  customerId: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  review?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  verifiedPurchase: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  ratingImages?: Maybe<Array<Maybe<RatingImages>>>;
  customers?: Maybe<Array<Maybe<Customers>>>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
};


export type VariantRatingsratingImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RatingImagesWhereInput>;
  orderBy?: InputMaybe<RatingImagesOrderByInput>;
};


export type VariantRatingscustomersArgs = {
  where?: InputMaybe<CustomersWhereInput>;
  orderBy?: InputMaybe<CustomersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type VariantRatingsproductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RatingImages = {
  id: Scalars['Int']['output'];
  ratingId: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
};


export type RatingImagesvariantRatingsArgs = {
  where?: InputMaybe<VariantRatingsWhereInput>;
  orderBy?: InputMaybe<VariantRatingsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type VariantRatingsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  variantId?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['String']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verifiedPurchase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type VariantRatingsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  variantId?: InputMaybe<OrderBy>;
  customerId?: InputMaybe<OrderBy>;
  rating?: InputMaybe<OrderBy>;
  review?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  verifiedPurchase?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type RatingImagesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  ratingId?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
};

export type RatingImagesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  ratingId?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
};

export type ProductVariantsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ProductVariantsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  productId?: InputMaybe<OrderBy>;
  sku?: InputMaybe<OrderBy>;
  price?: InputMaybe<OrderBy>;
  stock?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** Items/productos de cada orden */
export type OrderItemsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  /** Variante del producto comprada */
  variantId?: InputMaybe<Scalars['String']['input']>;
  /** Nombre del producto al momento de compra */
  productName?: InputMaybe<Scalars['String']['input']>;
  /** SKU de la variante */
  variantSku?: InputMaybe<Scalars['String']['input']>;
  /** Atributos de la variante (color, talla, etc.) */
  variantAttributes?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  /** Precio unitario al momento de compra */
  unitPrice?: InputMaybe<Scalars['String']['input']>;
  /** Precio total (quantity * unit_price) */
  totalPrice?: InputMaybe<Scalars['String']['input']>;
  /** Descuento aplicado a este item */
  discountAmount?: InputMaybe<Scalars['String']['input']>;
};

/** Items/productos de cada orden */
export type OrderItemsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  orderId?: InputMaybe<OrderBy>;
  /** Variante del producto comprada */
  variantId?: InputMaybe<OrderBy>;
  /** Nombre del producto al momento de compra */
  productName?: InputMaybe<OrderBy>;
  /** SKU de la variante */
  variantSku?: InputMaybe<OrderBy>;
  /** Atributos de la variante (color, talla, etc.) */
  variantAttributes?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  /** Precio unitario al momento de compra */
  unitPrice?: InputMaybe<OrderBy>;
  /** Precio total (quantity * unit_price) */
  totalPrice?: InputMaybe<OrderBy>;
  /** Descuento aplicado a este item */
  discountAmount?: InputMaybe<OrderBy>;
};

/** Seguimiento de envíos */
export type OrderTracking = {
  id: Scalars['Int']['output'];
  orderId: Scalars['Int']['output'];
  /** Número de seguimiento del courier */
  trackingNumber?: Maybe<Scalars['String']['output']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: Maybe<Scalars['String']['output']>;
  status: OrderTrackingStatus;
  /** Ubicación actual del paquete */
  currentLocation?: Maybe<Scalars['String']['output']>;
  shippedAt?: Maybe<Scalars['Timestamp']['output']>;
  deliveredAt?: Maybe<Scalars['Timestamp']['output']>;
  /** Nombre de quien recibió */
  deliveredTo?: Maybe<Scalars['String']['output']>;
  /** Notas de entrega */
  deliveryNotes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  orders?: Maybe<Array<Maybe<Orders>>>;
};


/** Seguimiento de envíos */
export type OrderTrackingordersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderTrackingStatus =
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery';

/** Seguimiento de envíos */
export type OrderTrackingWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  /** Ubicación actual del paquete */
  currentLocation?: InputMaybe<Scalars['String']['input']>;
  shippedAt?: InputMaybe<Scalars['String']['input']>;
  deliveredAt?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de quien recibió */
  deliveredTo?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  deliveryNotes?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

/** Seguimiento de envíos */
export type OrderTrackingOrderByInput = {
  id?: InputMaybe<OrderBy>;
  orderId?: InputMaybe<OrderBy>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<OrderBy>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  /** Ubicación actual del paquete */
  currentLocation?: InputMaybe<OrderBy>;
  shippedAt?: InputMaybe<OrderBy>;
  deliveredAt?: InputMaybe<OrderBy>;
  /** Nombre de quien recibió */
  deliveredTo?: InputMaybe<OrderBy>;
  /** Notas de entrega */
  deliveryNotes?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type PaymentTransactions = {
  id: Scalars['Int']['output'];
  orderId: Scalars['Int']['output'];
  paymentMethodId: Scalars['Int']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  processingFee?: Maybe<Scalars['Float']['output']>;
  netAmount: Scalars['Float']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  status?: Maybe<PaymentTransactionsStatus>;
  paymentData?: Maybe<Scalars['JSON']['output']>;
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  processedAt?: Maybe<Scalars['Timestamp']['output']>;
  expiresAt?: Maybe<Scalars['Timestamp']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  orders?: Maybe<Array<Maybe<Orders>>>;
  paymentMethods?: Maybe<Array<Maybe<PaymentMethods>>>;
};


export type PaymentTransactionsordersArgs = {
  where?: InputMaybe<OrdersWhereInput>;
  orderBy?: InputMaybe<OrdersOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PaymentTransactionspaymentMethodsArgs = {
  where?: InputMaybe<PaymentMethodsWhereInput>;
  orderBy?: InputMaybe<PaymentMethodsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentTransactionsStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethods = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  processingFeeType?: Maybe<PaymentMethodsProcessingFeeType>;
  processingFeeValue?: Maybe<Scalars['Float']['output']>;
  minAmount?: Maybe<Scalars['Float']['output']>;
  maxAmount?: Maybe<Scalars['Float']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  requiresVerification?: Maybe<Scalars['Int']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  paymentTransactions?: Maybe<Array<Maybe<PaymentTransactions>>>;
};


export type PaymentMethodspaymentTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentTransactionsWhereInput>;
  orderBy?: InputMaybe<PaymentTransactionsOrderByInput>;
};

export type PaymentMethodsProcessingFeeType =
  | 'fixed'
  | 'percentage';

export type PaymentTransactionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['String']['input']>;
  processingFee?: InputMaybe<Scalars['String']['input']>;
  netAmount?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  paymentData?: InputMaybe<Scalars['String']['input']>;
  gatewayResponse?: InputMaybe<Scalars['String']['input']>;
  processedAt?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type PaymentTransactionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  orderId?: InputMaybe<OrderBy>;
  paymentMethodId?: InputMaybe<OrderBy>;
  transactionId?: InputMaybe<OrderBy>;
  referenceNumber?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  processingFee?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  paymentData?: InputMaybe<OrderBy>;
  gatewayResponse?: InputMaybe<OrderBy>;
  processedAt?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type PaymentMethodsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  processingFeeType?: InputMaybe<Scalars['String']['input']>;
  processingFeeValue?: InputMaybe<Scalars['String']['input']>;
  minAmount?: InputMaybe<Scalars['String']['input']>;
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  requiresVerification?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type PaymentMethodsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  code?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  iconUrl?: InputMaybe<OrderBy>;
  processingFeeType?: InputMaybe<OrderBy>;
  processingFeeValue?: InputMaybe<OrderBy>;
  minAmount?: InputMaybe<OrderBy>;
  maxAmount?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  requiresVerification?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
  settings?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type Products = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  brandId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  basePrice?: Maybe<Scalars['Float']['output']>;
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  brands?: Maybe<Array<Maybe<Brands>>>;
};


export type ProductsproductCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductCategoriesWhereInput>;
  orderBy?: InputMaybe<ProductCategoriesOrderByInput>;
};


export type ProductsproductVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
};


export type ProductsbrandsArgs = {
  where?: InputMaybe<BrandsWhereInput>;
  orderBy?: InputMaybe<BrandsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductCategories = {
  productId: Scalars['Int']['output'];
  categoryId: Scalars['Int']['output'];
  categories?: Maybe<Array<Maybe<Categories>>>;
  products?: Maybe<Array<Maybe<Products>>>;
};


export type ProductCategoriescategoriesArgs = {
  where?: InputMaybe<CategoriesWhereInput>;
  orderBy?: InputMaybe<CategoriesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ProductCategoriesproductsArgs = {
  where?: InputMaybe<ProductsWhereInput>;
  orderBy?: InputMaybe<ProductsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Categories = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  parentId?: Maybe<Scalars['Int']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>;
};


export type CategoriesproductCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductCategoriesWhereInput>;
  orderBy?: InputMaybe<ProductCategoriesOrderByInput>;
};

export type ProductCategoriesWhereInput = {
  productId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
};

export type ProductCategoriesOrderByInput = {
  productId?: InputMaybe<OrderBy>;
  categoryId?: InputMaybe<OrderBy>;
};

export type CategoriesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  parentId?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
};

export type ProductsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  brandId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  basePrice?: InputMaybe<Scalars['String']['input']>;
};

export type ProductsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  brandId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  basePrice?: InputMaybe<OrderBy>;
};

export type Brands = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Maybe<Products>>>;
};


export type BrandsproductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductsWhereInput>;
  orderBy?: InputMaybe<ProductsOrderByInput>;
};

export type BrandsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type BrandsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

export type PromotionVariants = {
  promotionId: Scalars['Int']['output'];
  variantId: Scalars['Int']['output'];
  promotionPrice?: Maybe<Scalars['Float']['output']>;
  stockLimit: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  promotions?: Maybe<Array<Maybe<Promotions>>>;
};


export type PromotionVariantsproductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PromotionVariantspromotionsArgs = {
  where?: InputMaybe<PromotionsWhereInput>;
  orderBy?: InputMaybe<PromotionsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Promotions = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  discountType: PromotionsDiscountType;
  discountValue: Scalars['Float']['output'];
  minPurchaseAmount?: Maybe<Scalars['Float']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>;
};


export type PromotionspromotionVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PromotionVariantsWhereInput>;
  orderBy?: InputMaybe<PromotionVariantsOrderByInput>;
};

export type PromotionsDiscountType =
  | 'percentage'
  | 'fixed_amount';

export type PromotionVariantsWhereInput = {
  promotionId?: InputMaybe<Scalars['String']['input']>;
  variantId?: InputMaybe<Scalars['String']['input']>;
  promotionPrice?: InputMaybe<Scalars['String']['input']>;
  stockLimit?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
};

export type PromotionVariantsOrderByInput = {
  promotionId?: InputMaybe<OrderBy>;
  variantId?: InputMaybe<OrderBy>;
  promotionPrice?: InputMaybe<OrderBy>;
  stockLimit?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
};

export type PromotionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  discountType?: InputMaybe<Scalars['String']['input']>;
  discountValue?: InputMaybe<Scalars['String']['input']>;
  minPurchaseAmount?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type PromotionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  discountType?: InputMaybe<OrderBy>;
  discountValue?: InputMaybe<OrderBy>;
  minPurchaseAmount?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type VariantAttributeOptionsWhereInput = {
  variantId?: InputMaybe<Scalars['String']['input']>;
  attributeOptionId?: InputMaybe<Scalars['String']['input']>;
};

export type VariantAttributeOptionsOrderByInput = {
  variantId?: InputMaybe<OrderBy>;
  attributeOptionId?: InputMaybe<OrderBy>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type VariantImages = {
  id: Scalars['Int']['output'];
  variantId: Scalars['Int']['output'];
  imageType: VariantImagesImageType;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: Scalars['String']['output'];
  /** Imagen normal 600x800 */
  imageUrlNormal: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: Scalars['String']['output'];
  /** Imagen principal de la variante */
  isPrimary?: Maybe<Scalars['Int']['output']>;
  /** Orden de visualización */
  displayOrder?: Maybe<Scalars['Int']['output']>;
  /** Texto alternativo para SEO */
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
};


/** Imágenes de variantes con múltiples tamaños y tipos */
export type VariantImagesproductVariantsArgs = {
  where?: InputMaybe<ProductVariantsWhereInput>;
  orderBy?: InputMaybe<ProductVariantsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type VariantImagesImageType =
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
export type VariantImagesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  variantId?: InputMaybe<Scalars['String']['input']>;
  imageType?: InputMaybe<Scalars['String']['input']>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 */
  imageUrlNormal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom?: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  isPrimary?: InputMaybe<Scalars['String']['input']>;
  /** Orden de visualización */
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo para SEO */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type VariantImagesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  variantId?: InputMaybe<OrderBy>;
  imageType?: InputMaybe<OrderBy>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb?: InputMaybe<OrderBy>;
  /** Imagen normal 600x800 */
  imageUrlNormal?: InputMaybe<OrderBy>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom?: InputMaybe<OrderBy>;
  /** Imagen principal de la variante */
  isPrimary?: InputMaybe<OrderBy>;
  /** Orden de visualización */
  displayOrder?: InputMaybe<OrderBy>;
  /** Texto alternativo para SEO */
  altText?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type Banner = {
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
};

export type BannerWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type BannerOrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
  link?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
};

/** VIEW */
export type OrderSummary = {
  id: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  orderNumber: Scalars['String']['output'];
  customerId: Scalars['Int']['output'];
  customerName?: Maybe<Scalars['String']['output']>;
  customerEmail?: Maybe<Scalars['String']['output']>;
  status: OrderSummaryStatus;
  paymentStatus: OrderSummaryPaymentStatus;
  /** Total final a pagar */
  totalAmount: Scalars['Float']['output'];
  createdAt: Scalars['Timestamp']['output'];
  /** Fecha estimada de entrega */
  estimatedDelivery?: Maybe<Scalars['Date']['output']>;
  totalItems: Scalars['BigInt']['output'];
  totalQuantity?: Maybe<Scalars['Float']['output']>;
  /** Número de seguimiento del courier */
  trackingNumber?: Maybe<Scalars['String']['output']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: Maybe<Scalars['String']['output']>;
};

export type OrderSummaryStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderSummaryPaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

/** VIEW */
export type OrderSummaryWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  paymentStatus?: InputMaybe<Scalars['String']['input']>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['String']['input']>;
  totalItems?: InputMaybe<Scalars['String']['input']>;
  totalQuantity?: InputMaybe<Scalars['String']['input']>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type OrderSummaryOrderByInput = {
  id?: InputMaybe<OrderBy>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<OrderBy>;
  customerId?: InputMaybe<OrderBy>;
  customerName?: InputMaybe<OrderBy>;
  customerEmail?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  paymentStatus?: InputMaybe<OrderBy>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<OrderBy>;
  totalItems?: InputMaybe<OrderBy>;
  totalQuantity?: InputMaybe<OrderBy>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<OrderBy>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<OrderBy>;
};

export type Permissions = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type PermissionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type PermissionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** VIEW */
export type ProductRatingSummary = {
  productId: Scalars['Int']['output'];
  totalRatings: Scalars['BigInt']['output'];
  averageRating?: Maybe<Scalars['Float']['output']>;
  fiveStar?: Maybe<Scalars['Float']['output']>;
  fourStar?: Maybe<Scalars['Float']['output']>;
  threeStar?: Maybe<Scalars['Float']['output']>;
  twoStar?: Maybe<Scalars['Float']['output']>;
  oneStar?: Maybe<Scalars['Float']['output']>;
  verifiedPurchases?: Maybe<Scalars['Float']['output']>;
};

/** VIEW */
export type ProductRatingSummaryWhereInput = {
  productId?: InputMaybe<Scalars['String']['input']>;
  totalRatings?: InputMaybe<Scalars['String']['input']>;
  averageRating?: InputMaybe<Scalars['String']['input']>;
  fiveStar?: InputMaybe<Scalars['String']['input']>;
  fourStar?: InputMaybe<Scalars['String']['input']>;
  threeStar?: InputMaybe<Scalars['String']['input']>;
  twoStar?: InputMaybe<Scalars['String']['input']>;
  oneStar?: InputMaybe<Scalars['String']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type ProductRatingSummaryOrderByInput = {
  productId?: InputMaybe<OrderBy>;
  totalRatings?: InputMaybe<OrderBy>;
  averageRating?: InputMaybe<OrderBy>;
  fiveStar?: InputMaybe<OrderBy>;
  fourStar?: InputMaybe<OrderBy>;
  threeStar?: InputMaybe<OrderBy>;
  twoStar?: InputMaybe<OrderBy>;
  oneStar?: InputMaybe<OrderBy>;
  verifiedPurchases?: InputMaybe<OrderBy>;
};

export type Roles = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>;
  users?: Maybe<Array<Maybe<Users>>>;
};


export type RolesrolesSectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RolesSectionsWhereInput>;
  orderBy?: InputMaybe<RolesSectionsOrderByInput>;
};


export type RolesusersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsersWhereInput>;
  orderBy?: InputMaybe<UsersOrderByInput>;
};

export type RolesSections = {
  id: Scalars['Int']['output'];
  idSection?: Maybe<Scalars['Int']['output']>;
  idRol?: Maybe<Scalars['Int']['output']>;
  roles?: Maybe<Array<Maybe<Roles>>>;
  sections?: Maybe<Array<Maybe<Sections>>>;
};


export type RolesSectionsrolesArgs = {
  where?: InputMaybe<RolesWhereInput>;
  orderBy?: InputMaybe<RolesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type RolesSectionssectionsArgs = {
  where?: InputMaybe<SectionsWhereInput>;
  orderBy?: InputMaybe<SectionsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RolesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type RolesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type Sections = {
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>;
};


export type SectionsrolesSectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RolesSectionsWhereInput>;
  orderBy?: InputMaybe<RolesSectionsOrderByInput>;
};

export type RolesSectionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  idSection?: InputMaybe<Scalars['String']['input']>;
  idRol?: InputMaybe<Scalars['String']['input']>;
};

export type RolesSectionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  idSection?: InputMaybe<OrderBy>;
  idRol?: InputMaybe<OrderBy>;
};

export type SectionsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
};

export type SectionsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
};

export type Users = {
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  roleId: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Roles>>>;
};


export type UsersrolesArgs = {
  where?: InputMaybe<RolesWhereInput>;
  orderBy?: InputMaybe<RolesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type UsersWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type UsersOrderByInput = {
  id?: InputMaybe<OrderBy>;
  username?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  password?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  lastname?: InputMaybe<OrderBy>;
  photo?: InputMaybe<OrderBy>;
};

export type Services = {
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  servicesImages?: Maybe<Array<Maybe<ServicesImages>>>;
};


export type ServicesservicesImagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ServicesImagesWhereInput>;
  orderBy?: InputMaybe<ServicesImagesOrderByInput>;
};

export type ServicesImages = {
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  idService?: Maybe<Scalars['Int']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  services?: Maybe<Array<Maybe<Services>>>;
};


export type ServicesImagesservicesArgs = {
  where?: InputMaybe<ServicesWhereInput>;
  orderBy?: InputMaybe<ServicesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ServicesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
};

export type ServicesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  slug?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
};

export type ServicesImagesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  idService?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ServicesImagesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  subtitle?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
  idService?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
};

export type ShippingMethods = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  baseCost: Scalars['Float']['output'];
  freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  estimatedDaysMin?: Maybe<Scalars['Int']['output']>;
  estimatedDaysMax?: Maybe<Scalars['Int']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  shippingZoneMethods?: Maybe<Array<Maybe<ShippingZoneMethods>>>;
};


export type ShippingMethodsshippingZoneMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
  orderBy?: InputMaybe<ShippingZoneMethodsOrderByInput>;
};

export type ShippingZoneMethods = {
  id: Scalars['Int']['output'];
  shippingMethodId: Scalars['Int']['output'];
  shippingZoneId: Scalars['Int']['output'];
  cost: Scalars['Float']['output'];
  freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  estimatedDaysMin?: Maybe<Scalars['Int']['output']>;
  estimatedDaysMax?: Maybe<Scalars['Int']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  shippingMethods?: Maybe<Array<Maybe<ShippingMethods>>>;
  shippingZones?: Maybe<Array<Maybe<ShippingZones>>>;
};


export type ShippingZoneMethodsshippingMethodsArgs = {
  where?: InputMaybe<ShippingMethodsWhereInput>;
  orderBy?: InputMaybe<ShippingMethodsOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ShippingZoneMethodsshippingZonesArgs = {
  where?: InputMaybe<ShippingZonesWhereInput>;
  orderBy?: InputMaybe<ShippingZonesOrderByInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ShippingMethodsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  baseCost?: InputMaybe<Scalars['String']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['String']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['String']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingMethodsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  baseCost?: InputMaybe<OrderBy>;
  freeShippingThreshold?: InputMaybe<OrderBy>;
  estimatedDaysMin?: InputMaybe<OrderBy>;
  estimatedDaysMax?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  displayOrder?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type ShippingZones = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  districts: Scalars['JSON']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  shippingZoneMethods?: Maybe<Array<Maybe<ShippingZoneMethods>>>;
};


export type ShippingZonesshippingZoneMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ShippingZoneMethodsWhereInput>;
  orderBy?: InputMaybe<ShippingZoneMethodsOrderByInput>;
};

export type ShippingZoneMethodsWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  shippingMethodId?: InputMaybe<Scalars['String']['input']>;
  shippingZoneId?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['String']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['String']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['String']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingZoneMethodsOrderByInput = {
  id?: InputMaybe<OrderBy>;
  shippingMethodId?: InputMaybe<OrderBy>;
  shippingZoneId?: InputMaybe<OrderBy>;
  cost?: InputMaybe<OrderBy>;
  freeShippingThreshold?: InputMaybe<OrderBy>;
  estimatedDaysMin?: InputMaybe<OrderBy>;
  estimatedDaysMax?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type ShippingZonesWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  districts?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingZonesOrderByInput = {
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  districts?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** VIEW */
export type VariantRatingSummary = {
  variantId: Scalars['Int']['output'];
  totalRatings: Scalars['BigInt']['output'];
  averageRating?: Maybe<Scalars['Float']['output']>;
  fiveStar?: Maybe<Scalars['Float']['output']>;
  fourStar?: Maybe<Scalars['Float']['output']>;
  threeStar?: Maybe<Scalars['Float']['output']>;
  twoStar?: Maybe<Scalars['Float']['output']>;
  oneStar?: Maybe<Scalars['Float']['output']>;
  verifiedPurchases?: Maybe<Scalars['Float']['output']>;
};

/** VIEW */
export type VariantRatingSummaryWhereInput = {
  variantId?: InputMaybe<Scalars['String']['input']>;
  totalRatings?: InputMaybe<Scalars['String']['input']>;
  averageRating?: InputMaybe<Scalars['String']['input']>;
  fiveStar?: InputMaybe<Scalars['String']['input']>;
  fourStar?: InputMaybe<Scalars['String']['input']>;
  threeStar?: InputMaybe<Scalars['String']['input']>;
  twoStar?: InputMaybe<Scalars['String']['input']>;
  oneStar?: InputMaybe<Scalars['String']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type VariantRatingSummaryOrderByInput = {
  variantId?: InputMaybe<OrderBy>;
  totalRatings?: InputMaybe<OrderBy>;
  averageRating?: InputMaybe<OrderBy>;
  fiveStar?: InputMaybe<OrderBy>;
  fourStar?: InputMaybe<OrderBy>;
  threeStar?: InputMaybe<OrderBy>;
  twoStar?: InputMaybe<OrderBy>;
  oneStar?: InputMaybe<OrderBy>;
  verifiedPurchases?: InputMaybe<OrderBy>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImagesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attributeOptionId: Scalars['Int']['input'];
  imageType?: InputMaybe<AttributeOptionImagesImageType>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb: Scalars['String']['input'];
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom: Scalars['String']['input'];
  /** Texto alternativo */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  isPrimary?: InputMaybe<Scalars['Int']['input']>;
};

/** Imágenes para opciones de atributos (colores, materiales, etc.) */
export type AttributeOptionImagesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attributeOptionId?: InputMaybe<Scalars['Int']['input']>;
  imageType?: InputMaybe<AttributeOptionImagesImageType>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Imagen thumbnail 140x140 para selector de atributo */
  imageUrlThumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 (opcional) */
  imageUrlNormal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 (opcional) */
  imageUrlZoom?: InputMaybe<Scalars['String']['input']>;
  /** Texto alternativo */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  isPrimary?: InputMaybe<Scalars['Int']['input']>;
};

export type AttributeOptionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attributeId: Scalars['Int']['input'];
  value: Scalars['String']['input'];
  additionalCost?: InputMaybe<Scalars['Float']['input']>;
};

export type AttributeOptionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  attributeId?: InputMaybe<Scalars['Int']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  additionalCost?: InputMaybe<Scalars['Float']['input']>;
};

export type AttributesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  displayType?: InputMaybe<AttributesDisplayType>;
};

export type AttributesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  displayType?: InputMaybe<AttributesDisplayType>;
};

export type BannerInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type BannerUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type BrandsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type BrandsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CouponUsageInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  couponId: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  orderId: Scalars['Int']['input'];
  discountAmount: Scalars['Float']['input'];
  usedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type CouponUsageUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  couponId?: InputMaybe<Scalars['Int']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  usedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type CouponsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discountType: CouponsDiscountType;
  discountValue: Scalars['Float']['input'];
  minPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  maxDiscountAmount?: InputMaybe<Scalars['Float']['input']>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  usageLimitPerCustomer?: InputMaybe<Scalars['Int']['input']>;
  usedCount?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
  isActive?: InputMaybe<Scalars['Int']['input']>;
  applicableTo?: InputMaybe<CouponsApplicableTo>;
  applicableIds?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type CouponsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discountType?: InputMaybe<CouponsDiscountType>;
  discountValue?: InputMaybe<Scalars['Float']['input']>;
  minPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  maxDiscountAmount?: InputMaybe<Scalars['Float']['input']>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  usageLimitPerCustomer?: InputMaybe<Scalars['Int']['input']>;
  usedCount?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  applicableTo?: InputMaybe<CouponsApplicableTo>;
  applicableIds?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type CustomersInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  addressId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type CustomersUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  addressId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** numero de celular */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Documento de identidad  */
  dni?: InputMaybe<Scalars['String']['input']>;
};

export type CustomersAddressesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  idCustomer: Scalars['Int']['input'];
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district: Scalars['String']['input'];
  /** Nombre de la avenida/calle/jirón */
  streetName: Scalars['String']['input'];
  /** Número de la dirección */
  streetNumber: Scalars['String']['input'];
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** 1 = dirección por defecto */
  isDefault?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type CustomersAddressesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  idCustomer?: InputMaybe<Scalars['Int']['input']>;
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  /** Nombre de la avenida/calle/jirón */
  streetName?: InputMaybe<Scalars['String']['input']>;
  /** Número de la dirección */
  streetNumber?: InputMaybe<Scalars['String']['input']>;
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: InputMaybe<Scalars['String']['input']>;
  /** Latitud GPS */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitud GPS */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** 1 = dirección por defecto */
  isDefault?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Items/productos de cada orden */
export type OrderItemsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  /** Variante del producto comprada */
  variantId: Scalars['Int']['input'];
  /** Nombre del producto al momento de compra */
  productName: Scalars['String']['input'];
  /** SKU de la variante */
  variantSku: Scalars['String']['input'];
  /** Atributos de la variante (color, talla, etc.) */
  variantAttributes?: InputMaybe<Scalars['JSON']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Precio unitario al momento de compra */
  unitPrice: Scalars['Float']['input'];
  /** Precio total (quantity * unit_price) */
  totalPrice: Scalars['Float']['input'];
  /** Descuento aplicado a este item */
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
};

/** Items/productos de cada orden */
export type OrderItemsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  /** Variante del producto comprada */
  variantId?: InputMaybe<Scalars['Int']['input']>;
  /** Nombre del producto al momento de compra */
  productName?: InputMaybe<Scalars['String']['input']>;
  /** SKU de la variante */
  variantSku?: InputMaybe<Scalars['String']['input']>;
  /** Atributos de la variante (color, talla, etc.) */
  variantAttributes?: InputMaybe<Scalars['JSON']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Precio unitario al momento de compra */
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  /** Precio total (quantity * unit_price) */
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento aplicado a este item */
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type OrderSummaryInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber: Scalars['String']['input'];
  customerId: Scalars['Int']['input'];
  customerName?: InputMaybe<Scalars['String']['input']>;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderSummaryStatus>;
  paymentStatus?: InputMaybe<OrderSummaryPaymentStatus>;
  /** Total final a pagar */
  totalAmount: Scalars['Float']['input'];
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['Date']['input']>;
  totalItems?: InputMaybe<Scalars['BigInt']['input']>;
  totalQuantity?: InputMaybe<Scalars['Float']['input']>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
};

/** VIEW */
export type OrderSummaryUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderSummaryStatus>;
  paymentStatus?: InputMaybe<OrderSummaryPaymentStatus>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['Date']['input']>;
  totalItems?: InputMaybe<Scalars['BigInt']['input']>;
  totalQuantity?: InputMaybe<Scalars['Float']['input']>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
};

/** Seguimiento de envíos */
export type OrderTrackingInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderTrackingStatus>;
  /** Ubicación actual del paquete */
  currentLocation?: InputMaybe<Scalars['String']['input']>;
  shippedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  deliveredAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Nombre de quien recibió */
  deliveredTo?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  deliveryNotes?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Seguimiento de envíos */
export type OrderTrackingUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  /** Número de seguimiento del courier */
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  /** Empresa de courier (Olva, Shalom, etc.) */
  courierCompany?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderTrackingStatus>;
  /** Ubicación actual del paquete */
  currentLocation?: InputMaybe<Scalars['String']['input']>;
  shippedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  deliveredAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Nombre de quien recibió */
  deliveredTo?: InputMaybe<Scalars['String']['input']>;
  /** Notas de entrega */
  deliveryNotes?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Órdenes principales del ecommerce */
export type OrdersInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  customerId: Scalars['Int']['input'];
  /** Número único de orden (ORD-2025-001234) */
  orderNumber: Scalars['String']['input'];
  status?: InputMaybe<OrdersStatus>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Subtotal antes de descuentos */
  subtotal: Scalars['Float']['input'];
  /** Descuento aplicado */
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Costo de envío */
  shippingCost?: InputMaybe<Scalars['Float']['input']>;
  /** Impuestos (IGV) */
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Total final a pagar */
  totalAmount: Scalars['Float']['input'];
  /** Dirección de envío */
  shippingAddressId: Scalars['Int']['input'];
  /** Método de envío */
  shippingMethod?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['Date']['input']>;
  /** Método de pago usado */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  paymentStatus?: InputMaybe<OrdersPaymentStatus>;
  /** Fecha de pago confirmado */
  paidAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Notas del cliente */
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  adminNotes?: InputMaybe<Scalars['String']['input']>;
};

/** Órdenes principales del ecommerce */
export type OrdersUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  /** Número único de orden (ORD-2025-001234) */
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrdersStatus>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Subtotal antes de descuentos */
  subtotal?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento aplicado */
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Costo de envío */
  shippingCost?: InputMaybe<Scalars['Float']['input']>;
  /** Impuestos (IGV) */
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Total final a pagar */
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Dirección de envío */
  shippingAddressId?: InputMaybe<Scalars['Int']['input']>;
  /** Método de envío */
  shippingMethod?: InputMaybe<Scalars['String']['input']>;
  /** Fecha estimada de entrega */
  estimatedDelivery?: InputMaybe<Scalars['Date']['input']>;
  /** Método de pago usado */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  paymentStatus?: InputMaybe<OrdersPaymentStatus>;
  /** Fecha de pago confirmado */
  paidAt?: InputMaybe<Scalars['Timestamp']['input']>;
  /** Notas del cliente */
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  /** Notas internas del admin */
  adminNotes?: InputMaybe<Scalars['String']['input']>;
};

export type PaymentMethodsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  processingFeeType?: InputMaybe<PaymentMethodsProcessingFeeType>;
  processingFeeValue?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  requiresVerification?: InputMaybe<Scalars['Int']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  settings?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PaymentMethodsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  processingFeeType?: InputMaybe<PaymentMethodsProcessingFeeType>;
  processingFeeValue?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  requiresVerification?: InputMaybe<Scalars['Int']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  settings?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PaymentTransactionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  paymentMethodId: Scalars['Int']['input'];
  transactionId?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
  processingFee?: InputMaybe<Scalars['Float']['input']>;
  netAmount: Scalars['Float']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PaymentTransactionsStatus>;
  paymentData?: InputMaybe<Scalars['JSON']['input']>;
  gatewayResponse?: InputMaybe<Scalars['JSON']['input']>;
  processedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PaymentTransactionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  paymentMethodId?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  processingFee?: InputMaybe<Scalars['Float']['input']>;
  netAmount?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PaymentTransactionsStatus>;
  paymentData?: InputMaybe<Scalars['JSON']['input']>;
  gatewayResponse?: InputMaybe<Scalars['JSON']['input']>;
  processedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PermissionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PermissionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ProductCategoriesInsertInput = {
  productId: Scalars['Int']['input'];
  categoryId: Scalars['Int']['input'];
};

export type ProductCategoriesUpdateInput = {
  productId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
};

/** VIEW */
export type ProductRatingSummaryInsertInput = {
  productId: Scalars['Int']['input'];
  totalRatings?: InputMaybe<Scalars['BigInt']['input']>;
  averageRating?: InputMaybe<Scalars['Float']['input']>;
  fiveStar?: InputMaybe<Scalars['Float']['input']>;
  fourStar?: InputMaybe<Scalars['Float']['input']>;
  threeStar?: InputMaybe<Scalars['Float']['input']>;
  twoStar?: InputMaybe<Scalars['Float']['input']>;
  oneStar?: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type ProductRatingSummaryUpdateInput = {
  productId?: InputMaybe<Scalars['Int']['input']>;
  totalRatings?: InputMaybe<Scalars['BigInt']['input']>;
  averageRating?: InputMaybe<Scalars['Float']['input']>;
  fiveStar?: InputMaybe<Scalars['Float']['input']>;
  fourStar?: InputMaybe<Scalars['Float']['input']>;
  threeStar?: InputMaybe<Scalars['Float']['input']>;
  twoStar?: InputMaybe<Scalars['Float']['input']>;
  oneStar?: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['Float']['input']>;
};

export type ProductVariantsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['Int']['input'];
  sku: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ProductVariantsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ProductsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  brandId?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  basePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type ProductsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  brandId?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  basePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type PromotionVariantsInsertInput = {
  promotionId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
  promotionPrice?: InputMaybe<Scalars['Float']['input']>;
  stockLimit: Scalars['Int']['input'];
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PromotionVariantsUpdateInput = {
  promotionId?: InputMaybe<Scalars['Int']['input']>;
  variantId?: InputMaybe<Scalars['Int']['input']>;
  promotionPrice?: InputMaybe<Scalars['Float']['input']>;
  stockLimit?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PromotionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
  discountType?: InputMaybe<PromotionsDiscountType>;
  discountValue: Scalars['Float']['input'];
  minPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type PromotionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  discountType?: InputMaybe<PromotionsDiscountType>;
  discountValue?: InputMaybe<Scalars['Float']['input']>;
  minPurchaseAmount?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type RatingImagesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  ratingId: Scalars['Int']['input'];
  imageUrl: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type RatingImagesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  ratingId?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type RolesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type RolesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type RolesSectionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  idSection?: InputMaybe<Scalars['Int']['input']>;
  idRol?: InputMaybe<Scalars['Int']['input']>;
};

export type RolesSectionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  idSection?: InputMaybe<Scalars['Int']['input']>;
  idRol?: InputMaybe<Scalars['Int']['input']>;
};

export type SectionsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type SectionsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type ServicesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type ServicesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type ServicesImagesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  idService?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ServicesImagesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  idService?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingMethodsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  baseCost?: InputMaybe<Scalars['Float']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['Int']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ShippingMethodsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  baseCost?: InputMaybe<Scalars['Float']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['Int']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ShippingZoneMethodsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shippingMethodId: Scalars['Int']['input'];
  shippingZoneId: Scalars['Int']['input'];
  cost?: InputMaybe<Scalars['Float']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['Int']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ShippingZoneMethodsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shippingMethodId?: InputMaybe<Scalars['Int']['input']>;
  shippingZoneId?: InputMaybe<Scalars['Int']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  estimatedDaysMin?: InputMaybe<Scalars['Int']['input']>;
  estimatedDaysMax?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ShippingZonesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  districts: Scalars['JSON']['input'];
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type ShippingZonesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  districts?: InputMaybe<Scalars['JSON']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type UsersInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roleId: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type UsersUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type VariantAttributeOptionsInsertInput = {
  variantId: Scalars['Int']['input'];
  attributeOptionId: Scalars['Int']['input'];
};

export type VariantAttributeOptionsUpdateInput = {
  variantId?: InputMaybe<Scalars['Int']['input']>;
  attributeOptionId?: InputMaybe<Scalars['Int']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type VariantImagesInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variantId: Scalars['Int']['input'];
  imageType?: InputMaybe<VariantImagesImageType>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb: Scalars['String']['input'];
  /** Imagen normal 600x800 */
  imageUrlNormal: Scalars['String']['input'];
  /** Imagen zoom 1200x1200 */
  imageUrlZoom: Scalars['String']['input'];
  /** Imagen principal de la variante */
  isPrimary?: InputMaybe<Scalars['Int']['input']>;
  /** Orden de visualización */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Texto alternativo para SEO */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** Imágenes de variantes con múltiples tamaños y tipos */
export type VariantImagesUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variantId?: InputMaybe<Scalars['Int']['input']>;
  imageType?: InputMaybe<VariantImagesImageType>;
  /** Imagen thumbnail 140x140 */
  imageUrlThumb?: InputMaybe<Scalars['String']['input']>;
  /** Imagen normal 600x800 */
  imageUrlNormal?: InputMaybe<Scalars['String']['input']>;
  /** Imagen zoom 1200x1200 */
  imageUrlZoom?: InputMaybe<Scalars['String']['input']>;
  /** Imagen principal de la variante */
  isPrimary?: InputMaybe<Scalars['Int']['input']>;
  /** Orden de visualización */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Texto alternativo para SEO */
  altText?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

/** VIEW */
export type VariantRatingSummaryInsertInput = {
  variantId: Scalars['Int']['input'];
  totalRatings?: InputMaybe<Scalars['BigInt']['input']>;
  averageRating?: InputMaybe<Scalars['Float']['input']>;
  fiveStar?: InputMaybe<Scalars['Float']['input']>;
  fourStar?: InputMaybe<Scalars['Float']['input']>;
  threeStar?: InputMaybe<Scalars['Float']['input']>;
  twoStar?: InputMaybe<Scalars['Float']['input']>;
  oneStar?: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['Float']['input']>;
};

/** VIEW */
export type VariantRatingSummaryUpdateInput = {
  variantId?: InputMaybe<Scalars['Int']['input']>;
  totalRatings?: InputMaybe<Scalars['BigInt']['input']>;
  averageRating?: InputMaybe<Scalars['Float']['input']>;
  fiveStar?: InputMaybe<Scalars['Float']['input']>;
  fourStar?: InputMaybe<Scalars['Float']['input']>;
  threeStar?: InputMaybe<Scalars['Float']['input']>;
  twoStar?: InputMaybe<Scalars['Float']['input']>;
  oneStar?: InputMaybe<Scalars['Float']['input']>;
  verifiedPurchases?: InputMaybe<Scalars['Float']['input']>;
};

export type VariantRatingsInsertInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variantId: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verifiedPurchase?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type VariantRatingsUpdateInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  variantId?: InputMaybe<Scalars['Int']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  review?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  verifiedPurchase?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>;
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  AttributeOptionImages: ResolverTypeWrapper<AttributeOptionImages>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AttributeOptionImagesImageType: AttributeOptionImagesImageType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  AttributeOptions: ResolverTypeWrapper<AttributeOptions>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  AttributeOptionImagesWhereInput: AttributeOptionImagesWhereInput;
  AttributeOptionImagesOrderByInput: AttributeOptionImagesOrderByInput;
  OrderBy: OrderBy;
  Attributes: ResolverTypeWrapper<Attributes>;
  AttributesDisplayType: AttributesDisplayType;
  AttributeOptionsWhereInput: AttributeOptionsWhereInput;
  AttributeOptionsOrderByInput: AttributeOptionsOrderByInput;
  AttributesWhereInput: AttributesWhereInput;
  AttributesOrderByInput: AttributesOrderByInput;
  VariantAttributeOptions: ResolverTypeWrapper<VariantAttributeOptions>;
  ProductVariants: ResolverTypeWrapper<ProductVariants>;
  OrderItems: ResolverTypeWrapper<OrderItems>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Orders: ResolverTypeWrapper<Orders>;
  OrdersStatus: OrdersStatus;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  OrdersPaymentStatus: OrdersPaymentStatus;
  CouponUsage: ResolverTypeWrapper<CouponUsage>;
  Coupons: ResolverTypeWrapper<Coupons>;
  CouponsDiscountType: CouponsDiscountType;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  CouponsApplicableTo: CouponsApplicableTo;
  CouponUsageWhereInput: CouponUsageWhereInput;
  CouponUsageOrderByInput: CouponUsageOrderByInput;
  CouponsWhereInput: CouponsWhereInput;
  CouponsOrderByInput: CouponsOrderByInput;
  Customers: ResolverTypeWrapper<Customers>;
  CustomersAddresses: ResolverTypeWrapper<CustomersAddresses>;
  CustomersWhereInput: CustomersWhereInput;
  CustomersOrderByInput: CustomersOrderByInput;
  OrdersWhereInput: OrdersWhereInput;
  OrdersOrderByInput: OrdersOrderByInput;
  CustomersAddressesWhereInput: CustomersAddressesWhereInput;
  CustomersAddressesOrderByInput: CustomersAddressesOrderByInput;
  VariantRatings: ResolverTypeWrapper<VariantRatings>;
  RatingImages: ResolverTypeWrapper<RatingImages>;
  VariantRatingsWhereInput: VariantRatingsWhereInput;
  VariantRatingsOrderByInput: VariantRatingsOrderByInput;
  RatingImagesWhereInput: RatingImagesWhereInput;
  RatingImagesOrderByInput: RatingImagesOrderByInput;
  ProductVariantsWhereInput: ProductVariantsWhereInput;
  ProductVariantsOrderByInput: ProductVariantsOrderByInput;
  OrderItemsWhereInput: OrderItemsWhereInput;
  OrderItemsOrderByInput: OrderItemsOrderByInput;
  OrderTracking: ResolverTypeWrapper<OrderTracking>;
  OrderTrackingStatus: OrderTrackingStatus;
  OrderTrackingWhereInput: OrderTrackingWhereInput;
  OrderTrackingOrderByInput: OrderTrackingOrderByInput;
  PaymentTransactions: ResolverTypeWrapper<PaymentTransactions>;
  PaymentTransactionsStatus: PaymentTransactionsStatus;
  PaymentMethods: ResolverTypeWrapper<PaymentMethods>;
  PaymentMethodsProcessingFeeType: PaymentMethodsProcessingFeeType;
  PaymentTransactionsWhereInput: PaymentTransactionsWhereInput;
  PaymentTransactionsOrderByInput: PaymentTransactionsOrderByInput;
  PaymentMethodsWhereInput: PaymentMethodsWhereInput;
  PaymentMethodsOrderByInput: PaymentMethodsOrderByInput;
  Products: ResolverTypeWrapper<Products>;
  ProductCategories: ResolverTypeWrapper<ProductCategories>;
  Categories: ResolverTypeWrapper<Categories>;
  ProductCategoriesWhereInput: ProductCategoriesWhereInput;
  ProductCategoriesOrderByInput: ProductCategoriesOrderByInput;
  CategoriesWhereInput: CategoriesWhereInput;
  CategoriesOrderByInput: CategoriesOrderByInput;
  ProductsWhereInput: ProductsWhereInput;
  ProductsOrderByInput: ProductsOrderByInput;
  Brands: ResolverTypeWrapper<Brands>;
  BrandsWhereInput: BrandsWhereInput;
  BrandsOrderByInput: BrandsOrderByInput;
  PromotionVariants: ResolverTypeWrapper<PromotionVariants>;
  Promotions: ResolverTypeWrapper<Promotions>;
  PromotionsDiscountType: PromotionsDiscountType;
  PromotionVariantsWhereInput: PromotionVariantsWhereInput;
  PromotionVariantsOrderByInput: PromotionVariantsOrderByInput;
  PromotionsWhereInput: PromotionsWhereInput;
  PromotionsOrderByInput: PromotionsOrderByInput;
  VariantAttributeOptionsWhereInput: VariantAttributeOptionsWhereInput;
  VariantAttributeOptionsOrderByInput: VariantAttributeOptionsOrderByInput;
  VariantImages: ResolverTypeWrapper<VariantImages>;
  VariantImagesImageType: VariantImagesImageType;
  VariantImagesWhereInput: VariantImagesWhereInput;
  VariantImagesOrderByInput: VariantImagesOrderByInput;
  Banner: ResolverTypeWrapper<Banner>;
  BannerWhereInput: BannerWhereInput;
  BannerOrderByInput: BannerOrderByInput;
  OrderSummary: ResolverTypeWrapper<OrderSummary>;
  OrderSummaryStatus: OrderSummaryStatus;
  OrderSummaryPaymentStatus: OrderSummaryPaymentStatus;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  OrderSummaryWhereInput: OrderSummaryWhereInput;
  OrderSummaryOrderByInput: OrderSummaryOrderByInput;
  Permissions: ResolverTypeWrapper<Permissions>;
  PermissionsWhereInput: PermissionsWhereInput;
  PermissionsOrderByInput: PermissionsOrderByInput;
  ProductRatingSummary: ResolverTypeWrapper<ProductRatingSummary>;
  ProductRatingSummaryWhereInput: ProductRatingSummaryWhereInput;
  ProductRatingSummaryOrderByInput: ProductRatingSummaryOrderByInput;
  Roles: ResolverTypeWrapper<Roles>;
  RolesSections: ResolverTypeWrapper<RolesSections>;
  RolesWhereInput: RolesWhereInput;
  RolesOrderByInput: RolesOrderByInput;
  Sections: ResolverTypeWrapper<Sections>;
  RolesSectionsWhereInput: RolesSectionsWhereInput;
  RolesSectionsOrderByInput: RolesSectionsOrderByInput;
  SectionsWhereInput: SectionsWhereInput;
  SectionsOrderByInput: SectionsOrderByInput;
  Users: ResolverTypeWrapper<Users>;
  UsersWhereInput: UsersWhereInput;
  UsersOrderByInput: UsersOrderByInput;
  Services: ResolverTypeWrapper<Services>;
  ServicesImages: ResolverTypeWrapper<ServicesImages>;
  ServicesWhereInput: ServicesWhereInput;
  ServicesOrderByInput: ServicesOrderByInput;
  ServicesImagesWhereInput: ServicesImagesWhereInput;
  ServicesImagesOrderByInput: ServicesImagesOrderByInput;
  ShippingMethods: ResolverTypeWrapper<ShippingMethods>;
  ShippingZoneMethods: ResolverTypeWrapper<ShippingZoneMethods>;
  ShippingMethodsWhereInput: ShippingMethodsWhereInput;
  ShippingMethodsOrderByInput: ShippingMethodsOrderByInput;
  ShippingZones: ResolverTypeWrapper<ShippingZones>;
  ShippingZoneMethodsWhereInput: ShippingZoneMethodsWhereInput;
  ShippingZoneMethodsOrderByInput: ShippingZoneMethodsOrderByInput;
  ShippingZonesWhereInput: ShippingZonesWhereInput;
  ShippingZonesOrderByInput: ShippingZonesOrderByInput;
  VariantRatingSummary: ResolverTypeWrapper<VariantRatingSummary>;
  VariantRatingSummaryWhereInput: VariantRatingSummaryWhereInput;
  VariantRatingSummaryOrderByInput: VariantRatingSummaryOrderByInput;
  AttributeOptionImagesInsertInput: AttributeOptionImagesInsertInput;
  AttributeOptionImagesUpdateInput: AttributeOptionImagesUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AttributeOptionsInsertInput: AttributeOptionsInsertInput;
  AttributeOptionsUpdateInput: AttributeOptionsUpdateInput;
  AttributesInsertInput: AttributesInsertInput;
  AttributesUpdateInput: AttributesUpdateInput;
  BannerInsertInput: BannerInsertInput;
  BannerUpdateInput: BannerUpdateInput;
  BrandsInsertInput: BrandsInsertInput;
  BrandsUpdateInput: BrandsUpdateInput;
  CategoriesInsertInput: CategoriesInsertInput;
  CategoriesUpdateInput: CategoriesUpdateInput;
  CouponUsageInsertInput: CouponUsageInsertInput;
  CouponUsageUpdateInput: CouponUsageUpdateInput;
  CouponsInsertInput: CouponsInsertInput;
  CouponsUpdateInput: CouponsUpdateInput;
  CustomersInsertInput: CustomersInsertInput;
  CustomersUpdateInput: CustomersUpdateInput;
  CustomersAddressesInsertInput: CustomersAddressesInsertInput;
  CustomersAddressesUpdateInput: CustomersAddressesUpdateInput;
  OrderItemsInsertInput: OrderItemsInsertInput;
  OrderItemsUpdateInput: OrderItemsUpdateInput;
  OrderSummaryInsertInput: OrderSummaryInsertInput;
  OrderSummaryUpdateInput: OrderSummaryUpdateInput;
  OrderTrackingInsertInput: OrderTrackingInsertInput;
  OrderTrackingUpdateInput: OrderTrackingUpdateInput;
  OrdersInsertInput: OrdersInsertInput;
  OrdersUpdateInput: OrdersUpdateInput;
  PaymentMethodsInsertInput: PaymentMethodsInsertInput;
  PaymentMethodsUpdateInput: PaymentMethodsUpdateInput;
  PaymentTransactionsInsertInput: PaymentTransactionsInsertInput;
  PaymentTransactionsUpdateInput: PaymentTransactionsUpdateInput;
  PermissionsInsertInput: PermissionsInsertInput;
  PermissionsUpdateInput: PermissionsUpdateInput;
  ProductCategoriesInsertInput: ProductCategoriesInsertInput;
  ProductCategoriesUpdateInput: ProductCategoriesUpdateInput;
  ProductRatingSummaryInsertInput: ProductRatingSummaryInsertInput;
  ProductRatingSummaryUpdateInput: ProductRatingSummaryUpdateInput;
  ProductVariantsInsertInput: ProductVariantsInsertInput;
  ProductVariantsUpdateInput: ProductVariantsUpdateInput;
  ProductsInsertInput: ProductsInsertInput;
  ProductsUpdateInput: ProductsUpdateInput;
  PromotionVariantsInsertInput: PromotionVariantsInsertInput;
  PromotionVariantsUpdateInput: PromotionVariantsUpdateInput;
  PromotionsInsertInput: PromotionsInsertInput;
  PromotionsUpdateInput: PromotionsUpdateInput;
  RatingImagesInsertInput: RatingImagesInsertInput;
  RatingImagesUpdateInput: RatingImagesUpdateInput;
  RolesInsertInput: RolesInsertInput;
  RolesUpdateInput: RolesUpdateInput;
  RolesSectionsInsertInput: RolesSectionsInsertInput;
  RolesSectionsUpdateInput: RolesSectionsUpdateInput;
  SectionsInsertInput: SectionsInsertInput;
  SectionsUpdateInput: SectionsUpdateInput;
  ServicesInsertInput: ServicesInsertInput;
  ServicesUpdateInput: ServicesUpdateInput;
  ServicesImagesInsertInput: ServicesImagesInsertInput;
  ServicesImagesUpdateInput: ServicesImagesUpdateInput;
  ShippingMethodsInsertInput: ShippingMethodsInsertInput;
  ShippingMethodsUpdateInput: ShippingMethodsUpdateInput;
  ShippingZoneMethodsInsertInput: ShippingZoneMethodsInsertInput;
  ShippingZoneMethodsUpdateInput: ShippingZoneMethodsUpdateInput;
  ShippingZonesInsertInput: ShippingZonesInsertInput;
  ShippingZonesUpdateInput: ShippingZonesUpdateInput;
  UsersInsertInput: UsersInsertInput;
  UsersUpdateInput: UsersUpdateInput;
  VariantAttributeOptionsInsertInput: VariantAttributeOptionsInsertInput;
  VariantAttributeOptionsUpdateInput: VariantAttributeOptionsUpdateInput;
  VariantImagesInsertInput: VariantImagesInsertInput;
  VariantImagesUpdateInput: VariantImagesUpdateInput;
  VariantRatingSummaryInsertInput: VariantRatingSummaryInsertInput;
  VariantRatingSummaryUpdateInput: VariantRatingSummaryUpdateInput;
  VariantRatingsInsertInput: VariantRatingsInsertInput;
  VariantRatingsUpdateInput: VariantRatingsUpdateInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  AttributeOptionImages: AttributeOptionImages;
  Int: Scalars['Int']['output'];
  String: Scalars['String']['output'];
  Timestamp: Scalars['Timestamp']['output'];
  AttributeOptions: AttributeOptions;
  Float: Scalars['Float']['output'];
  AttributeOptionImagesWhereInput: AttributeOptionImagesWhereInput;
  AttributeOptionImagesOrderByInput: AttributeOptionImagesOrderByInput;
  Attributes: Attributes;
  AttributeOptionsWhereInput: AttributeOptionsWhereInput;
  AttributeOptionsOrderByInput: AttributeOptionsOrderByInput;
  AttributesWhereInput: AttributesWhereInput;
  AttributesOrderByInput: AttributesOrderByInput;
  VariantAttributeOptions: VariantAttributeOptions;
  ProductVariants: ProductVariants;
  OrderItems: OrderItems;
  JSON: Scalars['JSON']['output'];
  Orders: Orders;
  Date: Scalars['Date']['output'];
  CouponUsage: CouponUsage;
  Coupons: Coupons;
  DateTime: Scalars['DateTime']['output'];
  CouponUsageWhereInput: CouponUsageWhereInput;
  CouponUsageOrderByInput: CouponUsageOrderByInput;
  CouponsWhereInput: CouponsWhereInput;
  CouponsOrderByInput: CouponsOrderByInput;
  Customers: Customers;
  CustomersAddresses: CustomersAddresses;
  CustomersWhereInput: CustomersWhereInput;
  CustomersOrderByInput: CustomersOrderByInput;
  OrdersWhereInput: OrdersWhereInput;
  OrdersOrderByInput: OrdersOrderByInput;
  CustomersAddressesWhereInput: CustomersAddressesWhereInput;
  CustomersAddressesOrderByInput: CustomersAddressesOrderByInput;
  VariantRatings: VariantRatings;
  RatingImages: RatingImages;
  VariantRatingsWhereInput: VariantRatingsWhereInput;
  VariantRatingsOrderByInput: VariantRatingsOrderByInput;
  RatingImagesWhereInput: RatingImagesWhereInput;
  RatingImagesOrderByInput: RatingImagesOrderByInput;
  ProductVariantsWhereInput: ProductVariantsWhereInput;
  ProductVariantsOrderByInput: ProductVariantsOrderByInput;
  OrderItemsWhereInput: OrderItemsWhereInput;
  OrderItemsOrderByInput: OrderItemsOrderByInput;
  OrderTracking: OrderTracking;
  OrderTrackingWhereInput: OrderTrackingWhereInput;
  OrderTrackingOrderByInput: OrderTrackingOrderByInput;
  PaymentTransactions: PaymentTransactions;
  PaymentMethods: PaymentMethods;
  PaymentTransactionsWhereInput: PaymentTransactionsWhereInput;
  PaymentTransactionsOrderByInput: PaymentTransactionsOrderByInput;
  PaymentMethodsWhereInput: PaymentMethodsWhereInput;
  PaymentMethodsOrderByInput: PaymentMethodsOrderByInput;
  Products: Products;
  ProductCategories: ProductCategories;
  Categories: Categories;
  ProductCategoriesWhereInput: ProductCategoriesWhereInput;
  ProductCategoriesOrderByInput: ProductCategoriesOrderByInput;
  CategoriesWhereInput: CategoriesWhereInput;
  CategoriesOrderByInput: CategoriesOrderByInput;
  ProductsWhereInput: ProductsWhereInput;
  ProductsOrderByInput: ProductsOrderByInput;
  Brands: Brands;
  BrandsWhereInput: BrandsWhereInput;
  BrandsOrderByInput: BrandsOrderByInput;
  PromotionVariants: PromotionVariants;
  Promotions: Promotions;
  PromotionVariantsWhereInput: PromotionVariantsWhereInput;
  PromotionVariantsOrderByInput: PromotionVariantsOrderByInput;
  PromotionsWhereInput: PromotionsWhereInput;
  PromotionsOrderByInput: PromotionsOrderByInput;
  VariantAttributeOptionsWhereInput: VariantAttributeOptionsWhereInput;
  VariantAttributeOptionsOrderByInput: VariantAttributeOptionsOrderByInput;
  VariantImages: VariantImages;
  VariantImagesWhereInput: VariantImagesWhereInput;
  VariantImagesOrderByInput: VariantImagesOrderByInput;
  Banner: Banner;
  BannerWhereInput: BannerWhereInput;
  BannerOrderByInput: BannerOrderByInput;
  OrderSummary: OrderSummary;
  BigInt: Scalars['BigInt']['output'];
  OrderSummaryWhereInput: OrderSummaryWhereInput;
  OrderSummaryOrderByInput: OrderSummaryOrderByInput;
  Permissions: Permissions;
  PermissionsWhereInput: PermissionsWhereInput;
  PermissionsOrderByInput: PermissionsOrderByInput;
  ProductRatingSummary: ProductRatingSummary;
  ProductRatingSummaryWhereInput: ProductRatingSummaryWhereInput;
  ProductRatingSummaryOrderByInput: ProductRatingSummaryOrderByInput;
  Roles: Roles;
  RolesSections: RolesSections;
  RolesWhereInput: RolesWhereInput;
  RolesOrderByInput: RolesOrderByInput;
  Sections: Sections;
  RolesSectionsWhereInput: RolesSectionsWhereInput;
  RolesSectionsOrderByInput: RolesSectionsOrderByInput;
  SectionsWhereInput: SectionsWhereInput;
  SectionsOrderByInput: SectionsOrderByInput;
  Users: Users;
  UsersWhereInput: UsersWhereInput;
  UsersOrderByInput: UsersOrderByInput;
  Services: Services;
  ServicesImages: ServicesImages;
  ServicesWhereInput: ServicesWhereInput;
  ServicesOrderByInput: ServicesOrderByInput;
  ServicesImagesWhereInput: ServicesImagesWhereInput;
  ServicesImagesOrderByInput: ServicesImagesOrderByInput;
  ShippingMethods: ShippingMethods;
  ShippingZoneMethods: ShippingZoneMethods;
  ShippingMethodsWhereInput: ShippingMethodsWhereInput;
  ShippingMethodsOrderByInput: ShippingMethodsOrderByInput;
  ShippingZones: ShippingZones;
  ShippingZoneMethodsWhereInput: ShippingZoneMethodsWhereInput;
  ShippingZoneMethodsOrderByInput: ShippingZoneMethodsOrderByInput;
  ShippingZonesWhereInput: ShippingZonesWhereInput;
  ShippingZonesOrderByInput: ShippingZonesOrderByInput;
  VariantRatingSummary: VariantRatingSummary;
  VariantRatingSummaryWhereInput: VariantRatingSummaryWhereInput;
  VariantRatingSummaryOrderByInput: VariantRatingSummaryOrderByInput;
  AttributeOptionImagesInsertInput: AttributeOptionImagesInsertInput;
  AttributeOptionImagesUpdateInput: AttributeOptionImagesUpdateInput;
  Boolean: Scalars['Boolean']['output'];
  AttributeOptionsInsertInput: AttributeOptionsInsertInput;
  AttributeOptionsUpdateInput: AttributeOptionsUpdateInput;
  AttributesInsertInput: AttributesInsertInput;
  AttributesUpdateInput: AttributesUpdateInput;
  BannerInsertInput: BannerInsertInput;
  BannerUpdateInput: BannerUpdateInput;
  BrandsInsertInput: BrandsInsertInput;
  BrandsUpdateInput: BrandsUpdateInput;
  CategoriesInsertInput: CategoriesInsertInput;
  CategoriesUpdateInput: CategoriesUpdateInput;
  CouponUsageInsertInput: CouponUsageInsertInput;
  CouponUsageUpdateInput: CouponUsageUpdateInput;
  CouponsInsertInput: CouponsInsertInput;
  CouponsUpdateInput: CouponsUpdateInput;
  CustomersInsertInput: CustomersInsertInput;
  CustomersUpdateInput: CustomersUpdateInput;
  CustomersAddressesInsertInput: CustomersAddressesInsertInput;
  CustomersAddressesUpdateInput: CustomersAddressesUpdateInput;
  OrderItemsInsertInput: OrderItemsInsertInput;
  OrderItemsUpdateInput: OrderItemsUpdateInput;
  OrderSummaryInsertInput: OrderSummaryInsertInput;
  OrderSummaryUpdateInput: OrderSummaryUpdateInput;
  OrderTrackingInsertInput: OrderTrackingInsertInput;
  OrderTrackingUpdateInput: OrderTrackingUpdateInput;
  OrdersInsertInput: OrdersInsertInput;
  OrdersUpdateInput: OrdersUpdateInput;
  PaymentMethodsInsertInput: PaymentMethodsInsertInput;
  PaymentMethodsUpdateInput: PaymentMethodsUpdateInput;
  PaymentTransactionsInsertInput: PaymentTransactionsInsertInput;
  PaymentTransactionsUpdateInput: PaymentTransactionsUpdateInput;
  PermissionsInsertInput: PermissionsInsertInput;
  PermissionsUpdateInput: PermissionsUpdateInput;
  ProductCategoriesInsertInput: ProductCategoriesInsertInput;
  ProductCategoriesUpdateInput: ProductCategoriesUpdateInput;
  ProductRatingSummaryInsertInput: ProductRatingSummaryInsertInput;
  ProductRatingSummaryUpdateInput: ProductRatingSummaryUpdateInput;
  ProductVariantsInsertInput: ProductVariantsInsertInput;
  ProductVariantsUpdateInput: ProductVariantsUpdateInput;
  ProductsInsertInput: ProductsInsertInput;
  ProductsUpdateInput: ProductsUpdateInput;
  PromotionVariantsInsertInput: PromotionVariantsInsertInput;
  PromotionVariantsUpdateInput: PromotionVariantsUpdateInput;
  PromotionsInsertInput: PromotionsInsertInput;
  PromotionsUpdateInput: PromotionsUpdateInput;
  RatingImagesInsertInput: RatingImagesInsertInput;
  RatingImagesUpdateInput: RatingImagesUpdateInput;
  RolesInsertInput: RolesInsertInput;
  RolesUpdateInput: RolesUpdateInput;
  RolesSectionsInsertInput: RolesSectionsInsertInput;
  RolesSectionsUpdateInput: RolesSectionsUpdateInput;
  SectionsInsertInput: SectionsInsertInput;
  SectionsUpdateInput: SectionsUpdateInput;
  ServicesInsertInput: ServicesInsertInput;
  ServicesUpdateInput: ServicesUpdateInput;
  ServicesImagesInsertInput: ServicesImagesInsertInput;
  ServicesImagesUpdateInput: ServicesImagesUpdateInput;
  ShippingMethodsInsertInput: ShippingMethodsInsertInput;
  ShippingMethodsUpdateInput: ShippingMethodsUpdateInput;
  ShippingZoneMethodsInsertInput: ShippingZoneMethodsInsertInput;
  ShippingZoneMethodsUpdateInput: ShippingZoneMethodsUpdateInput;
  ShippingZonesInsertInput: ShippingZonesInsertInput;
  ShippingZonesUpdateInput: ShippingZonesUpdateInput;
  UsersInsertInput: UsersInsertInput;
  UsersUpdateInput: UsersUpdateInput;
  VariantAttributeOptionsInsertInput: VariantAttributeOptionsInsertInput;
  VariantAttributeOptionsUpdateInput: VariantAttributeOptionsUpdateInput;
  VariantImagesInsertInput: VariantImagesInsertInput;
  VariantImagesUpdateInput: VariantImagesUpdateInput;
  VariantRatingSummaryInsertInput: VariantRatingSummaryInsertInput;
  VariantRatingSummaryUpdateInput: VariantRatingSummaryUpdateInput;
  VariantRatingsInsertInput: VariantRatingsInsertInput;
  VariantRatingsUpdateInput: VariantRatingsUpdateInput;
}>;

export type transportDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  kind?: Maybe<Scalars['String']['input']>;
  location?: Maybe<Scalars['String']['input']>;
};

export type transportDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = transportDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlSelectDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  table?: Maybe<Scalars['String']['input']>;
  columnMap?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']['input']>>>>>;
};

export type mysqlSelectDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlSelectDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlInsertDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  table?: Maybe<Scalars['String']['input']>;
  primaryKeys?: Maybe<Array<Maybe<Scalars['String']['input']>>>;
};

export type mysqlInsertDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlInsertDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlUpdateDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  table?: Maybe<Scalars['String']['input']>;
  columnMap?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']['input']>>>>>;
};

export type mysqlUpdateDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlUpdateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlDeleteDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  table?: Maybe<Scalars['String']['input']>;
};

export type mysqlDeleteDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlDeleteDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlTableForeignDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  columnName?: Maybe<Scalars['String']['input']>;
};

export type mysqlTableForeignDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlTableForeignDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type mysqlCountDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  table?: Maybe<Scalars['String']['input']>;
};

export type mysqlCountDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = mysqlCountDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  attributeOptionImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptionImages']>>>, ParentType, ContextType, Partial<QueryattributeOptionImagesArgs>>;
  countAttributeOptionImages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountAttributeOptionImagesArgs>>;
  attributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptions']>>>, ParentType, ContextType, Partial<QueryattributeOptionsArgs>>;
  countAttributeOptions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountAttributeOptionsArgs>>;
  attributes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attributes']>>>, ParentType, ContextType, Partial<QueryattributesArgs>>;
  countAttributes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountAttributesArgs>>;
  banner?: Resolver<Maybe<Array<Maybe<ResolversTypes['Banner']>>>, ParentType, ContextType, Partial<QuerybannerArgs>>;
  countBanner?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountBannerArgs>>;
  brands?: Resolver<Maybe<Array<Maybe<ResolversTypes['Brands']>>>, ParentType, ContextType, Partial<QuerybrandsArgs>>;
  countBrands?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountBrandsArgs>>;
  categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Categories']>>>, ParentType, ContextType, Partial<QuerycategoriesArgs>>;
  countCategories?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountCategoriesArgs>>;
  couponUsage?: Resolver<Maybe<Array<Maybe<ResolversTypes['CouponUsage']>>>, ParentType, ContextType, Partial<QuerycouponUsageArgs>>;
  countCouponUsage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountCouponUsageArgs>>;
  coupons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Coupons']>>>, ParentType, ContextType, Partial<QuerycouponsArgs>>;
  countCoupons?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountCouponsArgs>>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customers']>>>, ParentType, ContextType, Partial<QuerycustomersArgs>>;
  countCustomers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountCustomersArgs>>;
  customersAddresses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomersAddresses']>>>, ParentType, ContextType, Partial<QuerycustomersAddressesArgs>>;
  countCustomersAddresses?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountCustomersAddressesArgs>>;
  orderItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderItems']>>>, ParentType, ContextType, Partial<QueryorderItemsArgs>>;
  countOrderItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountOrderItemsArgs>>;
  orderSummary?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderSummary']>>>, ParentType, ContextType, Partial<QueryorderSummaryArgs>>;
  countOrderSummary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountOrderSummaryArgs>>;
  orderTracking?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderTracking']>>>, ParentType, ContextType, Partial<QueryorderTrackingArgs>>;
  countOrderTracking?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountOrderTrackingArgs>>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<QueryordersArgs>>;
  countOrders?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountOrdersArgs>>;
  paymentMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentMethods']>>>, ParentType, ContextType, Partial<QuerypaymentMethodsArgs>>;
  countPaymentMethods?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountPaymentMethodsArgs>>;
  paymentTransactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentTransactions']>>>, ParentType, ContextType, Partial<QuerypaymentTransactionsArgs>>;
  countPaymentTransactions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountPaymentTransactionsArgs>>;
  permissions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Permissions']>>>, ParentType, ContextType, Partial<QuerypermissionsArgs>>;
  countPermissions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountPermissionsArgs>>;
  productCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductCategories']>>>, ParentType, ContextType, Partial<QueryproductCategoriesArgs>>;
  countProductCategories?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountProductCategoriesArgs>>;
  productRatingSummary?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductRatingSummary']>>>, ParentType, ContextType, Partial<QueryproductRatingSummaryArgs>>;
  countProductRatingSummary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountProductRatingSummaryArgs>>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<QueryproductVariantsArgs>>;
  countProductVariants?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountProductVariantsArgs>>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Products']>>>, ParentType, ContextType, Partial<QueryproductsArgs>>;
  countProducts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountProductsArgs>>;
  promotionVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['PromotionVariants']>>>, ParentType, ContextType, Partial<QuerypromotionVariantsArgs>>;
  countPromotionVariants?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountPromotionVariantsArgs>>;
  promotions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Promotions']>>>, ParentType, ContextType, Partial<QuerypromotionsArgs>>;
  countPromotions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountPromotionsArgs>>;
  ratingImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['RatingImages']>>>, ParentType, ContextType, Partial<QueryratingImagesArgs>>;
  countRatingImages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountRatingImagesArgs>>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Roles']>>>, ParentType, ContextType, Partial<QueryrolesArgs>>;
  countRoles?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountRolesArgs>>;
  rolesSections?: Resolver<Maybe<Array<Maybe<ResolversTypes['RolesSections']>>>, ParentType, ContextType, Partial<QueryrolesSectionsArgs>>;
  countRolesSections?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountRolesSectionsArgs>>;
  sections?: Resolver<Maybe<Array<Maybe<ResolversTypes['Sections']>>>, ParentType, ContextType, Partial<QuerysectionsArgs>>;
  countSections?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountSectionsArgs>>;
  services?: Resolver<Maybe<Array<Maybe<ResolversTypes['Services']>>>, ParentType, ContextType, Partial<QueryservicesArgs>>;
  countServices?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountServicesArgs>>;
  servicesImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['ServicesImages']>>>, ParentType, ContextType, Partial<QueryservicesImagesArgs>>;
  countServicesImages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountServicesImagesArgs>>;
  shippingMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingMethods']>>>, ParentType, ContextType, Partial<QueryshippingMethodsArgs>>;
  countShippingMethods?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountShippingMethodsArgs>>;
  shippingZoneMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingZoneMethods']>>>, ParentType, ContextType, Partial<QueryshippingZoneMethodsArgs>>;
  countShippingZoneMethods?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountShippingZoneMethodsArgs>>;
  shippingZones?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingZones']>>>, ParentType, ContextType, Partial<QueryshippingZonesArgs>>;
  countShippingZones?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountShippingZonesArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['Users']>>>, ParentType, ContextType, Partial<QueryusersArgs>>;
  countUsers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountUsersArgs>>;
  variantAttributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantAttributeOptions']>>>, ParentType, ContextType, Partial<QueryvariantAttributeOptionsArgs>>;
  countVariantAttributeOptions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountVariantAttributeOptionsArgs>>;
  variantImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantImages']>>>, ParentType, ContextType, Partial<QueryvariantImagesArgs>>;
  countVariantImages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountVariantImagesArgs>>;
  variantRatingSummary?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantRatingSummary']>>>, ParentType, ContextType, Partial<QueryvariantRatingSummaryArgs>>;
  countVariantRatingSummary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountVariantRatingSummaryArgs>>;
  variantRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantRatings']>>>, ParentType, ContextType, Partial<QueryvariantRatingsArgs>>;
  countVariantRatings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QuerycountVariantRatingsArgs>>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  insertAttributeOptionImages?: Resolver<Maybe<ResolversTypes['AttributeOptionImages']>, ParentType, ContextType, RequireFields<MutationinsertAttributeOptionImagesArgs, 'attribute_option_images'>>;
  updateAttributeOptionImages?: Resolver<Maybe<ResolversTypes['AttributeOptionImages']>, ParentType, ContextType, RequireFields<MutationupdateAttributeOptionImagesArgs, 'attribute_option_images'>>;
  deleteAttributeOptionImages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteAttributeOptionImagesArgs>>;
  insertAttributeOptions?: Resolver<Maybe<ResolversTypes['AttributeOptions']>, ParentType, ContextType, RequireFields<MutationinsertAttributeOptionsArgs, 'attribute_options'>>;
  updateAttributeOptions?: Resolver<Maybe<ResolversTypes['AttributeOptions']>, ParentType, ContextType, RequireFields<MutationupdateAttributeOptionsArgs, 'attribute_options'>>;
  deleteAttributeOptions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteAttributeOptionsArgs>>;
  insertAttributes?: Resolver<Maybe<ResolversTypes['Attributes']>, ParentType, ContextType, RequireFields<MutationinsertAttributesArgs, 'attributes'>>;
  updateAttributes?: Resolver<Maybe<ResolversTypes['Attributes']>, ParentType, ContextType, RequireFields<MutationupdateAttributesArgs, 'attributes'>>;
  deleteAttributes?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteAttributesArgs>>;
  insertBanner?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<MutationinsertBannerArgs, 'banner'>>;
  updateBanner?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<MutationupdateBannerArgs, 'banner'>>;
  deleteBanner?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteBannerArgs>>;
  insertBrands?: Resolver<Maybe<ResolversTypes['Brands']>, ParentType, ContextType, RequireFields<MutationinsertBrandsArgs, 'brands'>>;
  updateBrands?: Resolver<Maybe<ResolversTypes['Brands']>, ParentType, ContextType, RequireFields<MutationupdateBrandsArgs, 'brands'>>;
  deleteBrands?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteBrandsArgs>>;
  insertCategories?: Resolver<Maybe<ResolversTypes['Categories']>, ParentType, ContextType, RequireFields<MutationinsertCategoriesArgs, 'categories'>>;
  updateCategories?: Resolver<Maybe<ResolversTypes['Categories']>, ParentType, ContextType, RequireFields<MutationupdateCategoriesArgs, 'categories'>>;
  deleteCategories?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteCategoriesArgs>>;
  insertCouponUsage?: Resolver<Maybe<ResolversTypes['CouponUsage']>, ParentType, ContextType, RequireFields<MutationinsertCouponUsageArgs, 'coupon_usage'>>;
  updateCouponUsage?: Resolver<Maybe<ResolversTypes['CouponUsage']>, ParentType, ContextType, RequireFields<MutationupdateCouponUsageArgs, 'coupon_usage'>>;
  deleteCouponUsage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteCouponUsageArgs>>;
  insertCoupons?: Resolver<Maybe<ResolversTypes['Coupons']>, ParentType, ContextType, RequireFields<MutationinsertCouponsArgs, 'coupons'>>;
  updateCoupons?: Resolver<Maybe<ResolversTypes['Coupons']>, ParentType, ContextType, RequireFields<MutationupdateCouponsArgs, 'coupons'>>;
  deleteCoupons?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteCouponsArgs>>;
  insertCustomers?: Resolver<Maybe<ResolversTypes['Customers']>, ParentType, ContextType, RequireFields<MutationinsertCustomersArgs, 'customers'>>;
  updateCustomers?: Resolver<Maybe<ResolversTypes['Customers']>, ParentType, ContextType, RequireFields<MutationupdateCustomersArgs, 'customers'>>;
  deleteCustomers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteCustomersArgs>>;
  insertCustomersAddresses?: Resolver<Maybe<ResolversTypes['CustomersAddresses']>, ParentType, ContextType, RequireFields<MutationinsertCustomersAddressesArgs, 'customers_addresses'>>;
  updateCustomersAddresses?: Resolver<Maybe<ResolversTypes['CustomersAddresses']>, ParentType, ContextType, RequireFields<MutationupdateCustomersAddressesArgs, 'customers_addresses'>>;
  deleteCustomersAddresses?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteCustomersAddressesArgs>>;
  insertOrderItems?: Resolver<Maybe<ResolversTypes['OrderItems']>, ParentType, ContextType, RequireFields<MutationinsertOrderItemsArgs, 'order_items'>>;
  updateOrderItems?: Resolver<Maybe<ResolversTypes['OrderItems']>, ParentType, ContextType, RequireFields<MutationupdateOrderItemsArgs, 'order_items'>>;
  deleteOrderItems?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteOrderItemsArgs>>;
  insertOrderSummary?: Resolver<Maybe<ResolversTypes['OrderSummary']>, ParentType, ContextType, RequireFields<MutationinsertOrderSummaryArgs, 'order_summary'>>;
  updateOrderSummary?: Resolver<Maybe<ResolversTypes['OrderSummary']>, ParentType, ContextType, RequireFields<MutationupdateOrderSummaryArgs, 'order_summary'>>;
  deleteOrderSummary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteOrderSummaryArgs>>;
  insertOrderTracking?: Resolver<Maybe<ResolversTypes['OrderTracking']>, ParentType, ContextType, RequireFields<MutationinsertOrderTrackingArgs, 'order_tracking'>>;
  updateOrderTracking?: Resolver<Maybe<ResolversTypes['OrderTracking']>, ParentType, ContextType, RequireFields<MutationupdateOrderTrackingArgs, 'order_tracking'>>;
  deleteOrderTracking?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteOrderTrackingArgs>>;
  insertOrders?: Resolver<Maybe<ResolversTypes['Orders']>, ParentType, ContextType, RequireFields<MutationinsertOrdersArgs, 'orders'>>;
  updateOrders?: Resolver<Maybe<ResolversTypes['Orders']>, ParentType, ContextType, RequireFields<MutationupdateOrdersArgs, 'orders'>>;
  deleteOrders?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteOrdersArgs>>;
  insertPaymentMethods?: Resolver<Maybe<ResolversTypes['PaymentMethods']>, ParentType, ContextType, RequireFields<MutationinsertPaymentMethodsArgs, 'payment_methods'>>;
  updatePaymentMethods?: Resolver<Maybe<ResolversTypes['PaymentMethods']>, ParentType, ContextType, RequireFields<MutationupdatePaymentMethodsArgs, 'payment_methods'>>;
  deletePaymentMethods?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeletePaymentMethodsArgs>>;
  insertPaymentTransactions?: Resolver<Maybe<ResolversTypes['PaymentTransactions']>, ParentType, ContextType, RequireFields<MutationinsertPaymentTransactionsArgs, 'payment_transactions'>>;
  updatePaymentTransactions?: Resolver<Maybe<ResolversTypes['PaymentTransactions']>, ParentType, ContextType, RequireFields<MutationupdatePaymentTransactionsArgs, 'payment_transactions'>>;
  deletePaymentTransactions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeletePaymentTransactionsArgs>>;
  insertPermissions?: Resolver<Maybe<ResolversTypes['Permissions']>, ParentType, ContextType, RequireFields<MutationinsertPermissionsArgs, 'permissions'>>;
  updatePermissions?: Resolver<Maybe<ResolversTypes['Permissions']>, ParentType, ContextType, RequireFields<MutationupdatePermissionsArgs, 'permissions'>>;
  deletePermissions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeletePermissionsArgs>>;
  insertProductCategories?: Resolver<Maybe<ResolversTypes['ProductCategories']>, ParentType, ContextType, RequireFields<MutationinsertProductCategoriesArgs, 'product_categories'>>;
  updateProductCategories?: Resolver<Maybe<ResolversTypes['ProductCategories']>, ParentType, ContextType, RequireFields<MutationupdateProductCategoriesArgs, 'product_categories'>>;
  deleteProductCategories?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteProductCategoriesArgs>>;
  insertProductRatingSummary?: Resolver<Maybe<ResolversTypes['ProductRatingSummary']>, ParentType, ContextType, RequireFields<MutationinsertProductRatingSummaryArgs, 'product_rating_summary'>>;
  updateProductRatingSummary?: Resolver<Maybe<ResolversTypes['ProductRatingSummary']>, ParentType, ContextType, RequireFields<MutationupdateProductRatingSummaryArgs, 'product_rating_summary'>>;
  deleteProductRatingSummary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteProductRatingSummaryArgs>>;
  insertProductVariants?: Resolver<Maybe<ResolversTypes['ProductVariants']>, ParentType, ContextType, RequireFields<MutationinsertProductVariantsArgs, 'product_variants'>>;
  updateProductVariants?: Resolver<Maybe<ResolversTypes['ProductVariants']>, ParentType, ContextType, RequireFields<MutationupdateProductVariantsArgs, 'product_variants'>>;
  deleteProductVariants?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteProductVariantsArgs>>;
  insertProducts?: Resolver<Maybe<ResolversTypes['Products']>, ParentType, ContextType, RequireFields<MutationinsertProductsArgs, 'products'>>;
  updateProducts?: Resolver<Maybe<ResolversTypes['Products']>, ParentType, ContextType, RequireFields<MutationupdateProductsArgs, 'products'>>;
  deleteProducts?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteProductsArgs>>;
  insertPromotionVariants?: Resolver<Maybe<ResolversTypes['PromotionVariants']>, ParentType, ContextType, RequireFields<MutationinsertPromotionVariantsArgs, 'promotion_variants'>>;
  updatePromotionVariants?: Resolver<Maybe<ResolversTypes['PromotionVariants']>, ParentType, ContextType, RequireFields<MutationupdatePromotionVariantsArgs, 'promotion_variants'>>;
  deletePromotionVariants?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeletePromotionVariantsArgs>>;
  insertPromotions?: Resolver<Maybe<ResolversTypes['Promotions']>, ParentType, ContextType, RequireFields<MutationinsertPromotionsArgs, 'promotions'>>;
  updatePromotions?: Resolver<Maybe<ResolversTypes['Promotions']>, ParentType, ContextType, RequireFields<MutationupdatePromotionsArgs, 'promotions'>>;
  deletePromotions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeletePromotionsArgs>>;
  insertRatingImages?: Resolver<Maybe<ResolversTypes['RatingImages']>, ParentType, ContextType, RequireFields<MutationinsertRatingImagesArgs, 'rating_images'>>;
  updateRatingImages?: Resolver<Maybe<ResolversTypes['RatingImages']>, ParentType, ContextType, RequireFields<MutationupdateRatingImagesArgs, 'rating_images'>>;
  deleteRatingImages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteRatingImagesArgs>>;
  insertRoles?: Resolver<Maybe<ResolversTypes['Roles']>, ParentType, ContextType, RequireFields<MutationinsertRolesArgs, 'roles'>>;
  updateRoles?: Resolver<Maybe<ResolversTypes['Roles']>, ParentType, ContextType, RequireFields<MutationupdateRolesArgs, 'roles'>>;
  deleteRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteRolesArgs>>;
  insertRolesSections?: Resolver<Maybe<ResolversTypes['RolesSections']>, ParentType, ContextType, RequireFields<MutationinsertRolesSectionsArgs, 'roles_sections'>>;
  updateRolesSections?: Resolver<Maybe<ResolversTypes['RolesSections']>, ParentType, ContextType, RequireFields<MutationupdateRolesSectionsArgs, 'roles_sections'>>;
  deleteRolesSections?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteRolesSectionsArgs>>;
  insertSections?: Resolver<Maybe<ResolversTypes['Sections']>, ParentType, ContextType, RequireFields<MutationinsertSectionsArgs, 'sections'>>;
  updateSections?: Resolver<Maybe<ResolversTypes['Sections']>, ParentType, ContextType, RequireFields<MutationupdateSectionsArgs, 'sections'>>;
  deleteSections?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteSectionsArgs>>;
  insertServices?: Resolver<Maybe<ResolversTypes['Services']>, ParentType, ContextType, RequireFields<MutationinsertServicesArgs, 'services'>>;
  updateServices?: Resolver<Maybe<ResolversTypes['Services']>, ParentType, ContextType, RequireFields<MutationupdateServicesArgs, 'services'>>;
  deleteServices?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteServicesArgs>>;
  insertServicesImages?: Resolver<Maybe<ResolversTypes['ServicesImages']>, ParentType, ContextType, RequireFields<MutationinsertServicesImagesArgs, 'services_images'>>;
  updateServicesImages?: Resolver<Maybe<ResolversTypes['ServicesImages']>, ParentType, ContextType, RequireFields<MutationupdateServicesImagesArgs, 'services_images'>>;
  deleteServicesImages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteServicesImagesArgs>>;
  insertShippingMethods?: Resolver<Maybe<ResolversTypes['ShippingMethods']>, ParentType, ContextType, RequireFields<MutationinsertShippingMethodsArgs, 'shipping_methods'>>;
  updateShippingMethods?: Resolver<Maybe<ResolversTypes['ShippingMethods']>, ParentType, ContextType, RequireFields<MutationupdateShippingMethodsArgs, 'shipping_methods'>>;
  deleteShippingMethods?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteShippingMethodsArgs>>;
  insertShippingZoneMethods?: Resolver<Maybe<ResolversTypes['ShippingZoneMethods']>, ParentType, ContextType, RequireFields<MutationinsertShippingZoneMethodsArgs, 'shipping_zone_methods'>>;
  updateShippingZoneMethods?: Resolver<Maybe<ResolversTypes['ShippingZoneMethods']>, ParentType, ContextType, RequireFields<MutationupdateShippingZoneMethodsArgs, 'shipping_zone_methods'>>;
  deleteShippingZoneMethods?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteShippingZoneMethodsArgs>>;
  insertShippingZones?: Resolver<Maybe<ResolversTypes['ShippingZones']>, ParentType, ContextType, RequireFields<MutationinsertShippingZonesArgs, 'shipping_zones'>>;
  updateShippingZones?: Resolver<Maybe<ResolversTypes['ShippingZones']>, ParentType, ContextType, RequireFields<MutationupdateShippingZonesArgs, 'shipping_zones'>>;
  deleteShippingZones?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteShippingZonesArgs>>;
  insertUsers?: Resolver<Maybe<ResolversTypes['Users']>, ParentType, ContextType, RequireFields<MutationinsertUsersArgs, 'users'>>;
  updateUsers?: Resolver<Maybe<ResolversTypes['Users']>, ParentType, ContextType, RequireFields<MutationupdateUsersArgs, 'users'>>;
  deleteUsers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteUsersArgs>>;
  insertVariantAttributeOptions?: Resolver<Maybe<ResolversTypes['VariantAttributeOptions']>, ParentType, ContextType, RequireFields<MutationinsertVariantAttributeOptionsArgs, 'variant_attribute_options'>>;
  updateVariantAttributeOptions?: Resolver<Maybe<ResolversTypes['VariantAttributeOptions']>, ParentType, ContextType, RequireFields<MutationupdateVariantAttributeOptionsArgs, 'variant_attribute_options'>>;
  deleteVariantAttributeOptions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteVariantAttributeOptionsArgs>>;
  insertVariantImages?: Resolver<Maybe<ResolversTypes['VariantImages']>, ParentType, ContextType, RequireFields<MutationinsertVariantImagesArgs, 'variant_images'>>;
  updateVariantImages?: Resolver<Maybe<ResolversTypes['VariantImages']>, ParentType, ContextType, RequireFields<MutationupdateVariantImagesArgs, 'variant_images'>>;
  deleteVariantImages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteVariantImagesArgs>>;
  insertVariantRatingSummary?: Resolver<Maybe<ResolversTypes['VariantRatingSummary']>, ParentType, ContextType, RequireFields<MutationinsertVariantRatingSummaryArgs, 'variant_rating_summary'>>;
  updateVariantRatingSummary?: Resolver<Maybe<ResolversTypes['VariantRatingSummary']>, ParentType, ContextType, RequireFields<MutationupdateVariantRatingSummaryArgs, 'variant_rating_summary'>>;
  deleteVariantRatingSummary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteVariantRatingSummaryArgs>>;
  insertVariantRatings?: Resolver<Maybe<ResolversTypes['VariantRatings']>, ParentType, ContextType, RequireFields<MutationinsertVariantRatingsArgs, 'variant_ratings'>>;
  updateVariantRatings?: Resolver<Maybe<ResolversTypes['VariantRatings']>, ParentType, ContextType, RequireFields<MutationupdateVariantRatingsArgs, 'variant_ratings'>>;
  deleteVariantRatings?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationdeleteVariantRatingsArgs>>;
}>;

export type AttributeOptionImagesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AttributeOptionImages'] = ResolversParentTypes['AttributeOptionImages']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  attributeOptionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageType?: Resolver<ResolversTypes['AttributeOptionImagesImageType'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  imageUrlThumb?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrlNormal?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrlZoom?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  altText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  isPrimary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  attributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptions']>>>, ParentType, ContextType, Partial<AttributeOptionImagesattributeOptionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type AttributeOptionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AttributeOptions'] = ResolversParentTypes['AttributeOptions']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  attributeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  additionalCost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  attributeOptionImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptionImages']>>>, ParentType, ContextType, Partial<AttributeOptionsattributeOptionImagesArgs>>;
  attributes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attributes']>>>, ParentType, ContextType, Partial<AttributeOptionsattributesArgs>>;
  variantAttributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantAttributeOptions']>>>, ParentType, ContextType, Partial<AttributeOptionsvariantAttributeOptionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AttributesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Attributes'] = ResolversParentTypes['Attributes']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayType?: Resolver<ResolversTypes['AttributesDisplayType'], ParentType, ContextType>;
  attributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptions']>>>, ParentType, ContextType, Partial<AttributesattributeOptionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariantAttributeOptionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VariantAttributeOptions'] = ResolversParentTypes['VariantAttributeOptions']> = ResolversObject<{
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  attributeOptionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  attributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['AttributeOptions']>>>, ParentType, ContextType, Partial<VariantAttributeOptionsattributeOptionsArgs>>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<VariantAttributeOptionsproductVariantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductVariantsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ProductVariants'] = ResolversParentTypes['ProductVariants']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  orderItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderItems']>>>, ParentType, ContextType, Partial<ProductVariantsorderItemsArgs>>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Products']>>>, ParentType, ContextType, Partial<ProductVariantsproductsArgs>>;
  promotionVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['PromotionVariants']>>>, ParentType, ContextType, Partial<ProductVariantspromotionVariantsArgs>>;
  variantAttributeOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantAttributeOptions']>>>, ParentType, ContextType, Partial<ProductVariantsvariantAttributeOptionsArgs>>;
  variantImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantImages']>>>, ParentType, ContextType, Partial<ProductVariantsvariantImagesArgs>>;
  variantRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantRatings']>>>, ParentType, ContextType, Partial<ProductVariantsvariantRatingsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderItemsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrderItems'] = ResolversParentTypes['OrderItems']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variantSku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variantAttributes?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  discountAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<OrderItemsordersArgs>>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<OrderItemsproductVariantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type OrdersResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Orders'] = ResolversParentTypes['Orders']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrdersStatus'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  discountAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  shippingCost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  taxAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shippingAddressId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shippingMethod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedDelivery?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  paymentMethod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['OrdersPaymentStatus'], ParentType, ContextType>;
  paidAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  customerNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  adminNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  couponUsage?: Resolver<Maybe<Array<Maybe<ResolversTypes['CouponUsage']>>>, ParentType, ContextType, Partial<OrderscouponUsageArgs>>;
  orderItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderItems']>>>, ParentType, ContextType, Partial<OrdersorderItemsArgs>>;
  orderTracking?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderTracking']>>>, ParentType, ContextType, Partial<OrdersorderTrackingArgs>>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customers']>>>, ParentType, ContextType, Partial<OrderscustomersArgs>>;
  customersAddresses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomersAddresses']>>>, ParentType, ContextType, Partial<OrderscustomersAddressesArgs>>;
  paymentTransactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentTransactions']>>>, ParentType, ContextType, Partial<OrderspaymentTransactionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type CouponUsageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CouponUsage'] = ResolversParentTypes['CouponUsage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  couponId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  discountAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  usedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  coupons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Coupons']>>>, ParentType, ContextType, Partial<CouponUsagecouponsArgs>>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customers']>>>, ParentType, ContextType, Partial<CouponUsagecustomersArgs>>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<CouponUsageordersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CouponsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Coupons'] = ResolversParentTypes['Coupons']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discountType?: Resolver<ResolversTypes['CouponsDiscountType'], ParentType, ContextType>;
  discountValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minPurchaseAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  maxDiscountAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  usageLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usageLimitPerCustomer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usedCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  applicableTo?: Resolver<Maybe<ResolversTypes['CouponsApplicableTo']>, ParentType, ContextType>;
  applicableIds?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  couponUsage?: Resolver<Maybe<Array<Maybe<ResolversTypes['CouponUsage']>>>, ParentType, ContextType, Partial<CouponscouponUsageArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type CustomersResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Customers'] = ResolversParentTypes['Customers']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dni?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  couponUsage?: Resolver<Maybe<Array<Maybe<ResolversTypes['CouponUsage']>>>, ParentType, ContextType, Partial<CustomerscouponUsageArgs>>;
  customersAddresses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomersAddresses']>>>, ParentType, ContextType, Partial<CustomerscustomersAddressesArgs>>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<CustomersordersArgs>>;
  variantRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantRatings']>>>, ParentType, ContextType, Partial<CustomersvariantRatingsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomersAddressesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CustomersAddresses'] = ResolversParentTypes['CustomersAddresses']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idCustomer?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  province?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  district?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streetName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streetNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  apartment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  isDefault?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customers']>>>, ParentType, ContextType, Partial<CustomersAddressescustomersArgs>>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<CustomersAddressesordersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariantRatingsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VariantRatings'] = ResolversParentTypes['VariantRatings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verifiedPurchase?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  ratingImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['RatingImages']>>>, ParentType, ContextType, Partial<VariantRatingsratingImagesArgs>>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customers']>>>, ParentType, ContextType, Partial<VariantRatingscustomersArgs>>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<VariantRatingsproductVariantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RatingImagesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RatingImages'] = ResolversParentTypes['RatingImages']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ratingId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  variantRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VariantRatings']>>>, ParentType, ContextType, Partial<RatingImagesvariantRatingsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderTrackingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrderTracking'] = ResolversParentTypes['OrderTracking']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courierCompany?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderTrackingStatus'], ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shippedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deliveredAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deliveredTo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveryNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<OrderTrackingordersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentTransactionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PaymentTransactions'] = ResolversParentTypes['PaymentTransactions']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  paymentMethodId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referenceNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  processingFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  netAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['PaymentTransactionsStatus']>, ParentType, ContextType>;
  paymentData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  gatewayResponse?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  processedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Orders']>>>, ParentType, ContextType, Partial<PaymentTransactionsordersArgs>>;
  paymentMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentMethods']>>>, ParentType, ContextType, Partial<PaymentTransactionspaymentMethodsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentMethodsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PaymentMethods'] = ResolversParentTypes['PaymentMethods']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  processingFeeType?: Resolver<Maybe<ResolversTypes['PaymentMethodsProcessingFeeType']>, ParentType, ContextType>;
  processingFeeValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  minAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  maxAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requiresVerification?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  paymentTransactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentTransactions']>>>, ParentType, ContextType, Partial<PaymentMethodspaymentTransactionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Products'] = ResolversParentTypes['Products']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brandId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  basePrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  productCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductCategories']>>>, ParentType, ContextType, Partial<ProductsproductCategoriesArgs>>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<ProductsproductVariantsArgs>>;
  brands?: Resolver<Maybe<Array<Maybe<ResolversTypes['Brands']>>>, ParentType, ContextType, Partial<ProductsbrandsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductCategoriesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ProductCategories'] = ResolversParentTypes['ProductCategories']> = ResolversObject<{
  productId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  categoryId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Categories']>>>, ParentType, ContextType, Partial<ProductCategoriescategoriesArgs>>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Products']>>>, ParentType, ContextType, Partial<ProductCategoriesproductsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoriesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Categories'] = ResolversParentTypes['Categories']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  productCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductCategories']>>>, ParentType, ContextType, Partial<CategoriesproductCategoriesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BrandsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Brands'] = ResolversParentTypes['Brands']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Products']>>>, ParentType, ContextType, Partial<BrandsproductsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PromotionVariantsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PromotionVariants'] = ResolversParentTypes['PromotionVariants']> = ResolversObject<{
  promotionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  promotionPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  stockLimit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<PromotionVariantsproductVariantsArgs>>;
  promotions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Promotions']>>>, ParentType, ContextType, Partial<PromotionVariantspromotionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PromotionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Promotions'] = ResolversParentTypes['Promotions']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  discountType?: Resolver<ResolversTypes['PromotionsDiscountType'], ParentType, ContextType>;
  discountValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minPurchaseAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  promotionVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['PromotionVariants']>>>, ParentType, ContextType, Partial<PromotionspromotionVariantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariantImagesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VariantImages'] = ResolversParentTypes['VariantImages']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageType?: Resolver<ResolversTypes['VariantImagesImageType'], ParentType, ContextType>;
  imageUrlThumb?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrlNormal?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrlZoom?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPrimary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  altText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  productVariants?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductVariants']>>>, ParentType, ContextType, Partial<VariantImagesproductVariantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BannerResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Banner'] = ResolversParentTypes['Banner']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderSummaryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrderSummary'] = ResolversParentTypes['OrderSummary']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderSummaryStatus'], ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['OrderSummaryPaymentStatus'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  estimatedDelivery?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalQuantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courierCompany?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type PermissionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Permissions'] = ResolversParentTypes['Permissions']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductRatingSummaryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ProductRatingSummary'] = ResolversParentTypes['ProductRatingSummary']> = ResolversObject<{
  productId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRatings?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  averageRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fiveStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fourStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  threeStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  twoStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  oneStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  verifiedPurchases?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RolesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Roles'] = ResolversParentTypes['Roles']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  rolesSections?: Resolver<Maybe<Array<Maybe<ResolversTypes['RolesSections']>>>, ParentType, ContextType, Partial<RolesrolesSectionsArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['Users']>>>, ParentType, ContextType, Partial<RolesusersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RolesSectionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RolesSections'] = ResolversParentTypes['RolesSections']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idSection?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  idRol?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Roles']>>>, ParentType, ContextType, Partial<RolesSectionsrolesArgs>>;
  sections?: Resolver<Maybe<Array<Maybe<ResolversTypes['Sections']>>>, ParentType, ContextType, Partial<RolesSectionssectionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SectionsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Sections'] = ResolversParentTypes['Sections']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  rolesSections?: Resolver<Maybe<Array<Maybe<ResolversTypes['RolesSections']>>>, ParentType, ContextType, Partial<SectionsrolesSectionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Users'] = ResolversParentTypes['Users']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Roles']>>>, ParentType, ContextType, Partial<UsersrolesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ServicesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Services'] = ResolversParentTypes['Services']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  servicesImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['ServicesImages']>>>, ParentType, ContextType, Partial<ServicesservicesImagesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ServicesImagesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ServicesImages'] = ResolversParentTypes['ServicesImages']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  idService?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  services?: Resolver<Maybe<Array<Maybe<ResolversTypes['Services']>>>, ParentType, ContextType, Partial<ServicesImagesservicesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShippingMethodsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ShippingMethods'] = ResolversParentTypes['ShippingMethods']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  baseCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  freeShippingThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  estimatedDaysMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  estimatedDaysMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  shippingZoneMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingZoneMethods']>>>, ParentType, ContextType, Partial<ShippingMethodsshippingZoneMethodsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShippingZoneMethodsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ShippingZoneMethods'] = ResolversParentTypes['ShippingZoneMethods']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shippingMethodId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shippingZoneId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  freeShippingThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  estimatedDaysMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  estimatedDaysMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  shippingMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingMethods']>>>, ParentType, ContextType, Partial<ShippingZoneMethodsshippingMethodsArgs>>;
  shippingZones?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingZones']>>>, ParentType, ContextType, Partial<ShippingZoneMethodsshippingZonesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShippingZonesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ShippingZones'] = ResolversParentTypes['ShippingZones']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  districts?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  shippingZoneMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShippingZoneMethods']>>>, ParentType, ContextType, Partial<ShippingZonesshippingZoneMethodsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariantRatingSummaryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VariantRatingSummary'] = ResolversParentTypes['VariantRatingSummary']> = ResolversObject<{
  variantId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRatings?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  averageRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fiveStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fourStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  threeStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  twoStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  oneStar?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  verifiedPurchases?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  AttributeOptionImages?: AttributeOptionImagesResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  AttributeOptions?: AttributeOptionsResolvers<ContextType>;
  Attributes?: AttributesResolvers<ContextType>;
  VariantAttributeOptions?: VariantAttributeOptionsResolvers<ContextType>;
  ProductVariants?: ProductVariantsResolvers<ContextType>;
  OrderItems?: OrderItemsResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Orders?: OrdersResolvers<ContextType>;
  Date?: GraphQLScalarType;
  CouponUsage?: CouponUsageResolvers<ContextType>;
  Coupons?: CouponsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Customers?: CustomersResolvers<ContextType>;
  CustomersAddresses?: CustomersAddressesResolvers<ContextType>;
  VariantRatings?: VariantRatingsResolvers<ContextType>;
  RatingImages?: RatingImagesResolvers<ContextType>;
  OrderTracking?: OrderTrackingResolvers<ContextType>;
  PaymentTransactions?: PaymentTransactionsResolvers<ContextType>;
  PaymentMethods?: PaymentMethodsResolvers<ContextType>;
  Products?: ProductsResolvers<ContextType>;
  ProductCategories?: ProductCategoriesResolvers<ContextType>;
  Categories?: CategoriesResolvers<ContextType>;
  Brands?: BrandsResolvers<ContextType>;
  PromotionVariants?: PromotionVariantsResolvers<ContextType>;
  Promotions?: PromotionsResolvers<ContextType>;
  VariantImages?: VariantImagesResolvers<ContextType>;
  Banner?: BannerResolvers<ContextType>;
  OrderSummary?: OrderSummaryResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Permissions?: PermissionsResolvers<ContextType>;
  ProductRatingSummary?: ProductRatingSummaryResolvers<ContextType>;
  Roles?: RolesResolvers<ContextType>;
  RolesSections?: RolesSectionsResolvers<ContextType>;
  Sections?: SectionsResolvers<ContextType>;
  Users?: UsersResolvers<ContextType>;
  Services?: ServicesResolvers<ContextType>;
  ServicesImages?: ServicesImagesResolvers<ContextType>;
  ShippingMethods?: ShippingMethodsResolvers<ContextType>;
  ShippingZoneMethods?: ShippingZoneMethodsResolvers<ContextType>;
  ShippingZones?: ShippingZonesResolvers<ContextType>;
  VariantRatingSummary?: VariantRatingSummaryResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  transport?: transportDirectiveResolver<any, any, ContextType>;
  mysqlSelect?: mysqlSelectDirectiveResolver<any, any, ContextType>;
  mysqlInsert?: mysqlInsertDirectiveResolver<any, any, ContextType>;
  mysqlUpdate?: mysqlUpdateDirectiveResolver<any, any, ContextType>;
  mysqlDelete?: mysqlDeleteDirectiveResolver<any, any, ContextType>;
  mysqlTableForeign?: mysqlTableForeignDirectiveResolver<any, any, ContextType>;
  mysqlCount?: mysqlCountDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = DatabaseTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/Database/schema.graphql":
      return import("./sources/Database/schema.graphql") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("");
const MeshCache = await import("@graphql-mesh/cache-localforage").then(handleImport);
  const cache = new MeshCache({
      ...{},
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    })
const fetchFn = await import('@whatwg-node/fetch').then(m => m?.fetch || m);
const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const databaseTransforms = [];
const DatabaseHandler = await import("@graphql-mesh/mysql").then(handleImport);
const databaseHandler = new DatabaseHandler({
              name: "Database",
              config: {"host":"localhost","port":3306,"user":"root","password":"12345678","database":"ajkecommerce","typeCast":true,"supportBigNumbers":true,"bigNumberStrings":false,"tableColumnTypesMap":{"*_id":"Int","created_at":"Timestamp","updated_at":"Timestamp"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Database"),
              logger: logger.child({ source: "Database" }),
              importFn,
            });
sources[0] = {
          name: 'Database',
          handler: databaseHandler,
          transforms: databaseTransforms
        }
const additionalTypeDefs = [parse("scalar DateTime\n\nscalar Timestamp"),] as any[];
const RootTransform_0 = await import("@graphql-mesh/transform-naming-convention").then(handleImport);
transforms[0] = new RootTransform_0({
            apiName: '',
            config: {"mode":"wrap","fieldNames":"camelCase","typeNames":"pascalCase"},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const additionalResolvers = [] as any[]
const Merger = await import("@graphql-mesh/merger-bare").then(handleImport);
const merger = new Merger({
        cache,
        pubsub,
        logger: logger.child({ merger: "bare" }),
        store: rootStore.child("bare")
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));