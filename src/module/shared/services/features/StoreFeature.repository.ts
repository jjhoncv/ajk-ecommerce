import { executeQuery } from '@/lib/db'
import {
  type StoreFeatureRaw,
  type CreateStoreFeatureData,
  type UpdateStoreFeatureData
} from './StoreFeature.interfaces'

export class StoreFeatureRepository {
  public async getAll(): Promise<StoreFeatureRaw[] | null> {
    return await executeQuery<StoreFeatureRaw[]>({
      query: `
        SELECT * FROM store_features
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
      `
    })
  }

  public async getById(id: number): Promise<StoreFeatureRaw | null> {
    const results = await executeQuery<StoreFeatureRaw[]>({
      query: 'SELECT * FROM store_features WHERE id = ?',
      values: [id]
    })
    return results && results.length > 0 ? results[0] : null
  }

  public async create(data: CreateStoreFeatureData): Promise<number> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO store_features (icon, title, description, display_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [
        data.icon,
        data.title,
        data.description,
        data.displayOrder ?? 0,
        data.isActive !== false ? 1 : 0
      ]
    })
    return result.insertId
  }

  public async update(id: number, data: UpdateStoreFeatureData): Promise<boolean> {
    const fields: string[] = []
    const values: (string | number)[] = []

    if (data.icon !== undefined) {
      fields.push('icon = ?')
      values.push(data.icon)
    }
    if (data.title !== undefined) {
      fields.push('title = ?')
      values.push(data.title)
    }
    if (data.description !== undefined) {
      fields.push('description = ?')
      values.push(data.description)
    }
    if (data.displayOrder !== undefined) {
      fields.push('display_order = ?')
      values.push(data.displayOrder)
    }
    if (data.isActive !== undefined) {
      fields.push('is_active = ?')
      values.push(data.isActive ? 1 : 0)
    }

    if (fields.length === 0) return false

    values.push(id)

    const result = await executeQuery<{ affectedRows: number }>({
      query: `UPDATE store_features SET ${fields.join(', ')} WHERE id = ?`,
      values
    })

    return result.affectedRows > 0
  }

  public async delete(id: number): Promise<boolean> {
    const result = await executeQuery<{ affectedRows: number }>({
      query: 'DELETE FROM store_features WHERE id = ?',
      values: [id]
    })
    return result.affectedRows > 0
  }
}
