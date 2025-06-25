// ============================================================================
// TIPOS DE DOMINIO BÁSICOS - SOLO INTERFACES Y ENUMS
// ============================================================================
// Para uso con consultas SQL directas
// ============================================================================

export type Maybe<T> = T | null;

export type InputMaybe<T> = T | null;

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };

export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }

  BigInt: { input: number; output: number; }

  Date: { input: any; output: any; }

  DateTime: { input: Date; output: Date; }

  JSON: { input: any; output: any; }

  Timestamp: { input: Date; output: Date; }
}

export interface AttributeOptionImages {

  altText?: Maybe<Scalars['String']['output']>;
  attributeOption?: Maybe<AttributeOptions>;
  attributeOptionId: Scalars['Int']['output'];

  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageType: AttributeOptionImagesImageType;

  imageUrlNormal: Scalars['String']['output'];

  imageUrlThumb: Scalars['String']['output'];

  imageUrlZoom: Scalars['String']['output'];
  isPrimary?: Maybe<Scalars['Int']['output']>;

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

export interface AttributeOptions {
  additionalCost?: Maybe<Scalars['Float']['output']>;
  attribute?: Maybe<Attributes>;
  attributeId: Scalars['Int']['output'];
  attributeOptionImages?: Maybe<Array<Maybe<AttributeOptionImages>>>;
  id: Scalars['Int']['output'];
  value: Scalars['String']['output'];
  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>;
}

export interface Attributes {
  attributeOption?: Maybe<AttributeOptions>;
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

export interface Banner {
  buttonText?: Maybe<Scalars['String']['output']>;

  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];

}

export interface Brands {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product?: Maybe<Products>;
}

export interface Categories {
  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>;
  showNav?: Maybe<Scalars['Int']['output']>;
}

export interface CouponUsage {
  coupon?: Maybe<Coupons>;
  couponId: Scalars['Int']['output'];
  customer?: Maybe<Customers>;
  customerId: Scalars['Int']['output'];
  discountAmount: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  order?: Maybe<Orders>;
  orderId: Scalars['Int']['output'];
  usedAt: Scalars['Timestamp']['output'];
}

export interface Coupons {
  applicableIds?: Maybe<Scalars['JSON']['output']>;
  applicableTo?: Maybe<CouponsApplicableTo>;
  code: Scalars['String']['output'];
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;

  description?: Maybe<Scalars['String']['output']>;
  discountType: CouponsDiscountType;
  discountValue: Scalars['Float']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  maxDiscountAmount?: Maybe<Scalars['Float']['output']>;
  minPurchaseAmount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];

  usageLimit?: Maybe<Scalars['Int']['output']>;
  usageLimitPerCustomer?: Maybe<Scalars['Int']['output']>;
  usedCount?: Maybe<Scalars['Int']['output']>;
}

export type CouponsApplicableTo =
  | 'all'
  | 'categories'
  | 'products';

export type CouponsDiscountType =
  | 'fixed_amount'
  | 'percentage';

export interface Customers {
  addressId?: Maybe<Scalars['Int']['output']>;
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;

  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>;

  dni?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Orders>;
  password: Scalars['String']['output'];

  phone?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;

  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
}

export interface CustomersAddresses {

  alias: Scalars['String']['output'];

  apartment?: Maybe<Scalars['String']['output']>;

  customer?: Maybe<Customers>;
  department: Scalars['String']['output'];
  district: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCustomer: Scalars['Int']['output'];

  isDefault?: Maybe<Scalars['Int']['output']>;

  latitude?: Maybe<Scalars['Float']['output']>;

  longitude?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Orders>;
  province: Scalars['String']['output'];

  streetName: Scalars['String']['output'];

  streetNumber: Scalars['String']['output'];

}

export type OrderBy =
  | 'asc'
  | 'desc';

export interface OrderItems {

  discountAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  order?: Maybe<Orders>;
  orderId: Scalars['Int']['output'];

  productName: Scalars['String']['output'];
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  quantity: Scalars['Int']['output'];

  totalPrice: Scalars['Float']['output'];

  unitPrice: Scalars['Float']['output'];

  variantAttributes?: Maybe<Scalars['JSON']['output']>;

  variantId: Scalars['Int']['output'];

  variantSku: Scalars['String']['output'];
}

export interface OrderSummary {

  courierCompany?: Maybe<Scalars['String']['output']>;

  customerEmail?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['Int']['output'];
  customerName?: Maybe<Scalars['String']['output']>;

  estimatedDelivery?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];

  orderNumber: Scalars['String']['output'];
  paymentStatus: OrderSummaryPaymentStatus;
  status: OrderSummaryStatus;

  totalAmount: Scalars['Float']['output'];
  totalItems: Scalars['BigInt']['output'];
  totalQuantity?: Maybe<Scalars['Float']['output']>;

  trackingNumber?: Maybe<Scalars['String']['output']>;
}

