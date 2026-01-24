'use client'

import { Button, Input, Label } from '@/module/shared/components/ui'
import { Modal, ModalContent, ModalTitle } from '@/module/shared/components/Modal'
import { MapPicker } from '@/components/ui/MapPicker'
import { type CustomersAddresses } from '@/types/domain'
import { Home, MapPin, MapPinHouse } from 'lucide-react'
import { useAddresses } from './use-addresses.hook'

interface AddressesProps {
  initialAddresses: CustomersAddresses[]
}

export default function Addresses({ initialAddresses }: AddressesProps) {
  const {
    addresses,
    isLoading,
    isModalOpen,
    editingAddress,
    openNewAddressModal,
    closeModal,
    formData,
    errors,
    isSubmitting,
    message,
    handleSubmit,
    handleInputChange,
    handleEdit,
    handleDelete,
    handleSetDefault,
    handleLocationChange,
    districtsGrouped,
    loadingDistricts,
    getDistrictName
  } = useAddresses({ initialAddresses })

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold">Direcciones</h2>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {addresses.length > 0 && (
        <div className="mb-8 flex items-center justify-between">
          <div className="mb-8 flex items-center gap-2">
            <MapPinHouse className="h-5 w-5" />
            <h2 className="text-xl font-bold">Direcciones</h2>
          </div>{' '}
          <Button
            onClick={openNewAddressModal}
            className="border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            AGREGAR DIRECCIÓN
          </Button>
        </div>
      )}

      {/* Mensaje global */}
      {message && !isModalOpen && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm ${
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

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No tienes direcciones guardadas
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-600">
            Agrega tu primera dirección para realizar pedidos más rápido y
            fácil.
          </p>
          <Button
            onClick={openNewAddressModal}
            className="border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            AGREGAR TU PRIMERA DIRECCIÓN
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center gap-6 border-b border-gray-200 py-6 last:border-b-0"
            >
              {/* Icono de dirección */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center bg-gray-100">
                <Home className="h-8 w-8 text-gray-600" />
              </div>

              {/* Información de la dirección */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {address.alias}
                  </h3>
                  {Boolean(address.isDefault) && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Por defecto
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {address.streetName} {address.streetNumber}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  <p>
                    {getDistrictName(address.districtId) || address.district}, Lima
                  </p>
                  <p>Lima, Perú</p>
                </div>
              </div>

              {/* Estado y acciones */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { handleEdit(address) }}
                    className="border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    EDITAR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => { await handleDelete(address.id) }}
                    className="border-gray-300 px-4 py-2 text-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                  >
                    ELIMINAR
                  </Button>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={async () => { await handleSetDefault(address.id) }}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    Establecer como predeterminada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-3xl"
      >
        <ModalTitle
          onClose={closeModal}
          title={`${editingAddress ? 'Editar' : 'Agregar'} dirección`}
        />
        <ModalContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mensaje en modal */}
            {message && isModalOpen && (
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
                onClick={closeModal}
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
                  `${editingAddress ? 'Actualizar' : 'Agregar'} dirección`
                )}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
