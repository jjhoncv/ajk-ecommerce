import { type AttributesDisplayType } from '@/types/domain'

export interface VariantAttributeOptionWithDetails {
  attributeOptionValue: string
  additionalCost: number
  attributeId: number
  attributeName: string
  attributeDisplayType: AttributesDisplayType
  variantId: number
  attributeOptionId: number
}
