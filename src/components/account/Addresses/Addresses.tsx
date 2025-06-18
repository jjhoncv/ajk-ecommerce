"use client";

import { departments } from "@/components/account/Addresses/Addresses.data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import { CustomersAddresses } from "@/types/domain";
import { Home, MapPin, MapPinHouse } from "lucide-react";
import { useAddresses } from "./use-addresses.hook";

interface AddressesProps {
  initialAddresses: CustomersAddresses[];
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
    availableDistricts
  } = useAddresses({ initialAddresses });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Direcciones</h2>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {addresses.length > 0 &&
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-8">
            <MapPinHouse className="h-5 w-5" />
            <h2 className="text-xl font-bold">Direcciones</h2>
          </div>          <Button
            onClick={openNewAddressModal}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 text-sm font-medium"
          >
            AGREGAR DIRECCIÓN
          </Button>
        </div>
      }


      {/* Mensaje global */}
      {message && !isModalOpen && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${message.includes("Error")
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
          }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${message.includes("Error") ? "bg-red-600" : "bg-green-600"}`}></div>
            {message}
          </div>
        </div>
      )}

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes direcciones guardadas
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Agrega tu primera dirección para realizar pedidos más rápido y fácil.
          </p>
          <Button
            onClick={openNewAddressModal}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 text-sm font-medium"
          >
            AGREGAR TU PRIMERA DIRECCIÓN
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-center gap-6 py-6 border-b border-gray-200 last:border-b-0">
              {/* Icono de dirección */}
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Home className="h-8 w-8 text-gray-600" />
              </div>

              {/* Información de la dirección */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{address.alias}</h3>
                  {Boolean(address.isDefault) && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Por defecto
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {address.streetName} {address.streetNumber}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  <p>{address.district}, {address.province}</p>
                  <p>{address.department}, Perú</p>
                </div>
              </div>

              {/* Estado y acciones */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-4 py-2"
                  >
                    EDITAR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm px-4 py-2"
                  >
                    ELIMINAR
                  </Button>
                </div>

                {!Boolean(address.isDefault) && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
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
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-2xl overflow-y-auto h-full">
        <ModalTitle
          onClose={closeModal}
          title={`${editingAddress ? "Editar" : "Agregar"} dirección`}
        />
        <ModalContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Nombre de la dirección */}
              <div className="space-y-2">
                <Label htmlFor="alias" className="text-sm font-medium text-gray-700">
                  Nombre de la dirección
                </Label>
                <Input
                  id="alias"
                  name="alias"
                  value={formData.alias}
                  onChange={handleInputChange}
                  placeholder="ej. Casa, Oficina, Casa de mamá"
                  className={`${errors.alias ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
                />
                {errors.alias && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.alias}
                  </p>
                )}
              </div>

              {/* Departamento y Provincia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Departamento
                  </Label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                    Provincia
                  </Label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LIMA">LIMA</option>
                  </select>
                  {errors.province && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.province}
                    </p>
                  )}
                </div>
              </div>

              {/* Distrito */}
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                  Distrito
                </Label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.district ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Selecciona un distrito</option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.district}
                  </p>
                )}
              </div>

              {/* Avenida/Calle y Número */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetName" className="text-sm font-medium text-gray-700">
                    Nombre de la calle
                  </Label>
                  <Input
                    id="streetName"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    placeholder="Av. Javier Prado, Jr. Lima, etc."
                    className={`${errors.streetName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
                  />
                  {errors.streetName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.streetName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetNumber" className="text-sm font-medium text-gray-700">
                    Número
                  </Label>
                  <Input
                    id="streetNumber"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    placeholder="123, 45-A, etc."
                    className={`${errors.streetNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
                  />
                  {errors.streetNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.streetNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Apartamento (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                  Apartamento / Unidad / Piso (opcional)
                </Label>
                <Input
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="ej. Apt 3, Dpto 101, Piso 2"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Mensaje en modal */}
            {message && isModalOpen && (
              <div className={`p-3 rounded-lg text-sm ${message.includes("Error")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${message.includes("Error") ? "bg-red-600" : "bg-green-600"}`}></div>
                  {message}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    GUARDANDO...
                  </div>
                ) : (
                  `${editingAddress ? "ACTUALIZAR" : "AGREGAR"} DIRECCIÓN`
                )}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}