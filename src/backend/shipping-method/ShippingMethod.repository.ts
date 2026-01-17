import { executeQuery } from '@/lib/db'
import { type ShippingMethods as ShippingMethodRaw } from '@/types/database'

export class ShippingMethodRepository {
  public async getShippingMethods(): Promise<ShippingMethodRaw[] | null> {
    const methods = await executeQuery<ShippingMethodRaw[]>({
      query: `
        SELECT * FROM shipping_methods
        WHERE is_active = 1
        ORDER BY display_order ASC, name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getAllShippingMethods(): Promise<ShippingMethodRaw[] | null> {
    const methods = await executeQuery<ShippingMethodRaw[]>({
      query: `
        SELECT * FROM shipping_methods
        ORDER BY display_order ASC, name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getShippingMethodById(
    id: number
  ): Promise<ShippingMethodRaw | null> {
    const methods = await executeQuery<ShippingMethodRaw[]>({
      query: 'SELECT * FROM shipping_methods WHERE id = ?',
      values: [id]
    })

    if (methods.length === 0) return null
    return methods[0]
  }

  public async getShippingMethodsByZoneId(
    zoneId: number
  ): Promise<ShippingMethodRaw[] | null> {
    const methods = await executeQuery<ShippingMethodRaw[]>({
      query: `
        SELECT sm.* 
        FROM shipping_methods sm
        JOIN shipping_zone_methods szm ON sm.id = szm.shipping_method_id
        WHERE szm.shipping_zone_id = ? 
        AND sm.is_active = 1 
        AND szm.is_active = 1
        ORDER BY sm.display_order ASC, sm.name ASC
      `,
      values: [zoneId]
    })

    if (methods.length === 0) return null
    return methods
  }

  public async createShippingMethod(
    method: Omit<ShippingMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingMethodRaw | null> {
    const methodData = {
      ...method,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO shipping_methods SET ?',
      values: [methodData]
    })

    return await this.getShippingMethodById(result.insertId)
  }

  public async updateShippingMethod(
    methodData: Partial<Omit<ShippingMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingMethodRaw | null> {
    const updateData = {
      ...methodData,
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE shipping_methods SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getShippingMethodById(id)
  }

  public async deleteShippingMethod(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM shipping_methods WHERE id = ?',
      values: [id]
    })
  }

  public async activateShippingMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_methods SET is_active = 1, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async deactivateShippingMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_methods SET is_active = 0, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }
}

const shippingMethodRepository = new ShippingMethodRepository()
export default shippingMethodRepository
