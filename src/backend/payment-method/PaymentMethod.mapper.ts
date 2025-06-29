// 📄 PaymentMethod.mapper.ts
import { type PaymentMethods as PaymentMethodRaw } from '@/types/database'
import { type PaymentMethods as PaymentMethod } from '@/types/domain'

export const PaymentMethodMapper = (data: PaymentMethodRaw): PaymentMethod => {
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    description: data.description,
    iconUrl: data.icon_url,
    isActive: data.is_active,
    minAmount: Number(data.min_amount),
    maxAmount: Number(data.max_amount),
    processingFeeType: data.processing_fee_type,
    processingFeeValue: Number(data.processing_fee_value),
    requiresVerification: data.requires_verification,
    settings: data.settings,
    displayOrder: Number(data.display_order)
  }
}

export const PaymentMethodsMapper = (
  data: PaymentMethodRaw[] | null
): PaymentMethod[] | undefined => {
  if (data === null) return undefined
  return data.map(PaymentMethodMapper)
}
