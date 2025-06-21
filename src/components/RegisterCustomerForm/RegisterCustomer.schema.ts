import { z } from 'zod'

// Esquema de validación extendido
export const RegisterCustomerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'El usuario debe tener al menos 3 caracteres' }),
    name: z.string().min(1, { message: 'El nombre es requerido' }),
    lastname: z.string().min(1, { message: 'El apellido es requerido' }),
    email: z.string().email({ message: 'Correo electrónico inválido' }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
      .regex(/[a-z]/, { message: 'Debe contener al menos una minúscula' })
      .regex(/[0-9]/, { message: 'Debe contener al menos un número' })
      .regex(/[!@#$%^&*]/, {
        message: 'Debe contener un carácter especial (!@#$%^&*)'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })
