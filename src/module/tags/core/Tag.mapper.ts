// src/module/tags/core/Tag.mapper.ts
import { type Tags as TagRaw } from '@/types/database'
import { type Tags as Tag } from '@/types/domain'

export const TagMapper = (data: TagRaw): Tag => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    color: data.color,
    isActive: data.is_active,
    displayOrder: data.display_order,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  }
}

export const TagsMapper = (data: TagRaw[] | null): Tag[] | undefined => {
  if (data === null) return undefined
  return data.map(TagMapper)
}
