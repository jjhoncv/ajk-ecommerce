// src/module/tags/service/tags/types.ts
import { type Tags as TagRaw } from '@/types/database'
import { type Tags as Tag } from '@/types/domain'

export type CreateTagData = Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>
export type UpdateTagData = Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>

export type { Tag }
