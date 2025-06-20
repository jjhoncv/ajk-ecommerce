// 📄 app/checkout/components/ShippingStep.tsx
import { CheckoutSummary, CheckoutUser, ShippingOption } from '@/types/checkout'
import { useState } from 'react'

interface ShippingStepProps {
  user: CheckoutUser
  summary: CheckoutSummary
  selectedAddressId?: number
  onAddressChange: (addressId: number) => void
  onShippingMethodChange: (option: ShippingOption) => void
  onNext: () => void
  loading: boolean
}

export default function ShippingStep({
  user,
  summary,
  selectedAddressId,
  onAddressChange,
  onShippingMethodChange,
  onNext,
  loading
}: ShippingStepProps) {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<number | null>(null)
  const currentAddressId = selectedAddressId || user.defaultAddressId || user.addresses[0]?.id

  const handleShippingMethodSelect = (option: ShippingOption) => {
    setSelectedShippingMethod(option.methodId)
    onShippingMethodChange(option)
  }

  const canProceed = currentAddressId && selectedShippingMethod

  console.log("summary.shippingOptions", summary.shippingOptions)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Información de envío
      </h2>

      {/* Direcciones */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Dirección de entrega
        </h3>

        <div className="space-y-4">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className={`
                relative rounded-lg border p-4 cursor-pointer transition-colors
                ${currentAddressId === address.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => onAddressChange(address.id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="shipping-address"
                  value={address.id}
                  checked={currentAddressId === address.id}
                  onChange={() => onAddressChange(address.id)}
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
                    {address.district}, {address.province}, {address.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Agregar nueva dirección
        </button>
      </div>

      {/* Métodos de envío */}
      {summary.shippingOptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Método de envío
          </h3>

          <div className="space-y-4">
            {summary.shippingOptions.map((option) => (
              <div
                key={option.methodId}
                className={`
                  relative rounded-lg border p-4 cursor-pointer transition-colors
                  ${selectedShippingMethod === option.methodId
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleShippingMethodSelect(option)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping-method"
                    value={option.methodId}
                    checked={selectedShippingMethod === option.methodId}
                    onChange={() => handleShippingMethodSelect(option)}
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
                        Entrega estimada: {option.estimatedDays.min}-{option.estimatedDays.max} días
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
        </div>
      )}

      {/* Botón continuar */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || loading}
          className="
            rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Cargando...' : 'Continuar al pago'}
        </button>
      </div>
    </div>
  )
}