'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import z from 'zod'
import { LoginCustomerFormSchema } from './LoginCustomerForm.schema'
import { type LoginFormData } from './LoginCustomerForm.types'

interface UseLoginCustomerFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

interface UseLoginCustomerFormReturn {
  email: string
  password: string
  errors: {
    email?: string
    password?: string
    form?: string
  }
  isLoading: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  validateField: (field: keyof LoginFormData, value: string) => void
}

export const useLoginCustomerForm = ({
  onSuccess,
  onClose
}: UseLoginCustomerFormProps): UseLoginCustomerFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<UseLoginCustomerFormReturn['errors']>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (field: keyof LoginFormData, value: string): void => {
    try {
      const tempSchema = z.object({
        [field]: LoginCustomerFormSchema.shape[field]
      })
      tempSchema.parse({ [field]: value })

      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors.find((e) => e.path.includes(field))?.message
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      // Validar todo el formulario
      LoginCustomerFormSchema.parse(formData)
      setErrors({})

      setIsLoading(true)

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (result?.error != null) {
        setErrors({
          form:
            result.error === 'CredentialsSignin'
              ? 'Credenciales incorrectas'
              : 'Error al iniciar sesión'
        })
      } else if (result?.ok ?? false) {
        onSuccess?.()
        onClose?.()
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as string
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ form: 'Ocurrió un error al iniciar sesión' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const setEmail = (email: string): void => {
    setFormData((prev) => ({ ...prev, email }))
    validateField('email', email)
  }

  const setPassword = (password: string): void => {
    setFormData((prev) => ({ ...prev, password }))
    validateField('password', password)
  }

  return {
    email: formData.email,
    password: formData.password,
    errors,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
    validateField
  }
}
