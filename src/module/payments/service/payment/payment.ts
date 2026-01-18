import { paymentMethodModel } from '../../core'

export const getPaymentMethods = async () => {
  return await paymentMethodModel.getAllPaymentMethods()
}

export const getPaymentMethodById = async (id: number) => {
  return await paymentMethodModel.getPaymentMethodById(id)
}

export const getActivePaymentMethods = async () => {
  return await paymentMethodModel.getActivePaymentMethods()
}
