import type z from 'zod'
import { type LoginCustomerFormSchema } from './LoginCustomerForm.schema'

export type LoginFormData = z.infer<typeof LoginCustomerFormSchema>
