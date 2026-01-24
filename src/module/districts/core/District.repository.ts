import { executeQuery } from '@/lib/db'

export type DistrictZone = 'lima_centro' | 'lima_norte' | 'lima_sur' | 'lima_este' | 'callao'

export interface DistrictRaw {
  id: number
  code: string
  name: string
  zone: DistrictZone
  is_active: number
  created_at: string
}

export class DistrictRepository {
  public async getDistricts(): Promise<DistrictRaw[] | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: 'SELECT * FROM districts WHERE is_active = 1 ORDER BY name ASC'
    })

    if (districts.length === 0) return null
    return districts
  }

  public async getAllDistricts(): Promise<DistrictRaw[] | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: 'SELECT * FROM districts ORDER BY zone, name ASC'
    })

    if (districts.length === 0) return null
    return districts
  }

  public async getDistrictById(id: number): Promise<DistrictRaw | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: 'SELECT * FROM districts WHERE id = ?',
      values: [id]
    })

    if (districts.length === 0) return null
    return districts[0]
  }

  public async getDistrictByCode(code: string): Promise<DistrictRaw | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: 'SELECT * FROM districts WHERE code = ?',
      values: [code]
    })

    if (districts.length === 0) return null
    return districts[0]
  }

  public async getDistrictsByZone(zone: DistrictZone): Promise<DistrictRaw[] | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: 'SELECT * FROM districts WHERE zone = ? AND is_active = 1 ORDER BY name ASC',
      values: [zone]
    })

    if (districts.length === 0) return null
    return districts
  }

  public async updateDistrictStatus(id: number, isActive: boolean): Promise<void> {
    await executeQuery({
      query: 'UPDATE districts SET is_active = ? WHERE id = ?',
      values: [isActive ? 1 : 0, id]
    })
  }

  // Shipping zone districts methods
  public async getDistrictsByShippingZone(zoneId: number): Promise<DistrictRaw[] | null> {
    const districts = await executeQuery<DistrictRaw[]>({
      query: `
        SELECT d.* FROM districts d
        INNER JOIN shipping_zone_districts szd ON d.id = szd.district_id
        WHERE szd.zone_id = ?
        ORDER BY d.name ASC
      `,
      values: [zoneId]
    })

    if (districts.length === 0) return null
    return districts
  }

  public async addDistrictToShippingZone(zoneId: number, districtId: number): Promise<void> {
    await executeQuery({
      query: 'INSERT IGNORE INTO shipping_zone_districts (zone_id, district_id) VALUES (?, ?)',
      values: [zoneId, districtId]
    })
  }

  public async removeDistrictFromShippingZone(zoneId: number, districtId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM shipping_zone_districts WHERE zone_id = ? AND district_id = ?',
      values: [zoneId, districtId]
    })
  }

  public async setShippingZoneDistricts(zoneId: number, districtIds: number[]): Promise<void> {
    // Remove all existing districts for this zone
    await executeQuery({
      query: 'DELETE FROM shipping_zone_districts WHERE zone_id = ?',
      values: [zoneId]
    })

    // Insert new districts
    if (districtIds.length > 0) {
      const values = districtIds.map(districtId => [zoneId, districtId])
      await executeQuery({
        query: 'INSERT INTO shipping_zone_districts (zone_id, district_id) VALUES ?',
        values: [values]
      })
    }
  }

  public async getShippingZoneByDistrict(districtId: number): Promise<number | null> {
    const result = await executeQuery<{ zone_id: number }[]>({
      query: 'SELECT zone_id FROM shipping_zone_districts WHERE district_id = ? LIMIT 1',
      values: [districtId]
    })

    if (result.length === 0) return null
    return result[0].zone_id
  }
}

const districtRepository = new DistrictRepository()
export default districtRepository
