import { executeQuery } from '@/lib/db'
import { CustomersAddresses as CustomerAddressRaw } from '@/types/database'
import { CustomersAddresses as CustomerAddress } from '@/types/domain'

import {
  mapCustomerAddress,
  mapCustomerAddresses
} from '@/mappers/mapCustomerAddress'
import oCustomerAddressRep from '@/repository/CustomerAddress.repository'

export class CustomerAddressModel {
  public async getAddress(id: number): Promise<CustomerAddress | undefined> {
    const address = await oCustomerAddressRep.getAddress(id)
    if (address === null) return undefined
    return mapCustomerAddress(address)
  }

  public async getAddressByCustomer(
    id: number
  ): Promise<CustomerAddress[] | undefined> {
    const addresses = await oCustomerAddressRep.getAddressByCustomer(id)
    return mapCustomerAddresses(addresses)
  }

  public async getAddresses(): Promise<CustomerAddress[] | undefined> {
    const addresses = await oCustomerAddressRep.getAddresses()
    return mapCustomerAddresses(addresses)
  }

  public async createAddress(
    address: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CustomerAddress | undefined> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO customers_addresses SET ?',
      values: [address]
    })

    return await this.getAddress(result.insertId)
  }

  public async updateAddress(
    addressData: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<CustomerAddress | undefined> {
    await executeQuery({
      query: 'UPDATE customers_addresses SET ? WHERE id=?',
      values: [addressData, id]
    })

    return await this.getAddress(id)
  }

  public async deleteAddress(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM customers_addresses WHERE id=?',
      values: [id]
    })
  }
}

const customerAddressModel = new CustomerAddressModel()
export default customerAddressModel
