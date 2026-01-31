// src/module/tags/core/Tag.repository.ts
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
      query:
        'SELECT * FROM tags WHERE is_active = 1 ORDER BY display_order ASC, name ASC'
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
}

const tagRepository = new TagRepository()
export default tagRepository
