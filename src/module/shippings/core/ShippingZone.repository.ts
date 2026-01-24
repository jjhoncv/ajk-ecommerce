import { executeQuery } from '@/lib/db'
import { type ShippingZones as ShippingZoneRaw } from '@/types/database'
import { type DistrictInfo } from './ShippingZone.interfaces'

export class ShippingZoneRepository {
  public async getShippingZones(): Promise<ShippingZoneRaw[] | null> {
    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT * FROM shipping_zones
        WHERE is_active = 1
        ORDER BY name ASC
      `
    })

    if (zones.length === 0) return null
    return zones
  }

  public async getAllShippingZones(): Promise<ShippingZoneRaw[] | null> {
    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT * FROM shipping_zones
        ORDER BY name ASC
      `
    })

    if (zones.length === 0) return null
    return zones
  }

  public async getShippingZoneById(
    id: number
  ): Promise<ShippingZoneRaw | null> {
    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: 'SELECT * FROM shipping_zones WHERE id = ?',
      values: [id]
    })

    if (zones.length === 0) return null
    return zones[0]
  }

  // Get district IDs from pivot table
  public async getDistrictIdsByZoneId(zoneId: number): Promise<number[]> {
    const results = await executeQuery<Array<{ district_id: number }>>({
      query: 'SELECT district_id FROM shipping_zone_districts WHERE zone_id = ?',
      values: [zoneId]
    })
    return results.map(r => r.district_id)
  }

  // Set district IDs for a zone (replaces existing)
  public async setDistrictIdsForZone(zoneId: number, districtIds: number[]): Promise<void> {
    // Delete existing relationships
    await executeQuery({
      query: 'DELETE FROM shipping_zone_districts WHERE zone_id = ?',
      values: [zoneId]
    })

    // Insert new relationships
    if (districtIds.length > 0) {
      const values = districtIds.map(districtId => [zoneId, districtId])
      await executeQuery({
        query: 'INSERT INTO shipping_zone_districts (zone_id, district_id) VALUES ?',
        values: [values]
      })
    }
  }

  // Find zone by district ID (using pivot table)
  public async getShippingZoneByDistrictId(districtId: number): Promise<ShippingZoneRaw | null> {
    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT sz.* FROM shipping_zones sz
        INNER JOIN shipping_zone_districts szd ON sz.id = szd.zone_id
        WHERE szd.district_id = ?
        AND sz.is_active = 1
        LIMIT 1
      `,
      values: [districtId]
    })

    if (zones.length === 0) return null
    return zones[0]
  }

  public async getShippingZoneByDistrict(
    district: string,
    province?: string,
    department?: string
  ): Promise<ShippingZoneRaw | null> {
    // First try to find by district ID through pivot table
    const zoneByPivot = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT sz.* FROM shipping_zones sz
        INNER JOIN shipping_zone_districts szd ON sz.id = szd.zone_id
        INNER JOIN districts d ON szd.district_id = d.id
        WHERE d.name = ?
        AND sz.is_active = 1
        LIMIT 1
      `,
      values: [district]
    })

    if (zoneByPivot.length > 0) return zoneByPivot[0]

    // Fallback: Search for zone containing the complete object {name, province, department} (legacy JSON)
    const searchObject = {
      name: district,
      province: province ?? '',
      department: department ?? ''
    }

    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT * FROM shipping_zones
        WHERE JSON_CONTAINS(districts, ?)
        AND is_active = 1
        LIMIT 1
      `,
      values: [JSON.stringify(searchObject)]
    })

    if (zones.length === 0) return null
    return zones[0]
  }

  public async createShippingZone(
    zone: Omit<ShippingZoneRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingZoneRaw | null> {
    const zoneData = {
      ...zone,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO shipping_zones SET ?',
      values: [zoneData]
    })

    return await this.getShippingZoneById(result.insertId)
  }

  public async updateShippingZone(
    zoneData: Partial<Omit<ShippingZoneRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingZoneRaw | null> {
    const updateData = {
      ...zoneData,
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE shipping_zones SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getShippingZoneById(id)
  }

  public async deleteShippingZone(id: number): Promise<void> {
    // Delete relationships with districts (pivot table)
    await executeQuery({
      query: 'DELETE FROM shipping_zone_districts WHERE zone_id = ?',
      values: [id]
    })

    // Delete relationships with shipping methods
    await executeQuery({
      query: 'DELETE FROM shipping_zone_methods WHERE shipping_zone_id = ?',
      values: [id]
    })

    // Then delete the zone
    await executeQuery({
      query: 'DELETE FROM shipping_zones WHERE id = ?',
      values: [id]
    })
  }

  public async activateShippingZone(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_zones SET is_active = 1, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async deactivateShippingZone(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE shipping_zones SET is_active = 0, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async addDistrictToZone(
    zoneId: number,
    district: DistrictInfo
  ): Promise<void> {
    // Get current zone
    const zone = await this.getShippingZoneById(zoneId)
    if (!zone) throw new Error('Zona de envío no encontrada')

    // Parse current districts
    const currentDistricts = Array.isArray(zone.districts)
      ? zone.districts
      : JSON.parse(zone.districts as string)

    // Add new district if not exists
    const exists = currentDistricts.some(
      (d: DistrictInfo) =>
        d.name === district.name &&
        d.province === district.province &&
        d.department === district.department
    )

    if (!exists) {
      currentDistricts.push(district)

      await executeQuery({
        query:
          'UPDATE shipping_zones SET districts = ?, updated_at = ? WHERE id = ?',
        values: [JSON.stringify(currentDistricts), new Date(), zoneId]
      })
    }
  }

  public async removeDistrictFromZone(
    zoneId: number,
    district: DistrictInfo
  ): Promise<void> {
    // Get current zone
    const zone = await this.getShippingZoneById(zoneId)
    if (!zone) throw new Error('Zona de envío no encontrada')

    // Parse current districts
    const currentDistricts = Array.isArray(zone.districts)
      ? zone.districts
      : JSON.parse(zone.districts as string)

    // Filter out the district to remove
    const updatedDistricts = currentDistricts.filter(
      (d: DistrictInfo) =>
        !(
          d.name === district.name &&
          d.province === district.province &&
          d.department === district.department
        )
    )

    await executeQuery({
      query:
        'UPDATE shipping_zones SET districts = ?, updated_at = ? WHERE id = ?',
      values: [JSON.stringify(updatedDistricts), new Date(), zoneId]
    })
  }
}

const shippingZoneRepository = new ShippingZoneRepository()
export default shippingZoneRepository
