import { attributes as AttributeRaw } from '@/types/database'
import { Attributes as Attribute } from '@/types/domain'

export const mapAttribute = (data: AttributeRaw): Attribute => {
  return {
    ...data,
    displayType: data.display_type
  }
}

export const mapAttributes = (
  data: AttributeRaw[] | null
): Attribute[] | undefined => {
  if (data === null) return undefined
  return data.map(mapAttribute)
}
