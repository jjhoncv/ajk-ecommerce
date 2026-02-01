import { executeQuery } from '@/lib/db'
import { type Tags as TagRaw } from '@/types/database'

export class TagRepository {
  public async getTags(): Promise<TagRaw[] | null> {
    const items = await executeQuery<TagRaw[]>({
      query: 'SELECT * FROM tags ORDER BY display_order ASC, name ASC'
    })

    if (items.length === 0) return null
    return items
  }

  public async getActiveTags(): Promise<TagRaw[] | null> {
    const items = await executeQuery<TagRaw[]>({
      query: 'SELECT * FROM tags WHERE is_active = 1 ORDER BY display_order ASC, name ASC'
    })

    if (items.length === 0) return null
    return items
  }

  public async getTagById(id: number): Promise<TagRaw | null> {
    const items = await executeQuery<TagRaw[]>({
      query: 'SELECT * FROM tags WHERE id = ?',
      values: [id]
    })

    if (items.length === 0) return null
    return items[0]
  }

  public async getTagBySlug(slug: string): Promise<TagRaw | null> {
    const items = await executeQuery<TagRaw[]>({
      query: 'SELECT * FROM tags WHERE slug = ?',
      values: [slug]
    })

    if (items.length === 0) return null
    return items[0]
  }

  public async createTag(
    data: Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TagRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO tags SET ?',
      values: [data]
    })

    return await this.getTagById(result.insertId)
  }

  public async updateTag(
    data: Omit<TagRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<TagRaw | null> {
    await executeQuery({
      query: 'UPDATE tags SET ? WHERE id=?',
      values: [data, id]
    })

    return await this.getTagById(id)
  }

  public async deleteTag(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM tags WHERE id=?',
      values: [id]
    })
  }

  public async updateDisplayOrder(id: number, displayOrder: number): Promise<void> {
    await executeQuery({
      query: 'UPDATE tags SET display_order = ? WHERE id = ?',
      values: [displayOrder, id]
    })
  }

  // ============================================
  // VARIANT TAGS INTEGRATION
  // ============================================

  /**
   * Get all tags for a specific variant
   */
  public async getTagsByVariantId(variantId: number): Promise<TagRaw[] | null> {
    const items = await executeQuery<TagRaw[]>({
      query: `
        SELECT t.* FROM tags t
        INNER JOIN variant_tags vt ON t.id = vt.tag_id
        WHERE vt.variant_id = ? AND t.is_active = 1
        ORDER BY vt.display_order ASC, t.name ASC
      `,
      values: [variantId]
    })

    if (items.length === 0) return null
    return items
  }

  /**
   * Get all tags for multiple variants (batch query)
   */
  public async getTagsByVariantIds(variantIds: number[]): Promise<Map<number, TagRaw[]>> {
    if (variantIds.length === 0) return new Map()

    const placeholders = variantIds.map(() => '?').join(',')
    const items = await executeQuery<(TagRaw & { variant_id: number })[]>({
      query: `
        SELECT t.*, vt.variant_id FROM tags t
        INNER JOIN variant_tags vt ON t.id = vt.tag_id
        WHERE vt.variant_id IN (${placeholders}) AND t.is_active = 1
        ORDER BY vt.display_order ASC, t.name ASC
      `,
      values: variantIds
    })

    // Group tags by variant_id
    const tagsMap = new Map<number, TagRaw[]>()
    for (const item of items) {
      const { variant_id, ...tag } = item
      if (!tagsMap.has(variant_id)) {
        tagsMap.set(variant_id, [])
      }
      tagsMap.get(variant_id)!.push(tag as TagRaw)
    }

    return tagsMap
  }

  /**
   * Set tags for a variant (replaces all existing tags)
   */
  public async setTagsForVariant(variantId: number, tagIds: number[]): Promise<void> {
    // Delete existing tags for this variant
    await executeQuery({
      query: 'DELETE FROM variant_tags WHERE variant_id = ?',
      values: [variantId]
    })

    // Insert new tags
    if (tagIds.length > 0) {
      const values = tagIds.map((tagId, index) => `(${variantId}, ${tagId}, ${index})`).join(', ')
      await executeQuery({
        query: `INSERT INTO variant_tags (variant_id, tag_id, display_order) VALUES ${values}`
      })
    }
  }

  /**
   * Add a tag to a variant
   */
  public async addTagToVariant(variantId: number, tagId: number): Promise<void> {
    // Get current max display_order
    const result = await executeQuery<[{ max_order: number | null }]>({
      query: 'SELECT MAX(display_order) as max_order FROM variant_tags WHERE variant_id = ?',
      values: [variantId]
    })
    const nextOrder = (result[0]?.max_order ?? -1) + 1

    await executeQuery({
      query: 'INSERT IGNORE INTO variant_tags (variant_id, tag_id, display_order) VALUES (?, ?, ?)',
      values: [variantId, tagId, nextOrder]
    })
  }

  /**
   * Remove a tag from a variant
   */
  public async removeTagFromVariant(variantId: number, tagId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_tags WHERE variant_id = ? AND tag_id = ?',
      values: [variantId, tagId]
    })
  }

  /**
   * Get variant IDs that have a specific tag
   */
  public async getVariantIdsByTagId(tagId: number): Promise<number[]> {
    const items = await executeQuery<{ variant_id: number }[]>({
      query: 'SELECT variant_id FROM variant_tags WHERE tag_id = ?',
      values: [tagId]
    })

    return items.map(item => item.variant_id)
  }
}

const tagRepository = new TagRepository()
export default tagRepository
