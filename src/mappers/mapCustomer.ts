import { Customers as CustomerRaw } from '@/types/database'
import { Customers as Customer } from '@/types/domain'

export const mapCustomer = (data: CustomerRaw): Customer => {
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

export const mapCustomers = (
  data: CustomerRaw[] | null
): Customer[] | undefined => {
  if (data === null) return undefined
  return data.map(mapCustomer)
}
