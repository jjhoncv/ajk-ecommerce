// 📄 ShippingMethod.model.ts
import { ShippingMethods as ShippingMethodRaw } from '@/types/database'
import { ShippingMethods as ShippingMethod } from '@/types/domain'

import oShippingZoneMethodRep from '@/backend/shipping-zone-method/ShippingZoneMethod.repository'
import { ShippingMethodWithZones } from './ShippingMethod.interfaces'

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
    return await oShippingMethodRep.deleteShippingMethod(id)
  }

  public async activateShippingMethod(id: number): Promise<void> {
    return await oShippingMethodRep.activateShippingMethod(id)
  }

  public async deactivateShippingMethod(id: number): Promise<void> {
    return await oShippingMethodRep.deactivateShippingMethod(id)
  }

  // Método para calcular el costo de envío para una zona específica
  public async calculateShippingCost(
    methodId: number,
    zoneId: number,
    orderValue: number
  ): Promise<{ cost: number; isFree: boolean } | undefined> {
    const zoneMethod = await oShippingZoneMethodRep.getZoneMethodByIds(
      methodId,
      zoneId
    )
    if (!zoneMethod) return undefined

    const threshold = zoneMethod.free_shipping_threshold || null
    const isFree = threshold !== null && orderValue >= threshold

    return {
      cost: isFree ? 0 : zoneMethod.cost,
      isFree
    }
  }
}

const shippingMethodModel = new ShippingMethodModel()
export default shippingMethodModel
