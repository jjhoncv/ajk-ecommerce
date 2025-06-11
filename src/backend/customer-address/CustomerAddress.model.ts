import { CustomersAddresses as CustomerAddressRaw } from '@/types/database'
import { CustomersAddresses as CustomerAddress } from '@/types/domain'

// me
import {
  CustomerAddressMapper,
  CustomerAddressesMapper
} from './CustomerAddress.mapper'
import oCustomerAddressRep from './CustomerAddress.repository'

export class CustomerAddressModel {
  public async getAddress(id: number): Promise<CustomerAddress | undefined> {
    const addressRaw = await oCustomerAddressRep.getAddress(id)
    if (!addressRaw) return undefined
    return CustomerAddressMapper(addressRaw)
  }

  public async getAddressByCustomer(
    id: number
  ): Promise<CustomerAddress[] | undefined> {
    const addressesRaw = await oCustomerAddressRep.getAddressByCustomer(id)
    return CustomerAddressesMapper(addressesRaw)
  }

  public async getAddresses(): Promise<CustomerAddress[] | undefined> {
    const addressesRaw = await oCustomerAddressRep.getAddresses()
    return CustomerAddressesMapper(addressesRaw)
  }

  public async createAddress(
    addressData: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CustomerAddress | undefined> {
    const created = await oCustomerAddressRep.createAddress(addressData)
    if (!created) return undefined
    return CustomerAddressMapper(created)
  }

  public async updateAddress(
    addressData: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<CustomerAddress | undefined> {
    const updated = await oCustomerAddressRep.updateAddress(addressData, id)
    if (!updated) return undefined
    return CustomerAddressMapper(updated)
  }

  public async deleteAddress(id: number): Promise<void> {
    return await oCustomerAddressRep.deleteAddress(id)
  }
}

const customerAddressModel = new CustomerAddressModel()
export default customerAddressModel
