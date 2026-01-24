import { DistrictMapper, DistrictsMapper, type District } from './District.mapper'
import districtRepository, { type DistrictZone } from './District.repository'

export class DistrictModel {
  /**
   * Get all active districts (for customer-facing selects)
   */
  public async getDistricts(): Promise<District[] | undefined> {
    const districtsRaw = await districtRepository.getDistricts()
    return DistrictsMapper(districtsRaw)
  }

  /**
   * Get all districts including inactive (for admin)
   */
  public async getAllDistricts(): Promise<District[] | undefined> {
    const districtsRaw = await districtRepository.getAllDistricts()
    return DistrictsMapper(districtsRaw)
  }

  /**
   * Get district by ID
   */
  public async getDistrictById(id: number): Promise<District | undefined> {
    const districtRaw = await districtRepository.getDistrictById(id)
    if (!districtRaw) return undefined
    return DistrictMapper(districtRaw)
  }

  /**
   * Get district by INEI code
   */
  public async getDistrictByCode(code: string): Promise<District | undefined> {
    const districtRaw = await districtRepository.getDistrictByCode(code)
    if (!districtRaw) return undefined
    return DistrictMapper(districtRaw)
  }

  /**
   * Get districts by geographic zone
   */
  public async getDistrictsByZone(zone: DistrictZone): Promise<District[] | undefined> {
    const districtsRaw = await districtRepository.getDistrictsByZone(zone)
    return DistrictsMapper(districtsRaw)
  }

  /**
   * Get districts grouped by zone (for UI)
   */
  public async getDistrictsGroupedByZone(): Promise<Record<string, District[]> | undefined> {
    const districts = await this.getDistricts()
    if (!districts) return undefined

    const grouped: Record<string, District[]> = {}
    districts.forEach(district => {
      const zoneName = district.zoneName
      if (!grouped[zoneName]) {
        grouped[zoneName] = []
      }
      grouped[zoneName].push(district)
    })

    return grouped
  }

  /**
   * Update district active status (admin)
   */
  public async updateDistrictStatus(id: number, isActive: boolean): Promise<void> {
    await districtRepository.updateDistrictStatus(id, isActive)
  }

  // Shipping zone methods

  /**
   * Get districts assigned to a shipping zone
   */
  public async getDistrictsByShippingZone(zoneId: number): Promise<District[] | undefined> {
    const districtsRaw = await districtRepository.getDistrictsByShippingZone(zoneId)
    return DistrictsMapper(districtsRaw)
  }

  /**
   * Set districts for a shipping zone (replaces existing)
   */
  public async setShippingZoneDistricts(zoneId: number, districtIds: number[]): Promise<void> {
    await districtRepository.setShippingZoneDistricts(zoneId, districtIds)
  }

  /**
   * Get shipping zone ID for a district
   */
  public async getShippingZoneByDistrict(districtId: number): Promise<number | null> {
    return await districtRepository.getShippingZoneByDistrict(districtId)
  }
}

const districtModel = new DistrictModel()
export default districtModel
