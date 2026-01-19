// 📄 components/product/ProductVariantShipping.tsx
'use client'

import { formatPrice } from '@/module/shared/helpers/utils'
import {
  AlertCircle,
  ChevronRight,
  MapPin,
  Package,
  RotateCcw,
  Shield
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { type FC, useState } from 'react'
import { AddressSelectionModal } from '../AddressSelectionModal'

// Usar los tipos compartidos
import { deliveryDates } from './ProductVariantShipping.helpers'
import { type ShippingOptionForAddress } from '@/types/shipping'
import { type ProductVariantShippingProps } from './ProductVariantShipping.interfaces'
import { ProductVariantShippingLogout } from './ProductVariantShippingLogout'
import { ProductVariantShippingNoMethods } from './ProductVariantShippingNoMethods'
import { ProductVariantShippingNotAddress } from './ProductVariantShippingNotAddress'
import { ProductVariantShippingNotAvailable } from './ProductVariantShippingNotAvailable'
import { ProductVariantShippingShimmer } from './ProductVariantShippingShimmer'
import { useProductVariantShipping } from './use-product-variant-shipping.hook'

export const ProductVariantShipping: FC<ProductVariantShippingProps> = ({
  productVariantId,
  quantity,
  orderValue
}) => {
  const { data: session, status } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Usar el hook personalizado
  const {
    selectedAddress,
    allAddresses,
    loading,
    error,
    isInitialized,
    hasAddresses,
    hasShippingOptions,
    selectAddress
  } = useProductVariantShipping({
    productVariantId,
    quantity,
    orderValue
  })

  // Manejar cambio de dirección
  const handleAddressChange = (addressOption: ShippingOptionForAddress) => {
    selectAddress(addressOption)
    setIsModalOpen(false)
  }

  // Mostrar shimmer hasta que TODO esté listo
  if (status === 'loading' || !isInitialized || loading) {
    return <ProductVariantShippingShimmer />
  }

  // Renderizar error
  if (error) {
    return (
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center py-4 text-red-600">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  // Renderizar para usuario no logueado
  if (!session) {
    return <ProductVariantShippingLogout />
  }

  // Usuario tiene direcciones pero no hay métodos de envío configurados
  if (hasAddresses && !hasShippingOptions) {
    return <ProductVariantShippingNoMethods />
  }

  // Renderizar sin direcciones
  if (!hasAddresses) {
    return <ProductVariantShippingNotAddress />
  }

  // No hay dirección seleccionada (caso edge)
  if (!selectedAddress) {
    return <ProductVariantShippingNotAvailable />
  }

  const { selectedAddress: selectedAddressArg } = { selectedAddress }
  const defaultShipping = selectedAddressArg.defaultShippingOption

  if (!defaultShipping) {
    return <ProductVariantShippingNotAvailable />
  }

  return (
    <>
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Envío a</span>
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="flex items-center space-x-1 text-blue-600 transition-colors hover:text-blue-700"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{selectedAddress.address.district}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {defaultShipping.isFree ? (
                    <span className="font-semibold text-green-600">
                      Envío GRATIS
                    </span>
                  ) : (
                    <>Envío: {formatPrice(defaultShipping.finalCost)}</>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  Entrega:{' '}
                  <span className="font-medium">
                    {deliveryDates(defaultShipping).min} -{' '}
                    {deliveryDates(defaultShipping).max}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {defaultShipping.methodName} • {selectedAddress.address.alias}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsModalOpen(true)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Opciones adicionales de envío */}
          {selectedAddress.shippingOptions.length > 1 && (
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={() => {
                  setIsModalOpen(true)
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Ver más opciones de envío (
                {selectedAddress.shippingOptions.length - 1} más)
              </button>
            </div>
          )}

          <div className="space-y-2 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">
                  Política de devoluciones y reembolsos
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">
                  Seguridad & Privacidad
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selección de dirección */}
      <AddressSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        addressOptions={allAddresses}
        selectedAddressId={selectedAddress.address.id}
        onSelectAddress={handleAddressChange}
      />
    </>
  )
}
