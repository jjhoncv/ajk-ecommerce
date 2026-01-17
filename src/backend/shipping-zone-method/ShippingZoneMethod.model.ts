// 📄 ShippingZoneMethod.model.ts
import { type ShippingZoneMethods as ShippingZoneMethodRaw } from '@/types/database'
import { type ShippingZoneMethods as ShippingZoneMethod } from '@/types/domain'

import oShippingMethodRep from '@/backend/shipping-method/ShippingMethod.repository'
import oShippingZoneRep from '@/backend/shipping-zone/ShippingZone.repository'

import {
  type ShippingCalculation,
  type ShippingZoneMethodExtended
} from './ShippingZoneMethod.interfaces'
import { ShippingZoneMethodMapper } from './ShippingZoneMethod.mapper'
import oShippingZoneMethodRep from './ShippingZoneMethod.repository'

export class ShippingZoneMethodModel {
  public async getZoneMethodById(
    id: number
  ): Promise<ShippingZoneMethod | undefined> {
    const methodRaw = await oShippingZoneMethodRep.getZoneMethodById(id)
    if (!methodRaw) return undefined
    return ShippingZoneMethodMapper(methodRaw)
  }

  public async getZoneMethodByIds(
    shippingMethodId: number,
    shippingZoneId: number
  ): Promise<ShippingZoneMethod | undefined> {
    const methodRaw = await oShippingZoneMethodRep.getZoneMethodByIds(
      shippingMethodId,
      shippingZoneId
    )
    if (!methodRaw) return undefined
    return ShippingZoneMethodMapper(methodRaw)
  }

  public async getZoneMethodsByShippingMethodId(
    shippingMethodId: number
  ): Promise<ShippingZoneMethodExtended[] | undefined> {
    const methodsRaw =
      await oShippingZoneMethodRep.getZoneMethodsByShippingMethodId(
        shippingMethodId
      )
    if (!methodsRaw) return undefined

    return methodsRaw.map((method) => ({
      ...ShippingZoneMethodMapper(method),
      zoneName: method.zone_name,
      zoneDistricts: method.zone_districts
    }))
  }

  public async getZoneMethodsByZoneId(
    shippingZoneId: number
  ): Promise<ShippingZoneMethodExtended[] | undefined> {
    const methodsRaw =
      await oShippingZoneMethodRep.getZoneMethodsByZoneId(shippingZoneId)
    if (!methodsRaw) return undefined

    return methodsRaw.map((method) => ({
      ...ShippingZoneMethodMapper(method),
      methodName: method.method_name
    }))
  }

  public async getAllZoneMethodsWithDetails(): Promise<
    ShippingZoneMethodExtended[] | undefined
  > {
    const methodsRaw =
      await oShippingZoneMethodRep.getAllZoneMethodsWithDetails()
    if (!methodsRaw) return undefined

    return methodsRaw.map((method) => ({
      ...ShippingZoneMethodMapper(method),
      methodName: method.method_name,
      zoneName: method.zone_name,
      zoneDistricts: method.zone_districts
    }))
  }

