import { type Attributes as AttributeRaw } from '@/types/database'
import { type Attributes as Attribute } from '@/types/domain'

export const AttributeMapper = (data: AttributeRaw): Attribute => {
  return {
    ...data,
    displayType: data.display_type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  }
}

export const AttributeMappers = (
  data: AttributeRaw[] | null
): Attribute[] | undefined => {
  if (data === null) return undefined
  return data.map(AttributeMapper)
}
