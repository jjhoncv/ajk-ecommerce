'use client'

import { type CheckoutSummary, type CheckoutUser, type ShippingOption } from '@/types/checkout'
import { type CustomersAddresses } from '@/types/domain'
import { type District } from '@/module/districts/core'
import { useCallback, useEffect, useState } from 'react'
import { Modal, ModalContent, ModalTitle } from '@/module/shared/components/Modal'
import { Button, Input, Label } from '@/module/shared/components/ui'
import { MapPicker } from '@/components/ui/MapPicker'
import { MapPin } from 'lucide-react'

interface ShippingStepProps {
  user: CheckoutUser
  summary: CheckoutSummary
  selectedAddressId?: number
  onAddressChange: (addressId: number) => void
  onShippingMethodChange: (option: ShippingOption) => void
  onAddressCreated: (address: CustomersAddresses) => void
  onNext: () => void
  loading: boolean
}

export default function ShippingStep({
  user,
  summary,
  selectedAddressId,
  onAddressChange,
  onShippingMethodChange,
  onAddressCreated,
  onNext,
  loading
}: ShippingStepProps) {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    number | null
  >(summary.selectedShipping?.methodId || null)
  const currentAddressId =
    selectedAddressId || user.defaultAddressId || user.addresses[0]?.id

  // Estado para el modal de nueva dirección
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    alias: '',
    districtId: 0,
    streetName: '',
    streetNumber: '',
    apartment: '',
    reference: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'districtId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }, [])

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.districtId === 0) {
      setFormError('Debes seleccionar un distrito')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        onAddressCreated(data.address)
        setIsModalOpen(false)
        setFormData({
          alias: '',
          districtId: 0,
          streetName: '',
          streetNumber: '',
          apartment: '',
          reference: '',
          latitude: undefined,
          longitude: undefined
        })
      } else {
        const error = await response.json()
        setFormError(error.error || 'Error al guardar la dirección')
      }
    } catch {
      setFormError('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (summary.shippingOptions.length > 0) {
      const isCurrentSelectionValid = selectedShippingMethod !== null &&
        summary.shippingOptions.some(opt => opt.methodId === selectedShippingMethod)

      if (!isCurrentSelectionValid) {
        const firstOption = summary.shippingOptions[0]
        setSelectedShippingMethod(firstOption.methodId)
        onShippingMethodChange(firstOption)
      } else if (!summary.selectedShipping && selectedShippingMethod !== null) {
        const selectedOption = summary.shippingOptions.find(
          opt => opt.methodId === selectedShippingMethod
        )
        if (selectedOption) {
          onShippingMethodChange(selectedOption)
        }
      }
    }
  }, [summary.shippingOptions, selectedShippingMethod, summary.selectedShipping, onShippingMethodChange])

  const handleShippingMethodSelect = (option: ShippingOption) => {
    setSelectedShippingMethod(option.methodId)
    onShippingMethodChange(option)
  }

  const canProceed = currentAddressId && selectedShippingMethod

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Información de envío
      </h2>

      {/* Direcciones */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Dirección de entrega
        </h3>

        {user.addresses.length > 0 ? (
          <div className="space-y-4">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${
                  currentAddressId === address.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                } `}
                onClick={() => { onAddressChange(address.id) }}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping-address"
                    value={address.id}
                    checked={currentAddressId === address.id}
                    onChange={() => { onAddressChange(address.id) }}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {address.alias}
                      </h4>
                      {address.isDefault === 1 && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Por defecto
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {address.streetName} {address.streetNumber}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getDistrictName(address.districtId) || address.district}, Lima, Lima
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes direcciones</h3>
            <p className="mt-1 text-sm text-gray-500">Agrega una dirección para continuar con tu compra.</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Agregar nueva dirección
        </button>
      </div>

      {/* Métodos de envío */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Método de envío
        </h3>

        {summary.shippingOptions.length > 0 ? (
          <div className="space-y-4">
            {summary.shippingOptions.map((option) => (
              <div
                key={option.methodId}
                className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${
                  selectedShippingMethod === option.methodId
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                } `}
                onClick={() => { handleShippingMethodSelect(option) }}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping-method"
                    value={option.methodId}
                    checked={selectedShippingMethod === option.methodId}
                    onChange={() => { handleShippingMethodSelect(option) }}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {option.methodName}
                      </h4>
                      <div className="text-right">
                        {option.isFree ? (
                          <span className="text-sm font-medium text-green-600">
                            Gratis
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            S/ {Number(option.cost).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Entrega estimada: {option.estimatedDays.min}-
                        {option.estimatedDays.max} días
                      </p>
                      {option.description && (
                        <span className="text-xs text-green-600">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-orange-800">
                  No hay envíos disponibles
                </h4>
                <p className="mt-1 text-sm text-orange-700">
                  No tenemos opciones de envío configuradas para la dirección
                  seleccionada. Por favor, selecciona otra dirección o contacta
                  con nosotros.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón continuar */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || loading}
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Continuar al pago'}
        </button>
      </div>

      {/* Modal para agregar dirección */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-3xl"
      >
        <ModalTitle
          onClose={() => setIsModalOpen(false)}
          title="Agregar dirección"
        />
        <ModalContent>
          <form onSubmit={handleAddressSubmit} className="space-y-5">
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {formError}
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
                  required
                />
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value={0}>
                    {loadingDistricts ? 'Cargando...' : 'Selecciona un distrito'}
                  </option>
                  {Object.entries(districtsGrouped).map(([zoneName, zoneDistricts]) => (
                    <optgroup key={zoneName} label={zoneName}>
                      {zoneDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
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
                  required
                />
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
                  required
                />
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
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loadingDistricts}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isSubmitting ? 'Guardando...' : 'Agregar dirección'}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
