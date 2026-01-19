import type z from 'zod'
import { type RegisterCustomerSchema } from './RegisterCustomer.schema'

export type RegisterFormData = z.infer<typeof RegisterCustomerSchema>
