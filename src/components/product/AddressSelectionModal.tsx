// 📄 components/product/AddressSelectionModal.tsx
'use client'

import { Modal } from '@/components/ui/Modal'
import { formatPrice } from '@/helpers/utils'
import { Check, MapPin, Package, Plus, X } from 'lucide-react'
import { type FC } from 'react'

// Usar los tipos compartidos
import { type ShippingOptionForAddress } from '@/types/shipping'

interface AddressSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  addressOptions: ShippingOptionForAddress[]
  selectedAddressId: number
  onSelectAddress: (addressOption: ShippingOptionForAddress) => void
}

export const AddressSelectionModal: FC<AddressSelectionModalProps> = ({
  isOpen,
  onClose,
  addressOptions,
  selectedAddressId,
  onSelectAddress
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[80vh] max-w-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Seleccionar dirección de envío
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Elige la dirección donde quieres recibir tu pedido
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="mb-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {addressOptions.map((addressOption) => (
            <div key={addressOption.addressId} className="space-y-3">
              {/* Address Info */}
              <div
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-blue-300 ${
                  addressOption.addressId === selectedAddressId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => { onSelectAddress(addressOption) }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {addressOption.address.alias}
                      </span>
                      {addressOption.addressId === selectedAddressId && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="ml-6 text-sm text-gray-700">
                      {addressOption.address.streetName}{' '}
                      {addressOption.address.streetNumber}
                      {addressOption.address.apartment &&
                        `, ${addressOption.address.apartment}`}
                    </p>
                    <p className="ml-6 text-sm text-gray-600">
                      {addressOption.address.district},{' '}
                      {addressOption.address.province},{' '}
                      {addressOption.address.department}
                    </p>
                  </div>
                </div>

                {/* Shipping Options for this address */}
                <div className="ml-6 mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Opciones de envío disponibles:
                  </h4>

                  {addressOption.shippingOptions.map((shipping, index) => {
                    const isDefault =
                      shipping === addressOption.defaultShippingOption
                    const deliveryText = `${shipping.estimatedDays.min}-${shipping.estimatedDays.max} días`

                    return (
                      <div
                        key={`${shipping.methodId}-${shipping.zoneId}`}
                        className={`flex items-center justify-between rounded-md border p-3 ${
                          isDefault
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Package className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {shipping.methodName}
                              {isDefault && (
                                <span className="ml-2 rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                  Recomendado
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              Entrega en {deliveryText}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {shipping.isFree ? (
                            <span className="text-sm font-semibold text-green-600">
                              GRATIS
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(shipping.finalCost)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Address Button */}
          <button className="group w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
            <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-gray-600" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
              Agregar nueva dirección
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Confirmar selección
        </button>
      </div>
    </Modal>
  )
}
