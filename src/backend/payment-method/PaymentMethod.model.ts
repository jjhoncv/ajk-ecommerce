// 📄 PaymentMethod.model.ts
import { PaymentMethods as PaymentMethodRaw } from '@/types/database'
import { PaymentMethods as PaymentMethod } from '@/types/domain'

import {
  PaymentCalculation,
  PaymentMethodExtended,
  PaymentMethodFilter
} from './PaymentMethod.interfaces'
import {
  PaymentMethodMapper,
  PaymentMethodsMapper
} from './PaymentMethod.mapper'
import oPaymentMethodRep from './PaymentMethod.repository'

export class PaymentMethodModel {
  public async getPaymentMethods(): Promise<PaymentMethod[] | undefined> {
    const methodsRaw = await oPaymentMethodRep.getPaymentMethods()
    return PaymentMethodsMapper(methodsRaw)
  }

  public async getAllPaymentMethods(): Promise<PaymentMethod[] | undefined> {
    const methodsRaw = await oPaymentMethodRep.getAllPaymentMethods()
    return PaymentMethodsMapper(methodsRaw)
  }

  public async getPaymentMethodById(
    id: number
  ): Promise<PaymentMethod | undefined> {
    const methodRaw = await oPaymentMethodRep.getPaymentMethodById(id)
    if (!methodRaw) return undefined
    return PaymentMethodMapper(methodRaw)
  }

  public async getPaymentMethodByCode(
    code: string
  ): Promise<PaymentMethod | undefined> {
    const methodRaw = await oPaymentMethodRep.getPaymentMethodByCode(code)
    if (!methodRaw) return undefined
    return PaymentMethodMapper(methodRaw)
  }

  public async getPaymentMethodsForAmount(
    amount: number
  ): Promise<PaymentMethod[] | undefined> {
    const methodsRaw =
      await oPaymentMethodRep.getPaymentMethodsForAmount(amount)
    return PaymentMethodsMapper(methodsRaw)
  }

  public async getPaymentMethodsWithStats(): Promise<
    PaymentMethodExtended[] | undefined
  > {
    const methodsRaw = await oPaymentMethodRep.getPaymentMethodsWithStats()
    if (!methodsRaw) return undefined

    return methodsRaw.map((method) => ({
      ...PaymentMethodMapper(method),
      totalTransactions: method.total_transactions,
      totalAmount: method.total_amount,
      lastUsed: method.last_used
    }))
  }

  public async getFilteredPaymentMethods(
    filter: PaymentMethodFilter = {}
  ): Promise<PaymentMethod[] | undefined> {
    let methods = await this.getPaymentMethods()
    if (!methods) return undefined

    // Aplicar filtros
    if (filter.isActive !== undefined) {
      methods = methods.filter(
        (method) => (method.isActive === 1) === filter.isActive
      )
    }

    if (filter.orderValue !== undefined) {
      methods = methods.filter((method) => {
        const min = method.minAmount
        const max = method.maxAmount
        const value = filter.orderValue!

        const validMin = min === null || min === undefined || value >= min
        const validMax = max === null || max === undefined || value <= max

        return validMin && validMax
      })
    }

    if (filter.minAmount !== undefined) {
      methods = methods.filter(
        (method) =>
          method.minAmount === null ||
          method.minAmount === undefined ||
          method.minAmount <= filter.minAmount!
      )
    }

    if (filter.maxAmount !== undefined) {
      methods = methods.filter(
        (method) =>
          method.maxAmount === null ||
          method.maxAmount === undefined ||
          method.maxAmount >= filter.maxAmount!
      )
    }

    return methods
  }

  public async createPaymentMethod(
    methodData: Omit<PaymentMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PaymentMethod | undefined> {
    const created = await oPaymentMethodRep.createPaymentMethod(methodData)
    if (!created) return undefined
    return PaymentMethodMapper(created)
  }

  public async updatePaymentMethod(
    methodData: Partial<Omit<PaymentMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<PaymentMethod | undefined> {
    const updated = await oPaymentMethodRep.updatePaymentMethod(methodData, id)
    if (!updated) return undefined
    return PaymentMethodMapper(updated)
  }

  public async deletePaymentMethod(id: number): Promise<void> {
    return await oPaymentMethodRep.deletePaymentMethod(id)
  }

  public async activatePaymentMethod(id: number): Promise<void> {
    return await oPaymentMethodRep.activatePaymentMethod(id)
  }

  public async deactivatePaymentMethod(id: number): Promise<void> {
    return await oPaymentMethodRep.deactivatePaymentMethod(id)
  }

  public async updateDisplayOrder(
    id: number,
    displayOrder: number
  ): Promise<void> {
    return await oPaymentMethodRep.updateDisplayOrder(id, displayOrder)
  }

  public async updateSettings(id: number, settings: any): Promise<void> {
    return await oPaymentMethodRep.updateSettings(id, settings)
  }

  // Método para calcular comisiones y validar un método de pago
  public calculatePaymentFee(
    method: PaymentMethod,
    amount: number
  ): PaymentCalculation {
    // Validar límites de monto
    const isValidAmount = this.isValidAmountForMethod(method, amount)

    let processingFee = 0

    if (method.processingFeeValue && method.processingFeeValue > 0) {
      if (method.processingFeeType === 'percentage') {
        processingFee = (amount * method.processingFeeValue) / 100
      } else {
        processingFee = method.processingFeeValue
      }
    }

    return {
      methodId: method.id,
      baseAmount: amount,
      processingFee,
      finalAmount: amount + processingFee,
      feeType: method.processingFeeType || 'fixed',
      isValid: isValidAmount.isValid,
      reason: isValidAmount.reason
    }
  }

  // Método para validar si un monto es válido para un método
  public isValidAmountForMethod(
    method: PaymentMethod,
    amount: number
  ): { isValid: boolean; reason?: string } {
    if (method.minAmount && amount < method.minAmount) {
      return {
        isValid: false,
        reason: `Monto mínimo: S/ ${method.minAmount}`
      }
    }

    if (method.maxAmount && amount > method.maxAmount) {
      return {
        isValid: false,
        reason: `Monto máximo: S/ ${method.maxAmount}`
      }
    }

    return { isValid: true }
  }

  // Método para obtener métodos de pago válidos para un monto
  public async getValidPaymentMethodsForAmount(
    amount: number
  ): Promise<PaymentCalculation[] | undefined> {
    const methods = await this.getPaymentMethods()
    if (!methods) return undefined

    const validMethods: PaymentCalculation[] = []

    for (const method of methods) {
      const calculation = this.calculatePaymentFee(method, amount)
      if (calculation.isValid) {
        validMethods.push(calculation)
      }
    }

    return validMethods.length > 0 ? validMethods : undefined
  }

  // Método para verificar si un método requiere verificación adicional
  public requiresVerification(method: PaymentMethod): boolean {
    return method.requiresVerification === 1
  }

  // Método para obtener configuraciones específicas de un método
  public getMethodSettings(method: PaymentMethod): any {
    if (!method.settings) return {}

    try {
      return typeof method.settings === 'string'
        ? JSON.parse(method.settings)
        : method.settings
    } catch {
      return {}
    }
  }
}

const paymentMethodModel = new PaymentMethodModel()
export default paymentMethodModel
