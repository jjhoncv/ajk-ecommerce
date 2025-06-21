import { type CustomersAddresses as CustomerAddressRaw } from '@/types/database'
import { type CustomersAddresses } from '@/types/domain'

export const CustomerAddressMapper = (
  data: CustomerAddressRaw
): CustomersAddresses => {
  return {
    id: data.id,
    idCustomer: data.id_customer,
    alias: data.alias,
    department: data.department,
    province: data.province,
    district: data.district,
    streetName: data.street_name,
    streetNumber: data.street_number,
    apartment: data.apartment || undefined,
    latitude: data.latitude || undefined,
    longitude: data.longitude || undefined,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    customer: undefined // Se puede popular después si es necesario
  }
}

export const CustomerAddressesMapper = (
  data: CustomerAddressRaw[] | null
): CustomersAddresses[] | undefined => {
  if (data === null) return undefined
  return data.map(CustomerAddressMapper)
}
