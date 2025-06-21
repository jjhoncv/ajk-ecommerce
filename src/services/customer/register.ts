import customerModel from '@/backend/customer'
import { type Customers as Customer } from '@/types/domain'
import bcrypt from 'bcryptjs'
import { type CustomerData } from './types'

/**
 * Registrar un nuevo cliente
 */

export const register = async (
  customerData: CustomerData
): Promise<Customer | null> => {
  try {
    // Verificar si ya existe un cliente con ese email
    const existingCustomer = await customerModel.getCustomerByEmail(
      customerData.email
    )

    if (existingCustomer?.email != null) {
      throw new Error('El correo electrónico ya está registrado')
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(customerData.password, 10)

    // Crear el cliente con el rol por defecto si no se especifica
    const newCustomer = await customerModel.createCustomer({
      ...customerData,
      password: hashedPassword
    })

    if (newCustomer === undefined) {
      throw new Error('No se pudo crear a Cliente')
    }

    // No devolver la contraseña
    const { password, ...customerWithoutPassword } = newCustomer

    return customerWithoutPassword as Customer
  } catch (error) {
    console.error('Error en register:', error)
    throw error
  }
}
