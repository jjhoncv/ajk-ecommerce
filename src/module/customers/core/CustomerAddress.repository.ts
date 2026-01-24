import { executeQuery } from '@/lib/db'
import { type CustomersAddresses as CustomerAddressRaw } from '@/types/database'

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
    customerId: number
  ): Promise<CustomerAddressRaw[] | null> {
    const addresses = await executeQuery<CustomerAddressRaw[]>({
      query: `
        SELECT * FROM customers_addresses
        WHERE id_customer = ?
        ORDER BY is_default DESC, created_at ASC
      `,
      values: [customerId]
    })

    if (addresses.length === 0) return null
    return addresses
  }

  public async getAddresses(): Promise<CustomerAddressRaw[] | null> {
    const addresses = await executeQuery<CustomerAddressRaw[]>({
      query: 'SELECT * FROM customers_addresses ORDER BY created_at DESC'
    })

    if (addresses.length === 0) return null
    return addresses
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
  }): Promise<CustomerAddressRaw | null> {
    // Si es dirección por defecto, quitar default de las demás
    if (data.isDefault) {
      await this.removeDefaultFromCustomer(data.idCustomer)
    }

    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO customers_addresses (
          id_customer, alias, department, province, district, district_id,
          street_name, street_number, apartment, reference, latitude, longitude, is_default
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.idCustomer,
        data.alias,
        data.department,
        data.province,
        data.district,
        data.districtId || null,
        data.streetName,
        data.streetNumber,
        data.apartment || null,
        data.reference || null,
        data.latitude || null,
        data.longitude || null,
        data.isDefault ? 1 : 0
      ]
    })

    return await this.getAddress(result.insertId)
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
  ): Promise<CustomerAddressRaw | null> {
    const fields: string[] = []
    const values: any[] = []

    if (data.alias !== undefined) {
      fields.push('alias = ?')
      values.push(data.alias)
    }
    if (data.department !== undefined) {
      fields.push('department = ?')
      values.push(data.department)
    }
    if (data.province !== undefined) {
      fields.push('province = ?')
      values.push(data.province)
    }
    if (data.district !== undefined) {
      fields.push('district = ?')
      values.push(data.district)
    }
    if (data.districtId !== undefined) {
      fields.push('district_id = ?')
      values.push(data.districtId)
    }
    if (data.streetName !== undefined) {
      fields.push('street_name = ?')
      values.push(data.streetName)
    }
    if (data.streetNumber !== undefined) {
      fields.push('street_number = ?')
      values.push(data.streetNumber)
    }
    if (data.apartment !== undefined) {
      fields.push('apartment = ?')
      values.push(data.apartment)
    }
    if (data.reference !== undefined) {
      fields.push('reference = ?')
      values.push(data.reference)
    }
    if (data.latitude !== undefined) {
      fields.push('latitude = ?')
      values.push(data.latitude)
    }
    if (data.longitude !== undefined) {
      fields.push('longitude = ?')
      values.push(data.longitude)
    }

    if (fields.length === 0) {
      return await this.getAddress(id)
    }

    values.push(id)

    await executeQuery({
      query: `UPDATE customers_addresses SET ${fields.join(', ')} WHERE id = ?`,
      values
    })

    return await this.getAddress(id)
  }

  public async deleteAddress(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM customers_addresses WHERE id = ?',
      values: [id]
    })
  }

  public async setDefaultAddress(
    customerId: number,
    addressId: number
  ): Promise<void> {
    // Quitar default de todas las direcciones del cliente
    await this.removeDefaultFromCustomer(customerId)

    // Establecer la nueva como default
    await executeQuery({
      query:
        'UPDATE customers_addresses SET is_default = 1 WHERE id = ? AND id_customer = ?',
      values: [addressId, customerId]
    })
  }

  private async removeDefaultFromCustomer(customerId: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE customers_addresses SET is_default = 0 WHERE id_customer = ?',
      values: [customerId]
    })
  }
}

const customerAddressRepository = new CustomerAddressRepository()
export default customerAddressRepository
