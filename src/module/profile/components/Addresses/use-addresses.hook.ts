import { districtsByProvince } from '@/module/profile/components/Addresses/Addresses.data'
import {
  addressSchema,
  type AddressFormData
} from '@/module/profile/components/Addresses/Addresses.schema'
import { type CustomersAddresses } from '@/types/domain'
import { useState } from 'react'
import { z } from 'zod'

interface UseAddressesProps {
  initialAddresses: CustomersAddresses[]
}

interface UseAddressesReturn {
  // Addresses data
  addresses: CustomersAddresses[]
  setAddresses: React.Dispatch<React.SetStateAction<CustomersAddresses[]>>
  isLoading: boolean

  // Modal state
  isModalOpen: boolean
  editingAddress: CustomersAddresses | null
  openNewAddressModal: () => void
  closeModal: () => void

  // Form data
  formData: AddressFormData
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>

  // Form validation
  errors: Record<string, string>
  validateForm: () => boolean

  // Form submission
  isSubmitting: boolean
  message: string
  handleSubmit: (e: React.FormEvent) => Promise<void>

  // Input handling
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void

  // Address operations
  handleEdit: (address: CustomersAddresses) => void
  handleDelete: (id: number) => Promise<void>
  handleSetDefault: (id: number) => Promise<void>

  // Helpers
  availableDistricts: string[]
  resetForm: () => void
  loadAddresses: () => Promise<void>
}

export const useAddresses = ({
  initialAddresses
}: UseAddressesProps): UseAddressesReturn => {
  // Usar directamente las direcciones iniciales del server
  const [addresses, setAddresses] =
    useState<CustomersAddresses[]>(initialAddresses)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] =
    useState<CustomersAddresses | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    alias: '',
    department: 'LIMA',
    province: 'LIMA',
    district: '',
    streetName: '',
    streetNumber: '',
    apartment: '',
    latitude: undefined,
    longitude: undefined
  })
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ❌ ELIMINADO: useEffect que hacía fetch innecesario
  // Solo usar las direcciones que vienen del server como props

  const loadAddresses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/customer/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      } else {
        console.error('Error loading addresses: Response not ok')
        setMessage('Error al cargar las direcciones')
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      setMessage('Error al cargar las direcciones')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Formatear valor según el campo
    let formattedValue = value

    if (name === 'streetNumber') {
      // Permitir solo números y letras básicas para números de casa
      formattedValue = value.replace(/[^a-zA-Z0-9-]/g, '')
    }

    if (name === 'alias') {
      // Limpiar caracteres especiales del alias
      formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'latitude' || name === 'longitude'
          ? value
            ? parseFloat(value)
            : undefined
          : formattedValue
    }))

    // Limpiar error del campo actual
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Resetear distrito cuando cambia departamento o provincia
    if (name === 'department' || name === 'province') {
      setFormData((prev) => ({ ...prev, district: '' }))
    }
  }

  const validateForm = () => {
    try {
      addressSchema.parse(formData)
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

  const resetForm = () => {
    setFormData({
      alias: '',
      department: 'LIMA',
      province: 'LIMA',
      district: '',
      streetName: '',
      streetNumber: '',
      apartment: '',
      latitude: undefined,
      longitude: undefined
    })
    setErrors({})
    setMessage('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAddress(null)
    resetForm()
  }

  const openNewAddressModal = () => {
    setEditingAddress(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const method = editingAddress ? 'PUT' : 'POST'
      const body = editingAddress
        ? { ...formData, id: editingAddress.id }
        : formData

      const response = await fetch('/api/customer/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        // ✅ Solo hacer fetch después de crear/actualizar
        await loadAddresses()
        setMessage(
          editingAddress
            ? 'Dirección actualizada correctamente'
            : 'Dirección agregada correctamente'
        )
        closeModal()

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => { setMessage('') }, 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al guardar la dirección')
      }
    } catch (error) {
      setMessage('Error de conexión')
      console.error('Error saving address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (address: CustomersAddresses) => {
    setEditingAddress(address)
    setFormData({
      alias: address.alias,
      department: address.department,
      province: address.province,
      district: address.district,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      apartment: address.apartment || '',
      latitude: address.latitude ? Number(address.latitude) : undefined,
      longitude: address.longitude ? Number(address.longitude) : undefined
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar esta dirección? Esta acción no se puede deshacer.'
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/customer/addresses?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // ✅ Solo hacer fetch después de eliminar
        await loadAddresses()
        setMessage('Dirección eliminada correctamente')
        setTimeout(() => { setMessage('') }, 3000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error al eliminar la dirección')
      }
    } catch (error) {
      setMessage('Error de conexión')
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const response = await fetch('/api/customer/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: id })
      })

      if (response.ok) {
        // ✅ Solo hacer fetch después de cambiar dirección por defecto
        await loadAddresses()
        setMessage('Dirección por defecto actualizada')
        setTimeout(() => { setMessage('') }, 3000)
      } else {
        const errorData = await response.json()
        setMessage(
          errorData.error || 'Error al actualizar la dirección por defecto'
        )
      }
    } catch (error) {
      setMessage('Error de conexión')
      console.error('Error setting default address:', error)
    }
  }

  const availableDistricts =
    districtsByProvince[
      formData.province as keyof typeof districtsByProvince
    ] || []

  return {
    // Addresses data
    addresses,
    setAddresses,
    isLoading,

    // Modal state
    isModalOpen,
    editingAddress,
    openNewAddressModal,
    closeModal,

    // Form data
    formData,
    setFormData,

    // Form validation
    errors,
    validateForm,

    // Form submission
    isSubmitting,
    message,
    handleSubmit,

    // Input handling
    handleInputChange,

    // Address operations
    handleEdit,
    handleDelete,
    handleSetDefault,

    // Helpers
    availableDistricts,
    resetForm,
    loadAddresses
  }
}
