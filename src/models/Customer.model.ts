import { executeQuery } from '@/lib/db'
import { Customers as CustomerRaw } from '@/types/database'
import { Customers as Customer } from '@/types/domain'

import { mapCustomer, mapCustomers } from '@/mappers/mapCustomer'
import oCustomerRep from '@/repository/Customer.repository'

export class CustomerModel {
  public async getCustomerByEmail(
    email: string
  ): Promise<Customer | undefined> {
    const customer = await oCustomerRep.getCustomerByEmail(email)
    if (customer === null) return undefined
    return mapCustomer(customer)
  }

  public async getCustomers(): Promise<Customer[] | undefined> {
    const customers = await oCustomerRep.getCustomers()
    return mapCustomers(customers)
  }

  public async getCustomer(id: number): Promise<Customer | undefined> {
    const customer = await oCustomerRep.getCustomer(id)
    if (customer === null) return undefined
    return mapCustomer(customer)
  }

  public async createCustomer(
    customer: Omit<CustomerRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Customer | undefined> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO customers SET ?',
      values: [customer]
    })

    return await this.getCustomer(result.insertId)
  }

  public async updateCustomer(
    customerData: Partial<CustomerRaw>,
    id: number
  ): Promise<Customer | undefined> {
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

const customerModel = new CustomerModel()
export default customerModel