export type OrderSummaryPaymentStatus =
  | 'failed'
  | 'paid'
  | 'pending'
  | 'refunded';

export type OrderSummaryStatus =
  | 'cancelled'
  | 'delivered'
  | 'pending'
  | 'processing'
  | 'refunded'
  | 'shipped';

export interface OrderTracking {

  courierCompany?: Maybe<Scalars['String']['output']>;

  currentLocation?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['Timestamp']['output']>;

  deliveredTo?: Maybe<Scalars['String']['output']>;

  deliveryNotes?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  order?: Maybe<Orders>;
  orderId: Scalars['Int']['output'];
  shippedAt?: Maybe<Scalars['Timestamp']['output']>;
  status: OrderTrackingStatus;

  trackingNumber?: Maybe<Scalars['String']['output']>;

}

export type OrderTrackingStatus =
  | 'delivered'
  | 'failed_delivery'
  | 'in_transit'
  | 'out_for_delivery'
  | 'preparing'
  | 'shipped';

export interface Orders {

  adminNotes?: Maybe<Scalars['String']['output']>;
  couponUsage?: Maybe<Array<Maybe<CouponUsage>>>;

  customer?: Maybe<Customers>;
  customerId: Scalars['Int']['output'];

  customerNotes?: Maybe<Scalars['String']['output']>;
  customersAddresses?: Maybe<Array<Maybe<CustomersAddresses>>>;

  discountAmount?: Maybe<Scalars['Float']['output']>;

  estimatedDelivery?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  orderItems?: Maybe<Array<Maybe<OrderItems>>>;

  orderNumber: Scalars['String']['output'];
  orderTracking?: Maybe<Array<Maybe<OrderTracking>>>;

  paidAt?: Maybe<Scalars['Timestamp']['output']>;

  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus: OrdersPaymentStatus;
  paymentTransactions?: Maybe<Array<Maybe<PaymentTransactions>>>;

  shippingAddressId: Scalars['Int']['output'];

  shippingCost?: Maybe<Scalars['Float']['output']>;

  shippingMethod?: Maybe<Scalars['String']['output']>;
  status: OrdersStatus;

  subtotal: Scalars['Float']['output'];

  taxAmount?: Maybe<Scalars['Float']['output']>;

  totalAmount: Scalars['Float']['output'];

}

export type OrdersPaymentStatus =
  | 'failed'
  | 'paid'
  | 'pending'
  | 'refunded';

export type OrdersStatus =
  | 'cancelled'
  | 'delivered'
  | 'pending'
  | 'processing'
  | 'refunded'
  | 'shipped';

export interface PaymentMethods {
  code: Scalars['String']['output'];

  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  maxAmount?: Maybe<Scalars['Float']['output']>;
  minAmount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  paymentTransactions?: Maybe<Array<Maybe<PaymentTransactions>>>;
  processingFeeType?: Maybe<PaymentMethodsProcessingFeeType>;
  processingFeeValue?: Maybe<Scalars['Float']['output']>;
  requiresVerification?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;

}

export type PaymentMethodsProcessingFeeType =
  | 'fixed'
  | 'percentage';

export interface PaymentTransactions {
  amount: Scalars['Float']['output'];

  currency?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['Timestamp']['output']>;
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  netAmount: Scalars['Float']['output'];
  order?: Maybe<Orders>;
  orderId: Scalars['Int']['output'];
  paymentData?: Maybe<Scalars['JSON']['output']>;
  paymentMethod?: Maybe<PaymentMethods>;
  paymentMethodId: Scalars['Int']['output'];
  processedAt?: Maybe<Scalars['Timestamp']['output']>;
  processingFee?: Maybe<Scalars['Float']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<PaymentTransactionsStatus>;
  transactionId?: Maybe<Scalars['String']['output']>;

}

export type PaymentTransactionsStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'pending'
  | 'processing'
  | 'refunded';

export interface Permissions {

  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];

}

export interface ProductCategories {
  categories?: Maybe<Array<Maybe<Categories>>>;
  categoryId: Scalars['Int']['output'];
  product?: Maybe<Products>;
  productId: Scalars['Int']['output'];
}

export interface ProductRatingSummary {
  averageRating?: Maybe<Scalars['Float']['output']>;
  fiveStar?: Maybe<Scalars['Float']['output']>;
  fourStar?: Maybe<Scalars['Float']['output']>;
  oneStar?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['Int']['output'];
  threeStar?: Maybe<Scalars['Float']['output']>;
  totalRatings: Scalars['BigInt']['output'];
  twoStar?: Maybe<Scalars['Float']['output']>;
  verifiedPurchases?: Maybe<Scalars['Float']['output']>;
}

export interface ProductVariants {

  id: Scalars['Int']['output'];
  orderItems?: Maybe<Array<Maybe<OrderItems>>>;
  price: Scalars['Float']['output'];
  product?: Maybe<Products>;
  productId: Scalars['Int']['output'];
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>;
  sku: Scalars['String']['output'];
  stock: Scalars['Int']['output'];

