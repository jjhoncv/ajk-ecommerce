import { executeQuery } from '@/lib/db'
import { Customers as CustomerRaw } from '@/types/database'

export class CustomerRepository {
  public async getCustomerByEmail(email: string): Promise<CustomerRaw | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers WHERE email = ?',
      values: [email]
    })

    if (customers.length === 0) return null
    return customers[0]
  }

  public async getCustomers(): Promise<CustomerRaw[] | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers'
    })

    if (customers.length === 0) return null
    return customers
  }

  public async getCustomer(id: number): Promise<CustomerRaw | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers WHERE id = ?',
      values: [id]
    })

    if (customers.length === 0) return null
    return customers[0]
  }

  public async createCustomer(
    customer: Omit<CustomerRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CustomerRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO customers SET ?',
      values: [customer]
    })

    return await this.getCustomer(result.insertId)
  }

  public async updateCustomer(
    customerData: Partial<CustomerRaw>,
    id: number
  ): Promise<CustomerRaw | null> {
    await executeQuery({
      query: 'UPDATE customers SET ? WHERE id=?',
      values: [customerData, id]
    })

    return await this.getCustomer(id)
  }

  public async deleteCustomer(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM customers WHERE id=?',
      values: [id]
    })
  }
}

const customerRepository = new CustomerRepository()
export default customerRepository
