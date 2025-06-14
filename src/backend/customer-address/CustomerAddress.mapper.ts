import { CustomersAddresses as CustomerAddressRaw } from '@/types/database'
import { CustomersAddresses as CustomerAddress } from '@/types/domain'

export const CustomerAddressMapper = (
  data: CustomerAddressRaw
): CustomerAddress => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    idCustomer: data.id_customer,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    customers: undefined
  }
}

export const CustomerAddressesMapper = (
  data: CustomerAddressRaw[] | null
): CustomerAddress[] | undefined => {
  if (data === null) return undefined
  return data.map(CustomerAddressMapper)
}
