'use client'

import { type JSX, useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { Modal, ModalContent, ModalTitle } from '@/module/shared/components/Modal'
import { Button, Input, Label } from '@/module/shared/components/ui'
import { MapPicker } from '@/components/ui/MapPicker'
import { type District } from '@/module/districts/core'

const addressSchema = z.object({
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

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
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

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSuccess
}: AddressFormModalProps): JSX.Element => {
  const [formData, setFormData] = useState<AddressFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        }
      } catch (error) {
        console.error('Error loading districts:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }
    loadDistricts()
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setMessage('')
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

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

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage('Dirección agregada correctamente')
        resetForm()
        onSuccess?.()
        setTimeout(() => {
          handleClose()
        }, 500)
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-3xl"
      zIndex={10001}
    >
      <ModalTitle
        onClose={handleClose}
        title="Agregar dirección"
      />
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mensaje en modal */}
          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${
                message.includes('Error')
                  ? 'border border-red-200 bg-red-50 text-red-700'
                  : 'border border-green-200 bg-green-50 text-green-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}
                ></div>
                {message}
              </div>
            </div>
          )}

          {/* Ubicación (fija Lima) */}
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Ubicación:</span> Lima Metropolitana, Perú
            </p>
          </div>

          {/* Row 1: Alias y Distrito */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="alias" className="text-sm font-medium text-gray-700">
                Nombre de la dirección *
              </Label>
              <Input
                id="alias"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="ej. Casa, Oficina, Trabajo"
                className={`${errors.alias ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              />
              {errors.alias && (
                <p className="text-xs text-red-600">{errors.alias}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="districtId" className="text-sm font-medium text-gray-700">
                Distrito *
              </Label>
              <select
                id="districtId"
                name="districtId"
                value={formData.districtId}
                onChange={handleInputChange}
                disabled={loadingDistricts}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${errors.districtId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value={0}>
                  {loadingDistricts ? 'Cargando...' : 'Selecciona un distrito'}
                </option>
                {Object.entries(districtsGrouped).map(([zoneName, districts]) => (
                  <optgroup key={zoneName} label={zoneName}>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.districtId && (
                <p className="text-xs text-red-600">{errors.districtId}</p>
              )}
            </div>
          </div>

          {/* Row 2: Calle y Número */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="streetName" className="text-sm font-medium text-gray-700">
                Calle / Avenida / Jirón *
              </Label>
              <Input
                id="streetName"
                name="streetName"
                value={formData.streetName}
                onChange={handleInputChange}
                placeholder="Av. Javier Prado Este"
                className={`${errors.streetName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              />
              {errors.streetName && (
                <p className="text-xs text-red-600">{errors.streetName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="streetNumber" className="text-sm font-medium text-gray-700">
                Número *
              </Label>
              <Input
                id="streetNumber"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleInputChange}
                placeholder="123"
                className={`${errors.streetNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              />
              {errors.streetNumber && (
                <p className="text-xs text-red-600">{errors.streetNumber}</p>
              )}
            </div>
          </div>

          {/* Row 3: Apartamento y Referencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                Dpto / Piso / Interior
              </Label>
              <Input
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Dpto 101, Piso 2, Int. B"
                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reference" className="text-sm font-medium text-gray-700">
                Referencia
              </Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Frente al parque, cerca al grifo"
                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mapa para ubicación exacta */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Ubicación en el mapa
            </Label>
            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              height="220px"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingDistricts}
              className="min-w-[140px] rounded-lg bg-black px-6 py-2 font-medium text-white hover:bg-gray-800"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Guardando...
                </div>
              ) : (
                'Agregar dirección'
              )}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
