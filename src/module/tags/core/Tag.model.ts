// src/module/tags/core/Tag.model.ts
import { type Tags as TagRaw } from '@/types/database'
import { type Tags as Tag } from '@/types/domain'

import { TagMapper, TagsMapper } from './Tag.mapper'
import oTagRep from './Tag.repository'

export class TagModel {
  public async getTags(): Promise<Tag[] | undefined> {
    const itemsRaw = await oTagRep.getTags()
    return TagsMapper(itemsRaw)
  }

  public async getActiveTags(): Promise<Tag[] | undefined> {
    const itemsRaw = await oTagRep.getActiveTags()
    return TagsMapper(itemsRaw)
  }

  public async getTagById(id: number): Promise<Tag | undefined> {
    const itemRaw = await oTagRep.getTagById(id)
    if (itemRaw == null) return undefined
    return TagMapper(itemRaw)
  }

  public async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const itemRaw = await oTagRep.getTagBySlug(slug)
    if (itemRaw == null) return undefined
    return TagMapper(itemRaw)
  }

  public async createTag(
    data: Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Tag | undefined> {
    const created = await oTagRep.createTag(data)
    if (created == null) return undefined
    return TagMapper(created)
  }

  public async updateTag(
    data: Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<Tag | undefined> {
    const updated = await oTagRep.updateTag(data, id)
    if (updated == null) return undefined
    return TagMapper(updated)
  }

  public async deleteTag(id: number): Promise<void> {
    await oTagRep.deleteTag(id)
  }
}

const tagModel = new TagModel()
export default tagModel