  public async createZoneMethod(
    methodData: Omit<ShippingZoneMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ShippingZoneMethod | undefined> {
    const created = await oShippingZoneMethodRep.createZoneMethod(methodData)
    if (!created) return undefined
    return ShippingZoneMethodMapper(created)
  }

  public async updateZoneMethod(
    methodData: Partial<Omit<ShippingZoneMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<ShippingZoneMethod | undefined> {
    const updated = await oShippingZoneMethodRep.updateZoneMethod(
      methodData,
      id
    )
    if (!updated) return undefined
    return ShippingZoneMethodMapper(updated)
  }

  public async deleteZoneMethod(id: number): Promise<void> {
    await oShippingZoneMethodRep.deleteZoneMethod(id)
  }

  public async activateZoneMethod(id: number): Promise<void> {
    await oShippingZoneMethodRep.activateZoneMethod(id)
  }

  public async deactivateZoneMethod(id: number): Promise<void> {
    await oShippingZoneMethodRep.deactivateZoneMethod(id)
  }

  // Método principal para calcular opciones de envío
  public async calculateShippingOptions(
    district: string,
    province: string,
    department: string,
    orderValue: number
  ): Promise<ShippingCalculation[] | undefined> {
    // Buscar la zona que corresponde a la dirección

    const zone = await oShippingZoneRep.getShippingZoneByDistrict(
      district,
      province,
      department
    )

    if (!zone) return undefined

    // Obtener métodos disponibles para esta zona
    const zoneMethods = await oShippingZoneMethodRep.getZoneMethodsByZoneId(
      zone.id
    )
    if (!zoneMethods) return undefined

    const calculations: ShippingCalculation[] = []

    for (const zoneMethod of zoneMethods) {
      // Obtener detalles del método de envío base
      const shippingMethod = await oShippingMethodRep.getShippingMethodById(
        zoneMethod.shipping_method_id
      )
      if (!shippingMethod) continue

      // Calcular si el envío es gratis
      // Solo es gratis si hay un umbral configurado (> 0) y el valor del pedido lo supera
      const threshold = Number(zoneMethod.free_shipping_threshold) || 0
      const isFree = threshold > 0 && orderValue >= threshold

      // Calcular costo final
      const finalCost = isFree ? 0 : zoneMethod.cost

      // Obtener días estimados (usar los específicos de la zona o los del método base)
      const estimatedDaysMin =
        zoneMethod.estimated_days_min ?? shippingMethod.estimated_days_min ?? 1
      const estimatedDaysMax =
        zoneMethod.estimated_days_max ?? shippingMethod.estimated_days_max ?? 7

      calculations.push({
        methodId: shippingMethod.id,
        zoneId: zone.id,
        baseCost: shippingMethod.base_cost,
        finalCost,
        isFree,
        estimatedDays: {
          min: estimatedDaysMin,
          max: estimatedDaysMax
        },
        methodName: shippingMethod.name,
        zoneName: zone.name
      })
    }

    return calculations.length > 0 ? calculations : undefined
  }

  // Método para obtener costo específico de un método en una zona
  public async getShippingCost(
    shippingMethodId: number,
    district: string,
    province: string,
    department: string,
    orderValue: number
  ): Promise<ShippingCalculation | undefined> {
    const zone = await oShippingZoneRep.getShippingZoneByDistrict(
      district,
      province,
      department
    )
    if (!zone) return undefined

    const zoneMethod = await oShippingZoneMethodRep.getZoneMethodByIds(
      shippingMethodId,
      zone.id
    )
    if (!zoneMethod) return undefined

    const shippingMethod =
      await oShippingMethodRep.getShippingMethodById(shippingMethodId)
    if (!shippingMethod) return undefined

    // Solo es gratis si hay un umbral configurado (> 0) y el valor del pedido lo supera
    const threshold = Number(zoneMethod.free_shipping_threshold) || 0
    const isFree = threshold > 0 && orderValue >= threshold
    const finalCost = isFree ? 0 : zoneMethod.cost

    const estimatedDaysMin =
      zoneMethod.estimated_days_min ?? shippingMethod.estimated_days_min ?? 1
    const estimatedDaysMax =
      zoneMethod.estimated_days_max ?? shippingMethod.estimated_days_max ?? 7

    return {
      methodId: shippingMethod.id,
      zoneId: zone.id,
      baseCost: shippingMethod.base_cost,
      finalCost,
      isFree,
      estimatedDays: {
        min: estimatedDaysMin,
        max: estimatedDaysMax
      },
      methodName: shippingMethod.name,
      zoneName: zone.name
    }
  }

  // Método para validar si un método está disponible en una dirección
  public async isMethodAvailableForAddress(
    shippingMethodId: number,
    district: string,
    province: string,
    department: string
  ): Promise<boolean> {
    const zone = await oShippingZoneRep.getShippingZoneByDistrict(
      district,
      province,
      department
    )
    if (!zone) return false

    const zoneMethod = await oShippingZoneMethodRep.getZoneMethodByIds(
      shippingMethodId,
      zone.id
    )
    return zoneMethod !== null
  }
}

const shippingZoneMethodModel = new ShippingZoneMethodModel()
export default shippingZoneMethodModel
