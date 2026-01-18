import { shippingMethodModel, shippingZoneModel } from '../../core'

export const getShippingMethods = async () => {
  return await shippingMethodModel.getAllShippingMethodsWithZones()
}

export const getShippingMethodById = async (id: number) => {
  return await shippingMethodModel.getShippingMethodById(id)
}

export const getShippingZones = async () => {
  return await shippingZoneModel.getAllShippingZonesWithMethods()
}

export const getShippingZoneById = async (id: number) => {
  return await shippingZoneModel.getShippingZoneById(id)
}
