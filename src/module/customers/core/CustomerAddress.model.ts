import { type CustomersAddresses } from '@/types/domain'

import {
  CustomerAddressMapper,
  CustomerAddressesMapper
} from './CustomerAddress.mapper'
import customerAddressRepository from './CustomerAddress.repository'

export class CustomerAddressModel {
  public async getAddress(id: number): Promise<CustomersAddresses | undefined> {
    const addressRaw = await customerAddressRepository.getAddress(id)
    if (!addressRaw) return undefined
    return CustomerAddressMapper(addressRaw)
  }

  public async getAddressByCustomer(
    customerId: number
  ): Promise<CustomersAddresses[] | undefined> {
    const addressesRaw =
      await customerAddressRepository.getAddressByCustomer(customerId)
    return CustomerAddressesMapper(addressesRaw)
  }

  public async getAddresses(): Promise<CustomersAddresses[] | undefined> {
    const addressesRaw = await customerAddressRepository.getAddresses()
    return CustomerAddressesMapper(addressesRaw)
  }

  public async createAddress(data: {
    idCustomer: number
    alias: string
    department: string
    province: string
    district: string
    districtId?: number
    streetName: string
    streetNumber: string
    apartment?: string
    reference?: string
    latitude?: number
    longitude?: number
    isDefault?: boolean
  }): Promise<CustomersAddresses | undefined> {
    const created = await customerAddressRepository.createAddress(data)
    if (!created) return undefined
    return CustomerAddressMapper(created)
  }

  public async updateAddress(
    id: number,
    data: {
      alias?: string
      department?: string
      province?: string
      district?: string
      districtId?: number
      streetName?: string
      streetNumber?: string
      apartment?: string
      reference?: string
      latitude?: number
      longitude?: number
    }
  ): Promise<CustomersAddresses | undefined> {
    const updated = await customerAddressRepository.updateAddress(id, data)
    if (!updated) return undefined
    return CustomerAddressMapper(updated)
  }

  public async deleteAddress(id: number): Promise<void> {
    await customerAddressRepository.deleteAddress(id)
  }

  public async setDefaultAddress(
    customerId: number,
    addressId: number
  ): Promise<void> {
    await customerAddressRepository.setDefaultAddress(
      customerId,
      addressId
    )
  }
}

const customerAddressModel = new CustomerAddressModel()
export default customerAddressModel
