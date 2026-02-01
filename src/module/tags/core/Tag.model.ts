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

  public async updateDisplayOrder(id: number, displayOrder: number): Promise<void> {
    await oTagRep.updateDisplayOrder(id, displayOrder)
  }

  // ============================================
  // VARIANT TAGS INTEGRATION
  // ============================================

  /**
   * Get all tags for a specific variant
   */
  public async getTagsByVariantId(variantId: number): Promise<Tag[] | undefined> {
    const itemsRaw = await oTagRep.getTagsByVariantId(variantId)
    return TagsMapper(itemsRaw)
  }

  /**
   * Get all tags for multiple variants (batch query)
   */
  public async getTagsByVariantIds(variantIds: number[]): Promise<Map<number, Tag[]>> {
    const rawMap = await oTagRep.getTagsByVariantIds(variantIds)
    const result = new Map<number, Tag[]>()

    for (const [variantId, rawTags] of rawMap) {
      const mappedTags = TagsMapper(rawTags)
      if (mappedTags) {
        result.set(variantId, mappedTags)
      }
    }

    return result
  }

  /**
   * Set tags for a variant (replaces all existing tags)
   */
  public async setTagsForVariant(variantId: number, tagIds: number[]): Promise<void> {
    await oTagRep.setTagsForVariant(variantId, tagIds)
  }

  /**
   * Add a tag to a variant
   */
  public async addTagToVariant(variantId: number, tagId: number): Promise<void> {
    await oTagRep.addTagToVariant(variantId, tagId)
  }

  /**
   * Remove a tag from a variant
   */
  public async removeTagFromVariant(variantId: number, tagId: number): Promise<void> {
    await oTagRep.removeTagFromVariant(variantId, tagId)
  }

  /**
   * Get variant IDs that have a specific tag
   */
  public async getVariantIdsByTagId(tagId: number): Promise<number[]> {
    return oTagRep.getVariantIdsByTagId(tagId)
  }
}

const tagModel = new TagModel()
export default tagModel
