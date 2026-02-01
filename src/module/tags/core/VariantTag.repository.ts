import { executeQuery } from '@/lib/db'
import { type Tags as TagRaw } from '@/types/database'

export interface VariantTagRow {
  id: number
  variant_id: number
  tag_id: number
  display_order: number
  created_at: Date
}

export class VariantTagRepository {
  /**
   * Get all tags assigned to a variant
   */
  public async getTagsByVariantId(variantId: number): Promise<TagRaw[] | null> {
    const items = await executeQuery<TagRaw[]>({
      query: `
        SELECT t.*
        FROM tags t
        INNER JOIN variant_tags vt ON vt.tag_id = t.id
        WHERE vt.variant_id = ?
        ORDER BY vt.display_order ASC, t.name ASC
      `,
      values: [variantId]
    })

    if (items.length === 0) return null
    return items
  }

  /**
   * Get active tags assigned to a variant (for ecommerce display)
   */
  public async getActiveTagsByVariantId(
    variantId: number
  ): Promise<TagRaw[] | null> {
    const items = await executeQuery<TagRaw[]>({
      query: `
        SELECT t.*
        FROM tags t
        INNER JOIN variant_tags vt ON vt.tag_id = t.id
        WHERE vt.variant_id = ? AND t.is_active = 1
        ORDER BY vt.display_order ASC, t.name ASC
      `,
      values: [variantId]
    })

    if (items.length === 0) return null
    return items
  }

  /**
   * Assign tags to a variant (replaces existing)
   */
  public async assignTagsToVariant(
    variantId: number,
    tagIds: number[]
  ): Promise<void> {
    // First, remove all existing tags for this variant
    await executeQuery({
      query: 'DELETE FROM variant_tags WHERE variant_id = ?',
      values: [variantId]
    })

    // Then, insert the new tags
    if (tagIds.length > 0) {
      const values = tagIds.map((tagId, index) => [variantId, tagId, index])
      await executeQuery({
        query: `
          INSERT INTO variant_tags (variant_id, tag_id, display_order)
          VALUES ?
        `,
        values: [values]
      })
    }
  }

  /**
   * Add a single tag to a variant
   */
  public async addTagToVariant(
    variantId: number,
    tagId: number,
    displayOrder: number = 0
  ): Promise<void> {
    await executeQuery({
      query: `
        INSERT IGNORE INTO variant_tags (variant_id, tag_id, display_order)
        VALUES (?, ?, ?)
      `,
      values: [variantId, tagId, displayOrder]
    })
  }

  /**
   * Remove a single tag from a variant
   */
  public async removeTagFromVariant(
    variantId: number,
    tagId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_tags WHERE variant_id = ? AND tag_id = ?',
      values: [variantId, tagId]
    })
  }

  /**
   * Get tag IDs for a variant (useful for forms)
   */
  public async getTagIdsByVariantId(variantId: number): Promise<number[]> {
    const items = await executeQuery<{ tag_id: number }[]>({
      query:
        'SELECT tag_id FROM variant_tags WHERE variant_id = ? ORDER BY display_order ASC',
      values: [variantId]
    })

    return items.map((item) => item.tag_id)
  }
}

const variantTagRepository = new VariantTagRepository()
export default variantTagRepository
