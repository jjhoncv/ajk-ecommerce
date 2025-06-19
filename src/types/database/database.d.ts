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

export type CouponsApplicableTo =
  | 'all'
  | 'categories'
  | 'products';

export type CouponsDiscountType =
  | 'fixed_amount'
  | 'percentage';

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

export type OrderTrackingStatus =
  | 'delivered'
  | 'failed_delivery'
  | 'in_transit'
  | 'out_for_delivery'
  | 'preparing'
  | 'shipped';

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

export type PaymentMethodsProcessingFeeType =
  | 'fixed'
  | 'percentage';

export type PaymentTransactionsStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'pending'
  | 'processing'
  | 'refunded';

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
  image_url_normal: Scalars['String']['output'];
  /** Imagen thumbnail 140x140 para selector de atributo */
  image_url_thumb: Scalars['String']['output'];
  /** Imagen zoom 1200x1200 (opcional) */
  image_url_zoom: Scalars['String']['output'];
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

export interface CouponUsage {
  coupon_id: Scalars['Int']['output'];
  customer_id: Scalars['Int']['output'];
  discount_amount: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  used_at: Scalars['Timestamp']['output'];
}

export interface Coupons {
  applicable_ids?: Maybe<Scalars['JSON']['output']>;
  applicable_to?: Maybe<CouponsApplicableTo>;
  code: Scalars['String']['output'];
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discount_type: CouponsDiscountType;
  discount_value: Scalars['Float']['output'];
  end_date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  max_discount_amount?: Maybe<Scalars['Float']['output']>;
  min_purchase_amount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  start_date: Scalars['DateTime']['output'];
  updated_at: Scalars['Timestamp']['output'];
  usage_limit?: Maybe<Scalars['Int']['output']>;
  usage_limit_per_customer?: Maybe<Scalars['Int']['output']>;
  used_count?: Maybe<Scalars['Int']['output']>;
}

