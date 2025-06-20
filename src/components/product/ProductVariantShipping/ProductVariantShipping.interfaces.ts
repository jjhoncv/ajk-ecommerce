import { ShippingOptionForAddress } from '@/types/shipping'

export interface ProductVariantShippingProps {
  productVariantId: number
  quantity: number
  orderValue: number
}

export interface ShippingData {
  selectedAddress: ShippingOptionForAddress | null
  allAddresses: ShippingOptionForAddress[]
  loading: boolean
  error: string | null
}
