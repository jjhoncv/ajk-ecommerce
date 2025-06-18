import z from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /[A-Z]/,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(
        /[a-z]/,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(
        /[^A-Za-z0-9]/,
        'La contraseña debe contener al menos un carácter especial'
      ),
    confirmPassword: z.string().min(1, 'Por favor confirma tu nueva contraseña')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword']
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
