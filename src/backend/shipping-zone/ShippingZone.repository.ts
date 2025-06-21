// 📄 ShippingZone.repository.ts
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

  public async getShippingZoneByDistrict(
    district: string,
    province?: string,
    department?: string
  ): Promise<ShippingZoneRaw | null> {
    const zones = await executeQuery<ShippingZoneRaw[]>({
      query: `
        SELECT * FROM shipping_zones 
        WHERE JSON_CONTAINS(districts, ?) 
        AND is_active = 1
        LIMIT 1
      `,
      values: [JSON.stringify(district)]
    })

    // console.log('zones', zones)

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
    // Primero eliminar las relaciones con métodos de envío
    await executeQuery({
      query: 'DELETE FROM shipping_zone_methods WHERE shipping_zone_id = ?',
      values: [id]
    })

    // Luego eliminar la zona
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
    // Obtener la zona actual
    const zone = await this.getShippingZoneById(zoneId)
    if (!zone) throw new Error('Zona de envío no encontrada')

    // Parsear distritos actuales
    const currentDistricts = Array.isArray(zone.districts)
      ? zone.districts
      : JSON.parse(zone.districts as string)

    // Agregar nuevo distrito si no existe
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
    // Obtener la zona actual
    const zone = await this.getShippingZoneById(zoneId)
    if (!zone) throw new Error('Zona de envío no encontrada')

    // Parsear distritos actuales
    const currentDistricts = Array.isArray(zone.districts)
      ? zone.districts
      : JSON.parse(zone.districts as string)

    // Filtrar el distrito a eliminar
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
