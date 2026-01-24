import { type Customers as CustomerRaw } from '@/types/database'
import { type Customers as Customer } from '@/types/domain'

import { CustomerMapper, CustomersMapper } from './Customer.mapper'
import oCustomerRep, { type CustomerWithStats } from './Customer.repository'

export interface CustomerWithStatsDTO {
  id: number
  email: string
  name: string
  lastname: string
  phone: string | null
  dni: string | null
  photo: string | null
  isActive: number
  createdAt: string
  ordersCount: number
  totalSpent: number
  addressesCount: number
  lastOrderDate: string | null
}

function CustomerWithStatsMapper(raw: CustomerWithStats): CustomerWithStatsDTO {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    lastname: raw.lastname,
    phone: raw.phone ?? null,
    dni: raw.dni ?? null,
    photo: raw.photo ?? null,
    isActive: raw.is_active ?? 1,
    createdAt: raw.created_at instanceof Date ? raw.created_at.toISOString() : raw.created_at,
    ordersCount: Number(raw.orders_count) || 0,
    totalSpent: Number(raw.total_spent) || 0,
    addressesCount: Number(raw.addresses_count) || 0,
    lastOrderDate: raw.last_order_date
  }
}

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

  public async getCustomersWithStats(): Promise<CustomerWithStatsDTO[] | undefined> {
    const customersRaw = await oCustomerRep.getCustomersWithStats()
    if (!customersRaw) return undefined
    return customersRaw.map(CustomerWithStatsMapper)
  }

  public async getCustomerWithStats(id: number): Promise<CustomerWithStatsDTO | undefined> {
    const customerRaw = await oCustomerRep.getCustomerWithStats(id)
    if (!customerRaw) return undefined
    return CustomerWithStatsMapper(customerRaw)
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
