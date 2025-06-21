import { type Customers as CustomerRaw } from '@/types/database'
import { type Customers as Customer } from '@/types/domain'

export const CustomerMapper = (data: CustomerRaw): Customer => {
  return {
    id: data.id,
    name: data.name,
    lastname: data.lastname,
    username: data.username,
    email: data.email,
    password: data.password,
    photo: data.photo,
    isActive: data.is_active,
    addressId: data.address_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    customersAddresses: undefined,
    variantRatings: undefined
  }
}

export const CustomersMapper = (
  data: CustomerRaw[] | null
): Customer[] | undefined => {
  if (data === null) return undefined
  return data.map(CustomerMapper)
}
