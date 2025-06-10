import { executeQuery } from '@/lib/db'
import { CustomersAddresses as CustomerAddressRaw } from '@/types/database'

export class CustomerAddressRepository {
  public async getAddress(id: number): Promise<CustomerAddressRaw | null> {
    const addresses = await executeQuery<CustomerAddressRaw[]>({
      query: 'SELECT * FROM customers_addresses WHERE id = ?',
      values: [id]
    })

    if (addresses.length === 0) return null
    return addresses[0]
  }

  public async getAddressByCustomer(
    id: number
  ): Promise<CustomerAddressRaw[] | null> {
    const addresses = await executeQuery<CustomerAddressRaw[]>({
      query: 'SELECT * FROM customers_addresses WHERE id_customer = ?',
      values: [id]
    })

    if (addresses.length === 0) return null
    return addresses
  }

  public async getAddresses(): Promise<CustomerAddressRaw[] | null> {
    const addresses = await executeQuery<CustomerAddressRaw[]>({
      query: 'SELECT * FROM customers_addresses'
    })

    if (addresses.length === 0) return null
    return addresses
  }

  public async createAddress(
    address: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CustomerAddressRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO customers_addresses SET ?',
      values: [address]
    })

    return await this.getAddress(result.insertId)
  }

  public async updateAddress(
    addressData: Omit<CustomerAddressRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<CustomerAddressRaw | null> {
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

const customerAddressRepository = new CustomerAddressRepository()
export default customerAddressRepository
