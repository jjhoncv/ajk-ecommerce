import { signIn } from 'next-auth/react'
import { useMemo, useState } from 'react'
import z from 'zod'
import { RegisterCustomerSchema } from './RegisterCustomer.schema'
import { type RegisterFormData } from './RegisterCustomer.types'

// Definimos un tipo para los criterios de contraseña
type PasswordCriterion =
  | 'length'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special'

interface UseRegisterCustomerFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

interface useRegisterCustomerFormReturn {
  formData: RegisterFormData
  errors: Partial<Record<keyof RegisterFormData, string>>
  message: string
  isLoading: boolean
  isFormValid: boolean
  showPasswords: {
    password: boolean
    confirmPassword: boolean
  }
  getPasswordCriteriaStatus: (criteria: PasswordCriterion) => boolean
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void
  handleInputChange: (field: keyof RegisterFormData, value: string) => void
  handleSubmit: () => Promise<{
    success: boolean
    error?: string
  }>
}

export const useRegisterCustomerForm = ({
  onSuccess,
  onClose
}: UseRegisterCustomerFormProps): useRegisterCustomerFormReturn => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  })

  const isFormValid = useMemo(() => {
    const result = RegisterCustomerSchema.safeParse(formData)
    return result.success
  }, [formData])

  // Función para verificar los criterios de la contraseña con tipado seguro
  const getPasswordCriteriaStatus = (criteria: PasswordCriterion): boolean => {
    switch (criteria) {
      case 'length':
        return formData.password.length >= 8
      case 'uppercase':
        return /[A-Z]/.test(formData.password)
      case 'lowercase':
        return /[a-z]/.test(formData.password)
      case 'number':
        return /[0-9]/.test(formData.password)
      case 'special':
        return /[!@#$%^&*]/.test(formData.password)
      default: {
        const exhaustiveCheck: never = criteria
        return exhaustiveCheck
      }
    }
  }

  const togglePasswordVisibility = (
    field: 'password' | 'confirmPassword'
  ): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error cuando el usuario escribe
    if (errors[field] !== undefined) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    try {
      RegisterCustomerSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0 && typeof err.path[0] === 'string') {
            const field = err.path[0] as keyof RegisterFormData
            newErrors[field] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (): Promise<{
    success: boolean
    error?: string
  }> => {
    setMessage('')

    if (!validateForm()) {
      return { success: false }
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage =
          'error' in data ? data.error : 'Error al registrar usuario'

        throw new Error(`Error al registrar customer data: ${errorMessage}`)
      }

      // Iniciar sesión automáticamente
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (result?.error != null) {
        throw new Error(result?.error)
      }

      setMessage('Registro exitoso! Redirigiendo...')
      onSuccess?.()
      onClose?.()

      return { success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al procesar la solicitud'
      setMessage(`Error: ${errorMessage}`)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    errors,
    message,
    isLoading,
    isFormValid,
    showPasswords,
    getPasswordCriteriaStatus,
    togglePasswordVisibility,
    handleInputChange,
    handleSubmit
  }
}