export interface Customers {
  address_id?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['Timestamp']['output'];
  /** Documento de identidad  */
  dni: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  lastname: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  /** numero de celular */
  phone: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface CustomersAddresses {
  /** Nombre de la dirección (Casa, Oficina, etc.) */
  alias: Scalars['String']['output'];
  /** Dpto/Interior/Piso/Lote/Bloque (opcional) */
  apartment?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  department: Scalars['String']['output'];
  district: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  id_customer: Scalars['Int']['output'];
  /** 1 = dirección por defecto */
  is_default?: Maybe<Scalars['Int']['output']>;
  /** Latitud GPS */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Longitud GPS */
  longitude?: Maybe<Scalars['Float']['output']>;
  province: Scalars['String']['output'];
  /** Nombre de la avenida/calle/jirón */
  street_name: Scalars['String']['output'];
  /** Número de la dirección */
  street_number: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface OrderItems {
  /** Descuento aplicado a este item */
  discount_amount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  /** Nombre del producto al momento de compra */
  product_name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  /** Precio total (quantity * unit_price) */
  total_price: Scalars['Float']['output'];
  /** Precio unitario al momento de compra */
  unit_price: Scalars['Float']['output'];
  /** Atributos de la variante (color, talla, etc.) */
  variant_attributes?: Maybe<Scalars['JSON']['output']>;
  /** Variante del producto comprada */
  variant_id: Scalars['Int']['output'];
  /** SKU de la variante */
  variant_sku: Scalars['String']['output'];
}

export interface OrderSummary {
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  customer_email?: Maybe<Scalars['String']['output']>;
  customer_id: Scalars['Int']['output'];
  customer_name?: Maybe<Scalars['String']['output']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['output'];
  payment_status: OrderSummaryPaymentStatus;
  status: OrderSummaryStatus;
  /** Total final a pagar */
  total_amount: Scalars['Float']['output'];
  total_items: Scalars['BigInt']['output'];
  total_quantity?: Maybe<Scalars['Float']['output']>;
  /** Número de seguimiento del courier */
  tracking_number?: Maybe<Scalars['String']['output']>;
}

export interface OrderTracking {
  /** Empresa de courier (Olva, Shalom, etc.) */
  courier_company?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  /** Ubicación actual del paquete */
  current_location?: Maybe<Scalars['String']['output']>;
  delivered_at?: Maybe<Scalars['Timestamp']['output']>;
  /** Nombre de quien recibió */
  delivered_to?: Maybe<Scalars['String']['output']>;
  /** Notas de entrega */
  delivery_notes?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  order_id: Scalars['Int']['output'];
  shipped_at?: Maybe<Scalars['Timestamp']['output']>;
  status: OrderTrackingStatus;
  /** Número de seguimiento del courier */
  tracking_number?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface Orders {
  /** Notas internas del admin */
  admin_notes?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Timestamp']['output'];
  customer_id: Scalars['Int']['output'];
  /** Notas del cliente */
  customer_notes?: Maybe<Scalars['String']['output']>;
  /** Descuento aplicado */
  discount_amount?: Maybe<Scalars['Float']['output']>;
  /** Fecha estimada de entrega */
  estimated_delivery?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  /** Número único de orden (ORD-2025-001234) */
  order_number: Scalars['String']['output'];
  /** Fecha de pago confirmado */
  paid_at?: Maybe<Scalars['Timestamp']['output']>;
  /** Método de pago usado */
  payment_method?: Maybe<Scalars['String']['output']>;
  payment_status: OrdersPaymentStatus;
  /** Dirección de envío */
  shipping_address_id: Scalars['Int']['output'];
  /** Costo de envío */
  shipping_cost?: Maybe<Scalars['Float']['output']>;
  /** Método de envío */
  shipping_method?: Maybe<Scalars['String']['output']>;
  status: OrdersStatus;
  /** Subtotal antes de descuentos */
  subtotal: Scalars['Float']['output'];
  /** Impuestos (IGV) */
  tax_amount?: Maybe<Scalars['Float']['output']>;
  /** Total final a pagar */
  total_amount: Scalars['Float']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface PaymentMethods {
  code: Scalars['String']['output'];
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  max_amount?: Maybe<Scalars['Float']['output']>;
  min_amount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  processing_fee_type?: Maybe<PaymentMethodsProcessingFeeType>;
  processing_fee_value?: Maybe<Scalars['Float']['output']>;
  requires_verification?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  updated_at: Scalars['Timestamp']['output'];
}

export interface PaymentTransactions {
  amount: Scalars['Float']['output'];
  created_at: Scalars['Timestamp']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  expires_at?: Maybe<Scalars['Timestamp']['output']>;
  gateway_response?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  net_amount: Scalars['Float']['output'];
  order_id: Scalars['Int']['output'];
  payment_data?: Maybe<Scalars['JSON']['output']>;
  payment_method_id: Scalars['Int']['output'];
  processed_at?: Maybe<Scalars['Timestamp']['output']>;
  processing_fee?: Maybe<Scalars['Float']['output']>;
  reference_number?: Maybe<Scalars['String']['output']>;
  status?: Maybe<PaymentTransactionsStatus>;
  transaction_id?: Maybe<Scalars['String']['output']>;
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
  stock_limit: Scalars['Int']['output'];
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

export interface ShippingMethods {
  base_cost: Scalars['Float']['output'];
  created_at: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  estimated_days_max?: Maybe<Scalars['Int']['output']>;
  estimated_days_min?: Maybe<Scalars['Int']['output']>;
  free_shipping_threshold?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface ShippingZoneMethods {
  cost: Scalars['Float']['output'];
  created_at: Scalars['Timestamp']['output'];
  estimated_days_max?: Maybe<Scalars['Int']['output']>;
  estimated_days_min?: Maybe<Scalars['Int']['output']>;
  free_shipping_threshold?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  shipping_method_id: Scalars['Int']['output'];
  shipping_zone_id: Scalars['Int']['output'];
  updated_at: Scalars['Timestamp']['output'];
}

export interface ShippingZones {
  created_at: Scalars['Timestamp']['output'];
  districts: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  is_active?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
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
