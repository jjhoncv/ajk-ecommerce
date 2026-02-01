import variantTagRepository from '../../core/VariantTag.repository'
import { TagsMapper } from '../../core/Tag.mapper'
import { type Tags as Tag } from '@/types/domain'

export const variantTagService = {
  /**
   * Get all tags for a variant (for admin)
   */
  getTagsByVariantId: async (variantId: number): Promise<Tag[]> => {
    const tagsRaw = await variantTagRepository.getTagsByVariantId(variantId)
    return TagsMapper(tagsRaw) ?? []
  },

  /**
   * Get active tags for a variant (for ecommerce)
   */
  getActiveTagsByVariantId: async (variantId: number): Promise<Tag[]> => {
    const tagsRaw =
      await variantTagRepository.getActiveTagsByVariantId(variantId)
    return TagsMapper(tagsRaw) ?? []
  },

  /**
   * Get tag IDs for a variant (for forms)
   */
  getTagIdsByVariantId: async (variantId: number): Promise<number[]> => {
    return await variantTagRepository.getTagIdsByVariantId(variantId)
  },

  /**
   * Assign tags to a variant (replaces existing)
   */
  assignTagsToVariant: async (
    variantId: number,
    tagIds: number[]
  ): Promise<void> => {
    await variantTagRepository.assignTagsToVariant(variantId, tagIds)
  },

  /**
   * Add a single tag to a variant
   */
  addTagToVariant: async (
    variantId: number,
    tagId: number,
    displayOrder: number = 0
  ): Promise<void> => {
    await variantTagRepository.addTagToVariant(variantId, tagId, displayOrder)
  },

  /**
   * Remove a single tag from a variant
   */
  removeTagFromVariant: async (
    variantId: number,
    tagId: number
  ): Promise<void> => {
    await variantTagRepository.removeTagFromVariant(variantId, tagId)
  }
}

export default variantTagService
