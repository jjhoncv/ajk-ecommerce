import {
  addressSchema,
  type AddressFormData
} from '@/module/profile/components/Addresses/Addresses.schema'
import { type District } from '@/module/districts/core'
import { type CustomersAddresses } from '@/types/domain'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'

interface UseAddressesProps {
  initialAddresses: CustomersAddresses[]
}

interface UseAddressesReturn {
  // Addresses data
  addresses: CustomersAddresses[]
  setAddresses: React.Dispatch<React.SetStateAction<CustomersAddresses[]>>
  isLoading: boolean

  // Districts data
  districts: District[]
  districtsGrouped: Record<string, District[]>
  loadingDistricts: boolean

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

  // Map/Location
  handleLocationChange: (lat: number, lng: number, address?: string) => void

  // Helpers
  resetForm: () => void
  loadAddresses: () => Promise<void>
  getDistrictName: (districtId: number | null | undefined) => string
}

const initialFormData: AddressFormData = {
  alias: '',
  districtId: 0,
  streetName: '',
  streetNumber: '',
  apartment: '',
  reference: '',
  latitude: undefined,
  longitude: undefined
}

export const useAddresses = ({
  initialAddresses
}: UseAddressesProps): UseAddressesReturn => {
  const [addresses, setAddresses] =
    useState<CustomersAddresses[]>(initialAddresses)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] =
    useState<CustomersAddresses | null>(null)
  const [formData, setFormData] = useState<AddressFormData>(initialFormData)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Districts state
  const [districts, setDistricts] = useState<District[]>([])
  const [districtsGrouped, setDistrictsGrouped] = useState<Record<string, District[]>>({})
  const [loadingDistricts, setLoadingDistricts] = useState(true)

  // Load districts on mount
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const response = await fetch('/api/districts/grouped')
        if (response.ok) {
          const data = await response.json()
          setDistrictsGrouped(data.districts || {})

          // Flatten for easy lookup
          const allDistricts: District[] = []
          Object.values(data.districts || {}).forEach((group) => {
            allDistricts.push(...(group as District[]))
          })
          setDistricts(allDistricts)
        }
      } catch (error) {
        console.error('Error loading districts:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }
    loadDistricts()
  }, [])

  const getDistrictName = useCallback((districtId: number | null | undefined): string => {
    if (!districtId) return ''
    const district = districts.find(d => d.id === districtId)
    return district?.name || ''
  }, [districts])

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

    let formattedValue: string | number = value

    if (name === 'streetNumber') {
      formattedValue = value.replace(/[^a-zA-Z0-9-]/g, '')
    }

    if (name === 'alias') {
      formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    }

    if (name === 'districtId') {
      formattedValue = parseInt(value) || 0
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude'
        ? value ? parseFloat(value) : undefined
        : formattedValue
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
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
    setFormData(initialFormData)
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
        await loadAddresses()
        setMessage(
          editingAddress
            ? 'Dirección actualizada correctamente'
            : 'Dirección agregada correctamente'
        )
        closeModal()
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
      districtId: address.districtId || 0,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      apartment: address.apartment || '',
      reference: address.reference || '',
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

  const handleLocationChange = useCallback((lat: number, lng: number, _address?: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }, [])

  return {
    addresses,
    setAddresses,
    isLoading,

    districts,
    districtsGrouped,
    loadingDistricts,

    isModalOpen,
    editingAddress,
    openNewAddressModal,
    closeModal,

    formData,
    setFormData,

    errors,
    validateForm,

    isSubmitting,
    message,
    handleSubmit,

    handleInputChange,

    handleEdit,
    handleDelete,
    handleSetDefault,

    handleLocationChange,

    resetForm,
    loadAddresses,
    getDistrictName
  }
}
