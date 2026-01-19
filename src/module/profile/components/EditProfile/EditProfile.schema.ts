import { z } from 'zod'

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  lastname: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(
      /^9\d{8}$/,
      'El teléfono debe ser un celular válido (9 dígitos que empiece con 9)'
    ),
  dni: z
    .string()
    .min(1, 'El DNI es requerido')
    .regex(/^\d{8}$/, 'El DNI debe tener 8 dígitos')
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>
