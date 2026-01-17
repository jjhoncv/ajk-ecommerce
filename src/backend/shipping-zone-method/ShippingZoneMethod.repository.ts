// 📄 ShippingZoneMethod.repository.ts
import { executeQuery } from '@/lib/db'
import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'

interface ShippingZoneMethodWithDetails extends ShippingZoneMethodRaw {
  method_name?: string
  zone_name?: string
  zone_districts?: any
}

export class ShippingZoneMethodRepository {
  public async getZoneMethodById(
    id: number
  ): Promise<ShippingZoneMethodRaw | null> {
    const methods = await executeQuery<ShippingZoneMethodRaw[]>({
      query: 'SELECT * FROM shipping_zone_methods WHERE id = ?',
      values: [id]
    })

    if (methods.length === 0) return null
    return methods[0]
  }

  public async getZoneMethodByIds(
    shippingMethodId: number,
    shippingZoneId: number
  ): Promise<ShippingZoneMethodRaw | null> {
    const methods = await executeQuery<ShippingZoneMethodRaw[]>({
      query: `
        SELECT * FROM shipping_zone_methods 
        WHERE shipping_method_id = ? AND shipping_zone_id = ?
        AND is_active = 1
      `,
      values: [shippingMethodId, shippingZoneId]
    })

    if (methods.length === 0) return null
    return methods[0]
  }

  public async getZoneMethodsByShippingMethodId(
    shippingMethodId: number
  ): Promise<ShippingZoneMethodWithDetails[] | null> {
    const methods = await executeQuery<ShippingZoneMethodWithDetails[]>({
      query: `
        SELECT 
          szm.*,
          sz.name as zone_name,
          sz.districts as zone_districts
        FROM shipping_zone_methods szm
        JOIN shipping_zones sz ON szm.shipping_zone_id = sz.id
        WHERE szm.shipping_method_id = ? 
        AND szm.is_active = 1 
        AND sz.is_active = 1
        ORDER BY sz.name ASC
      `,
      values: [shippingMethodId]
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getZoneMethodsByZoneId(
    shippingZoneId: number
  ): Promise<ShippingZoneMethodWithDetails[] | null> {
    const methods = await executeQuery<ShippingZoneMethodWithDetails[]>({
      query: `
        SELECT 
          szm.*,
          sm.name as method_name
        FROM shipping_zone_methods szm
        JOIN shipping_methods sm ON szm.shipping_method_id = sm.id
        WHERE szm.shipping_zone_id = ? 
        AND szm.is_active = 1 
        AND sm.is_active = 1
        ORDER BY sm.display_order ASC, sm.name ASC
      `,
      values: [shippingZoneId]
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getAllZoneMethodsWithDetails(): Promise<
    ShippingZoneMethodWithDetails[] | null
  > {
    const methods = await executeQuery<ShippingZoneMethodWithDetails[]>({
      query: `
        SELECT
          szm.*,
          sm.name as method_name,
          sz.name as zone_name,
          sz.districts as zone_districts
        FROM shipping_zone_methods szm
        JOIN shipping_methods sm ON szm.shipping_method_id = sm.id
        JOIN shipping_zones sz ON szm.shipping_zone_id = sz.id
        ORDER BY sz.name ASC, sm.display_order ASC, sm.name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async createZoneMethod(
    method: Omit<ShippingZoneMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingZoneMethodRaw | null> {
    const methodData = {
      ...method,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO shipping_zone_methods SET ?',
      values: [methodData]
    })

    return await this.getZoneMethodById(result.insertId)
  }

  public async updateZoneMethod(
    methodData: Partial<Omit<ShippingZoneMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingZoneMethodRaw | null> {
    const updateData = {
      ...methodData,
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE shipping_zone_methods SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getZoneMethodById(id)
  }

  public async deleteZoneMethod(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM shipping_zone_methods WHERE id = ?',
      values: [id]
    })
  }

  public async activateZoneMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_zone_methods SET is_active = 1, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async deactivateZoneMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_zone_methods SET is_active = 0, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async deleteZoneMethodsByShippingMethodId(
    shippingMethodId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM shipping_zone_methods WHERE shipping_method_id = ?',
      values: [shippingMethodId]
    })
  }

  public async deleteZoneMethodsByZoneId(
    shippingZoneId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM shipping_zone_methods WHERE shipping_zone_id = ?',
      values: [shippingZoneId]
    })
  }
}

const shippingZoneMethodRepository = new ShippingZoneMethodRepository()
export default shippingZoneMethodRepository
