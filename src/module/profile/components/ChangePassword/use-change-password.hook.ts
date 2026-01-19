// ========================================================================================
// hooks/useChangePassword.ts
import {
  changePasswordSchema,
  type ChangePasswordFormData
} from '@/module/profile/components/ChangePassword/ChangePassword.schema'
import { useState } from 'react'
import z from 'zod'

interface UseChangePasswordReturn {
  // Form data
  formData: ChangePasswordFormData
  setFormData: React.Dispatch<React.SetStateAction<ChangePasswordFormData>>

  // Password visibility
  showPasswords: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  togglePasswordVisibility: (field: 'current' | 'new' | 'confirm') => void

  // Form validation
  errors: Record<string, string>
  validateForm: () => boolean

  // Form submission
  isLoading: boolean
  message: string
  handleSubmit: (e: React.FormEvent) => Promise<void>

  // Input handling
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  // Password criteria checking
  getPasswordCriteriaStatus: (criteria: string) => boolean

  // Reset form
  resetForm: () => void
}

export const useChangePassword = (): UseChangePasswordReturn => {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo actual cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    try {
      changePasswordSchema.parse(formData)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/customer/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente')
        resetForm()
      } else {
        const error = await response.json()
        setMessage(error.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      setMessage('Error de conexión')
      console.error('Error changing password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordCriteriaStatus = (criteria: string) => {
    const password = formData.newPassword
    if (!password) return false

    switch (criteria) {
      case 'length':
        return password.length >= 8
      case 'uppercase':
        return /[A-Z]/.test(password)
      case 'lowercase':
        return /[a-z]/.test(password)
      case 'number':
        return /[0-9]/.test(password)
      case 'special':
        return /[^A-Za-z0-9]/.test(password)
      default:
        return false
    }
  }

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setMessage('')
  }

  return {
    // Form data
    formData,
    setFormData,

    // Password visibility
    showPasswords,
    togglePasswordVisibility,

    // Form validation
    errors,
    validateForm,

    // Form submission
    isLoading,
    message,
    handleSubmit,

    // Input handling
    handleInputChange,

    // Password criteria
    getPasswordCriteriaStatus,

    // Reset
    resetForm
  }
}
