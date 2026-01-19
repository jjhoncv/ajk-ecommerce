import {
  editProfileSchema,
  type EditProfileFormData
} from '@/module/profile/components/EditProfile/EditProfile.schema'
import { type Customers } from '@/types/domain'
import { useState } from 'react'
import { z } from 'zod'

interface UseEditProfileProps {
  customer: Customers
}

interface UseEditProfileReturn {
  // Form data
  formData: EditProfileFormData
  setFormData: React.Dispatch<React.SetStateAction<EditProfileFormData>>

  // Form validation
  errors: Record<string, string>
  validateForm: () => boolean
  validateField: (fieldName: string, value: string) => string | null

  // Form submission
  isLoading: boolean
  message: string
  handleSubmit: (e: React.FormEvent) => Promise<void>

  // Input handling
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  // Reset form
  resetForm: () => void

  // Check if form has changes
  hasChanges: () => boolean
}

export const useEditProfile = ({
  customer
}: UseEditProfileProps): UseEditProfileReturn => {
  const initialData: EditProfileFormData = {
    name: customer.name || '',
    lastname: customer.lastname || '',
    email: customer.email || '',
    phone: customer.phone || '',
    dni: customer.dni || ''
  }

  const [formData, setFormData] = useState<EditProfileFormData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formatear valor según el campo
    let formattedValue = value

    if (name === 'dni' || name === 'phone') {
      // Solo permitir números
      formattedValue = value.replace(/\D/g, '')

      // Limitar longitud
      if (name === 'dni' && formattedValue.length > 8) {
        formattedValue = formattedValue.slice(0, 8)
      }
      if (name === 'phone' && formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9)
      }
    }

    if (name === 'name' || name === 'lastname') {
      // Solo permitir letras y espacios
      formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    // Limpiar error del campo actual y validar en tiempo real
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Validación en tiempo real
    const fieldError = validateField(name, formattedValue)
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }
  }

  const validateField = (fieldName: string, value: string): string | null => {
    try {
      const fieldSchema =
        editProfileSchema.shape[
          fieldName as keyof typeof editProfileSchema.shape
        ]
      fieldSchema.parse(value)
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Campo inválido'
      }
      return null
    }
  }

  const validateForm = () => {
    try {
      editProfileSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!hasChanges()) {
      setMessage('No hay cambios para guardar')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage('Información actualizada correctamente')
        // Actualizar los datos iniciales para el siguiente check de cambios
        Object.assign(initialData, formData)
      } else {
        const error = await response.json()
        setMessage(error.message || 'Error al actualizar la información')
      }
    } catch (error) {
      setMessage('Error de conexión')
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialData)
    setErrors({})
    setMessage('')
  }

  return {
    // Form data
    formData,
    setFormData,

    // Form validation
    errors,
    validateForm,
    validateField,

    // Form submission
    isLoading,
    message,
    handleSubmit,

    // Input handling
    handleInputChange,

    // Reset
    resetForm,

    // Changes detection
    hasChanges
  }
}
