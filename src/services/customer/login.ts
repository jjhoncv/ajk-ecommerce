import customerModel from '@/backend/customer'
import { type Customers as Customer } from '@/types/domain'
import bcrypt from 'bcryptjs'

/**
 * Autenticar un cliente con email y contraseña
 */

interface loginProps {
  email: string
  password: string
}

export const login = async ({
  email,
  password: plainPassword
}: loginProps): Promise<Customer | null> => {
  try {
    // Obtener el cliente por email
    const customer = await customerModel.getCustomerByEmail(email)

    // Si no existe el cliente, retornar null
    if (customer === undefined) return null

    // Verificar la contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(
      plainPassword,
      customer.password
    )
    if (!isPasswordValid) return null

    // Obtener el cliente completo con sus roles
    const validCustomer = await customerModel.getCustomer(customer.id)
    if (validCustomer === undefined) return null

    // No devolver la contraseña
    const { password, ...customerWithoutPassword } = validCustomer

    return customerWithoutPassword as Customer
  } catch (error) {
    console.error('Error en login:', error)
    return null
  }
}
