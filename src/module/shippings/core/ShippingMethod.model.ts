import { type ShippingMethods as ShippingMethodRaw } from '@/types/database'
import { type ShippingMethods as ShippingMethod } from '@/types/domain'

import oShippingZoneMethodRep from './ShippingZoneMethod.repository'
import { type ShippingMethodWithZones } from './ShippingMethod.interfaces'

import {
  ShippingMethodMapper,
  ShippingMethodsMapper
} from './ShippingMethod.mapper'
import oShippingMethodRep from './ShippingMethod.repository'

export class ShippingMethodModel {
  public async getShippingMethods(): Promise<ShippingMethod[] | undefined> {
    const methodsRaw = await oShippingMethodRep.getShippingMethods()
    return ShippingMethodsMapper(methodsRaw)
  }

  public async getAllShippingMethods(): Promise<ShippingMethod[] | undefined> {
    const methodsRaw = await oShippingMethodRep.getAllShippingMethods()
    return ShippingMethodsMapper(methodsRaw)
  }

  public async getShippingMethodById(
    id: number
  ): Promise<ShippingMethod | undefined> {
    const methodRaw = await oShippingMethodRep.getShippingMethodById(id)
    if (!methodRaw) return undefined
    return ShippingMethodMapper(methodRaw)
  }

  public async getShippingMethodsByZoneId(
    zoneId: number
  ): Promise<ShippingMethod[] | undefined> {
    const methodsRaw =
      await oShippingMethodRep.getShippingMethodsByZoneId(zoneId)
    return ShippingMethodsMapper(methodsRaw)
  }

  public async getShippingMethodsWithZones(): Promise<
    ShippingMethodWithZones[] | undefined
  > {
    const methods = await this.getShippingMethods()
    if (!methods) return undefined

    const methodsWithZones: ShippingMethodWithZones[] = []

    for (const method of methods) {
      const zones =
        await oShippingZoneMethodRep.getZoneMethodsByShippingMethodId(method.id)
      methodsWithZones.push({
        ...method,
        zones: zones || []
      })
    }

    return methodsWithZones
  }

  public async getAllShippingMethodsWithZones(): Promise<
    ShippingMethodWithZones[] | undefined
  > {
    const methods = await this.getAllShippingMethods()
    if (!methods) return undefined

    const methodsWithZones: ShippingMethodWithZones[] = []

    for (const method of methods) {
      const zones =
        await oShippingZoneMethodRep.getZoneMethodsByShippingMethodId(method.id)
      methodsWithZones.push({
        ...method,
        zones: zones || []
      })
    }

    return methodsWithZones
  }

  public async createShippingMethod(
    methodData: Omit<ShippingMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingMethod | undefined> {
    const created = await oShippingMethodRep.createShippingMethod(methodData)
    if (!created) return undefined
    return ShippingMethodMapper(created)
  }

  public async updateShippingMethod(
    methodData: Partial<Omit<ShippingMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingMethod | undefined> {
    const updated = await oShippingMethodRep.updateShippingMethod(
      methodData,
      id
    )
    if (!updated) return undefined
    return ShippingMethodMapper(updated)
  }

  public async deleteShippingMethod(id: number): Promise<void> {
    await oShippingMethodRep.deleteShippingMethod(id)
  }

  public async activateShippingMethod(id: number): Promise<void> {
    await oShippingMethodRep.activateShippingMethod(id)
  }

  public async deactivateShippingMethod(id: number): Promise<void> {
    await oShippingMethodRep.deactivateShippingMethod(id)
  }

  // Method to calculate shipping cost for a specific zone
  public async calculateShippingCost(
    methodId: number,
    zoneId: number,
    orderValue: number
  ): Promise<{ cost: number, isFree: boolean } | undefined> {
    const zoneMethod = await oShippingZoneMethodRep.getZoneMethodByIds(
      methodId,
      zoneId
    )
    if (!zoneMethod) return undefined

    // Only free if there's a configured threshold (> 0) and order value exceeds it
    const threshold = Number(zoneMethod.free_shipping_threshold) || 0
    const isFree = threshold > 0 && orderValue >= threshold

    return {
      cost: isFree ? 0 : zoneMethod.cost,
      isFree
    }
  }
}

const shippingMethodModel = new ShippingMethodModel()
export default shippingMethodModel