  variantAttributeOptions?: Maybe<Array<Maybe<VariantAttributeOptions>>>;
  variantImages?: Maybe<Array<Maybe<VariantImages>>>;
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
}

export interface Products {
  basePrice?: Maybe<Scalars['Float']['output']>;
  brand?: Maybe<Brands>;
  brandId?: Maybe<Scalars['Int']['output']>;

  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  productCategories?: Maybe<Array<Maybe<ProductCategories>>>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;

}

export interface PromotionVariants {

  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  promotion?: Maybe<Promotions>;
  promotionId: Scalars['Int']['output'];
  promotionPrice?: Maybe<Scalars['Float']['output']>;
  stockLimit: Scalars['Int']['output'];
  variantId: Scalars['Int']['output'];
}

export interface Promotions {

  description?: Maybe<Scalars['String']['output']>;
  discountType: PromotionsDiscountType;
  discountValue: Scalars['Float']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Int']['output']>;
  minPurchaseAmount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  promotionVariants?: Maybe<Array<Maybe<PromotionVariants>>>;
  startDate: Scalars['DateTime']['output'];
  type?: Maybe<Scalars['String']['output']>;

}

export type PromotionsDiscountType =
  | 'fixed_amount'
  | 'percentage';

export interface RatingImages {

  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  ratingId: Scalars['Int']['output'];
  variantRatings?: Maybe<Array<Maybe<VariantRatings>>>;
}

export interface Roles {

  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>;

  users?: Maybe<Array<Maybe<Users>>>;
}

export interface RolesSections {
  id: Scalars['Int']['output'];
  idRol?: Maybe<Scalars['Int']['output']>;
  idSection?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Roles>;
  sections?: Maybe<Array<Maybe<Sections>>>;
}

export interface Sections {
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rolesSections?: Maybe<Array<Maybe<RolesSections>>>;
  url?: Maybe<Scalars['String']['output']>;
}

export interface Services {

  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  servicesImages?: Maybe<Array<Maybe<ServicesImages>>>;
  slug?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];

}

export interface ServicesImages {

  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  idService?: Maybe<Scalars['Int']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  services?: Maybe<Array<Maybe<Services>>>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;

}

export interface ShippingMethods {
  baseCost: Scalars['Float']['output'];

  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  estimatedDaysMax?: Maybe<Scalars['Int']['output']>;
  estimatedDaysMin?: Maybe<Scalars['Int']['output']>;
  freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  shippingZoneMethods?: Maybe<Array<Maybe<ShippingZoneMethods>>>;

}

export interface ShippingZoneMethods {
  cost: Scalars['Float']['output'];

  estimatedDaysMax?: Maybe<Scalars['Int']['output']>;
  estimatedDaysMin?: Maybe<Scalars['Int']['output']>;
  freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  shippingMethod?: Maybe<ShippingMethods>;
  shippingMethodId: Scalars['Int']['output'];
  shippingZone?: Maybe<ShippingZones>;
  shippingZoneId: Scalars['Int']['output'];

}

export interface ShippingZones {

  districts: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  shippingZoneMethods?: Maybe<Array<Maybe<ShippingZoneMethods>>>;

}

export interface Users {

  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Roles>;
  roleId?: Maybe<Scalars['Int']['output']>;

}

export interface VariantAttributeOptions {
  attributeOption?: Maybe<AttributeOptions>;
  attributeOptionId: Scalars['Int']['output'];
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  variantId: Scalars['Int']['output'];
}

export interface VariantImages {

  altText?: Maybe<Scalars['String']['output']>;

  displayOrder?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  imageType: VariantImagesImageType;

  imageUrlNormal: Scalars['String']['output'];

  imageUrlThumb: Scalars['String']['output'];

  imageUrlZoom: Scalars['String']['output'];

  isPrimary?: Maybe<Scalars['Int']['output']>;
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;

  variantId: Scalars['Int']['output'];
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

export interface VariantRatingSummary {
  averageRating?: Maybe<Scalars['Float']['output']>;
  fiveStar?: Maybe<Scalars['Float']['output']>;
  fourStar?: Maybe<Scalars['Float']['output']>;
  oneStar?: Maybe<Scalars['Float']['output']>;
  threeStar?: Maybe<Scalars['Float']['output']>;
  totalRatings: Scalars['BigInt']['output'];
  twoStar?: Maybe<Scalars['Float']['output']>;
  variantId: Scalars['Int']['output'];
  verifiedPurchases?: Maybe<Scalars['Float']['output']>;
}

export interface VariantRatings {

  customer?: Maybe<Customers>;
  customerId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
  rating: Scalars['Int']['output'];
  ratingImages?: Maybe<Array<Maybe<RatingImages>>>;
  review?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;

  variantId: Scalars['Int']['output'];
  verifiedPurchase: Scalars['Int']['output'];
}
