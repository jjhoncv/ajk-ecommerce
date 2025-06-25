import { type Customers as CustomerRaw } from '@/types/database'
import { type Customers as Customer } from '@/types/domain'

// me
import { CustomerMapper, CustomersMapper } from './Customer.mapper'
import oCustomerRep from './Customer.repository'

export class CustomerModel {
  public async getCustomerByEmail(
    email: string
  ): Promise<Customer | undefined> {
    const customerRaw = await oCustomerRep.getCustomerByEmail(email)
    if (!customerRaw) return undefined
    return CustomerMapper(customerRaw)
  }

  public async getCustomers(): Promise<Customer[] | undefined> {
    const customersRaw = await oCustomerRep.getCustomers()
    return CustomersMapper(customersRaw)
  }

  public async getCustomer(id: number): Promise<Customer | undefined> {
    const customerRaw = await oCustomerRep.getCustomer(id)
    if (!customerRaw) return undefined
    return CustomerMapper(customerRaw)
  }

  public async createCustomer(
    customerData: Omit<Customer, 'id' | 'dni' | 'phone' | 'photo'>
  ): Promise<Customer | undefined> {
    const created = await oCustomerRep.createCustomer(customerData)
    if (created == null) return undefined
    return CustomerMapper(created)
  }

  public async updateCustomer(
    customerData: Partial<CustomerRaw>,
    id: number
  ): Promise<Customer | undefined> {
    const updated = await oCustomerRep.updateCustomer(customerData, id)
    if (!updated) return undefined
    return CustomerMapper(updated)
  }

  public async deleteCustomer(id: number): Promise<void> {
    await oCustomerRep.deleteCustomer(id)
  }
}

const customerModel = new CustomerModel()
export default customerModel
