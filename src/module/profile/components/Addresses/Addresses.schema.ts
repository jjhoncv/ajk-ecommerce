import z from 'zod'

export const addressSchema = z.object({
  alias: z
    .string()
    .min(1, 'El nombre de la dirección es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  districtId: z
    .number({ required_error: 'El distrito es requerido' })
    .min(1, 'Debes seleccionar un distrito'),
  streetName: z
    .string()
    .min(1, 'El nombre de la calle es requerido')
    .min(3, 'El nombre de la calle debe tener al menos 3 caracteres')
    .max(100, 'El nombre de la calle no puede exceder 100 caracteres'),
  streetNumber: z
    .string()
    .min(1, 'El número de la calle es requerido')
    .max(10, 'El número no puede exceder 10 caracteres'),
  apartment: z
    .string()
    .max(20, 'El apartamento no puede exceder 20 caracteres')
    .optional(),
  reference: z
    .string()
    .max(200, 'La referencia no puede exceder 200 caracteres')
    .optional(),
  latitude: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida')
    .optional()
})

export type AddressFormData = z.infer<typeof addressSchema>
