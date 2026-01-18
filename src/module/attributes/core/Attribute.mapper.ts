import { type Attributes as AttributeRaw } from '@/types/database'
import { type Attributes as Attribute } from '@/types/domain'

export const AttributeMapper = (data: AttributeRaw): Attribute => {
  return {
    ...data,
    displayType: data.display_type
  }
}

export const AttributeMappers = (
  data: AttributeRaw[] | null
): Attribute[] | undefined => {
  if (data === null) return undefined
  return data.map(AttributeMapper)
}
