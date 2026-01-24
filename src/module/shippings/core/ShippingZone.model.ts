import { type ShippingZones as ShippingZoneRaw } from '@/types/database'
import { type ShippingZones as ShippingZone } from '@/types/domain'

import oShippingZoneMethodRep from './ShippingZoneMethod.repository'
import {
  type DistrictInfo,
  type ShippingZoneWithMethods
} from './ShippingZone.interfaces'
import { ShippingZoneMapper, ShippingZonesMapper } from './ShippingZone.mapper'
import oShippingZoneRep from './ShippingZone.repository'

export class ShippingZoneModel {
  public async getShippingZones(): Promise<ShippingZone[] | undefined> {
    const zonesRaw = await oShippingZoneRep.getShippingZones()
    return ShippingZonesMapper(zonesRaw)
  }

  public async getAllShippingZones(): Promise<ShippingZone[] | undefined> {
    const zonesRaw = await oShippingZoneRep.getAllShippingZones()
    return ShippingZonesMapper(zonesRaw)
  }

  public async getAllShippingZonesWithMethods(): Promise<
    ShippingZoneWithMethods[] | undefined
  > {
    const zones = await this.getAllShippingZones()
    if (!zones) return undefined

    const zonesWithMethods: ShippingZoneWithMethods[] = []

    for (const zone of zones) {
      const methods = await oShippingZoneMethodRep.getZoneMethodsByZoneId(
        zone.id
      )
      // Get district count from pivot table
      const districtIds = await oShippingZoneRep.getDistrictIdsByZoneId(zone.id)
      zonesWithMethods.push({
        ...zone,
        districtCount: districtIds.length,
        methods: methods || []
      })
    }

    return zonesWithMethods
  }

  public async getShippingZoneById(
    id: number
  ): Promise<ShippingZone | undefined> {
    const zoneRaw = await oShippingZoneRep.getShippingZoneById(id)
    if (!zoneRaw) return undefined
    return ShippingZoneMapper(zoneRaw)
  }

  public async getShippingZoneByAddress(
    district: string,
    province: string,
    department: string
  ): Promise<ShippingZone | undefined> {
    const zoneRaw = await oShippingZoneRep.getShippingZoneByDistrict(
      district,
      province,
      department
    )
    if (!zoneRaw) return undefined
    return ShippingZoneMapper(zoneRaw)
  }

  public async getShippingZonesWithMethods(): Promise<
    ShippingZoneWithMethods[] | undefined
  > {
    const zones = await this.getShippingZones()
    if (!zones) return undefined

    const zonesWithMethods: ShippingZoneWithMethods[] = []

    for (const zone of zones) {
      const methods = await oShippingZoneMethodRep.getZoneMethodsByZoneId(
        zone.id
      )
      zonesWithMethods.push({
        ...zone,
        methods: methods || []
      })
    }

    return zonesWithMethods
  }

  public async createShippingZone(
    zoneData: Omit<ShippingZoneRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingZone | undefined> {
    const created = await oShippingZoneRep.createShippingZone(zoneData)
    if (!created) return undefined
    return ShippingZoneMapper(created)
  }

  public async updateShippingZone(
    zoneData: Partial<Omit<ShippingZoneRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingZone | undefined> {
    const updated = await oShippingZoneRep.updateShippingZone(zoneData, id)
    if (!updated) return undefined
    return ShippingZoneMapper(updated)
  }

  public async deleteShippingZone(id: number): Promise<void> {
    await oShippingZoneRep.deleteShippingZone(id)
  }

  public async activateShippingZone(id: number): Promise<void> {
    await oShippingZoneRep.activateShippingZone(id)
  }

  public async deactivateShippingZone(id: number): Promise<void> {
    await oShippingZoneRep.deactivateShippingZone(id)
  }

  public async addDistrictToZone(
    zoneId: number,
    district: DistrictInfo
  ): Promise<void> {
    await oShippingZoneRep.addDistrictToZone(zoneId, district)
  }

  public async removeDistrictFromZone(
    zoneId: number,
    district: DistrictInfo
  ): Promise<void> {
    await oShippingZoneRep.removeDistrictFromZone(zoneId, district)
  }

  // Get district IDs from pivot table
  public async getDistrictIdsByZoneId(zoneId: number): Promise<number[]> {
    return await oShippingZoneRep.getDistrictIdsByZoneId(zoneId)
  }

  // Set district IDs for a zone using pivot table
  public async setDistrictIdsForZone(zoneId: number, districtIds: number[]): Promise<void> {
    await oShippingZoneRep.setDistrictIdsForZone(zoneId, districtIds)
  }

  // Find zone by district ID
  public async getShippingZoneByDistrictId(districtId: number): Promise<ShippingZone | undefined> {
    const zoneRaw = await oShippingZoneRep.getShippingZoneByDistrictId(districtId)
    if (!zoneRaw) return undefined
    return ShippingZoneMapper(zoneRaw)
  }

  // Helper method to get formatted districts
  public getDistrictsFromZone(zone: ShippingZone): DistrictInfo[] {
    if (!zone.districts) return []

    if (Array.isArray(zone.districts)) {
      return zone.districts as DistrictInfo[]
    }

    try {
      return JSON.parse(zone.districts as string) as DistrictInfo[]
    } catch {
      return []
    }
  }

  // Method to check if an address is in a zone
  public isAddressInZone(
    zone: ShippingZone,
    district: string,
    province: string,
    department: string
  ): boolean {
    const districts = this.getDistrictsFromZone(zone)

    return districts.some(
      (d) =>
        d.name.toLowerCase() === district.toLowerCase() &&
        d.province.toLowerCase() === province.toLowerCase() &&
        d.department.toLowerCase() === department.toLowerCase()
    )
  }
}

const shippingZoneModel = new ShippingZoneModel()
export default shippingZoneModel
