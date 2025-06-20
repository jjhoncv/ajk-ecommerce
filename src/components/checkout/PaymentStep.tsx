// 📄 app/checkout/components/PaymentStep.tsx
import { PaymentOption } from '@/types/checkout'
import { PaymentMethods } from '@/types/domain'
import { useState } from 'react'

interface PaymentStepProps {
  paymentMethods: PaymentMethods[]
  paymentOptions: PaymentOption[]
  selectedPayment?: PaymentOption
  onPaymentMethodChange: (option: PaymentOption) => void
  onNext: () => void
  onPrev: () => void
  loading: boolean
}

export default function PaymentStep({
  paymentMethods,
  paymentOptions,
  selectedPayment,
  onPaymentMethodChange,
  onNext,
  onPrev,
  loading
}: PaymentStepProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(
    selectedPayment?.methodId || null
  )

  const handlePaymentMethodSelect = (methodId: number) => {
    setSelectedMethodId(methodId)

    // Buscar el método completo
    const method = paymentMethods.find(m => m.id === methodId)
    const option = paymentOptions.find(o => o.methodId === methodId)

    if (method && option) {
      onPaymentMethodChange({
        ...option,
        methodName: method.name,
        methodCode: method.code,
        iconUrl: method.iconUrl || undefined,
        description: method.description || undefined,
        requiresVerification: method.requiresVerification === 1
      })
    }
  }

  const canProceed = selectedMethodId !== null

  // Obtener métodos de pago disponibles combinando ambas fuentes
  const availableMethods = paymentMethods.filter(method =>
    method.isActive === 1 &&
    paymentOptions.some(option => option.methodId === method.id)
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Método de pago
      </h2>

      <div className="space-y-4 mb-8">
        {availableMethods.map((method) => {
          const option = paymentOptions.find(o => o.methodId === method.id)
          if (!option) return null

          return (
            <div
              key={method.id}
              className={`
                relative rounded-lg border p-4 cursor-pointer transition-colors
                ${selectedMethodId === method.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethodId === method.id}
                  onChange={() => handlePaymentMethodSelect(method.id)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />

                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.iconUrl && (
                        <img
                          src={method.iconUrl}
                          alt={method.name}
                          className="h-8 w-auto"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {method.name}
                        </h4>
                        {method.description && (
                          <p className="text-xs text-gray-600">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {option.processingFee > 0 ? (
                        <div>
                          <p className="text-sm text-gray-900">
                            S/ {Number(option.baseAmount).toFixed(2)}
                          </p>
                          <p className="text-xs text-orange-600">
                            + S/ {Number(option.processingFee).toFixed(2)} comisión
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Total: S/ {Number(option.finalAmount).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          S/ {Number(option.finalAmount).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Límites de monto */}
                  {(method.minAmount || method.maxAmount) && (
                    <div className="mt-2 text-xs text-gray-500">
                      {method.minAmount && method.maxAmount ? (
                        `Monto entre S/ ${method.minAmount} - S/ ${method.maxAmount}`
                      ) : method.minAmount ? (
                        `Monto mínimo: S/ ${method.minAmount}`
                      ) : method.maxAmount ? (
                        `Monto máximo: S/ ${method.maxAmount}`
                      ) : null}
                    </div>
                  )}

                  {/* Verificación requerida */}
                  {method.requiresVerification === 1 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-yellow-700">
                        Requiere verificación adicional
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Formulario específico del método de pago */}
              {selectedMethodId === method.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {renderPaymentForm(method)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Información de seguridad */}
      <div className="mb-6 rounded-md bg-green-50 p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1L5 6v6l5 5 5-5V6l-5-5zM8.5 6L10 4.5 11.5 6 13 7.5 11.5 9 10 7.5 8.5 6z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Pago seguro
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Tu información de pago está protegida con encriptación SSL de 256 bits.
            </p>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="
            rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm
            hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-gray-600
          "
        >
          Volver al envío
        </button>

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
          {loading ? 'Cargando...' : 'Revisar pedido'}
        </button>
      </div>
    </div>
  )
}

// Función para renderizar formularios específicos por método de pago
function renderPaymentForm(method: PaymentMethods) {
  switch (method.code) {
    case 'card':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de tarjeta
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de expiración
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del titular
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      )

    case 'yape':
    case 'plin':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de teléfono
            </label>
            <input
              type="tel"
              placeholder="999 999 999"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-sm text-blue-700">
              Recibirás una notificación en tu app de {method.name} para confirmar el pago.
            </p>
          </div>
        </div>
      )

    case 'bank_transfer':
      return (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Transferencia bancaria
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Recibirás los datos bancarios por email después de confirmar el pedido.
                Tienes 24 horas para realizar la transferencia.
              </p>
            </div>
          </div>
        </div>
      )

    case 'cash_on_delivery':
      return (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Pago contra entrega
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Pagarás en efectivo al recibir tu pedido.
                Asegúrate de tener el monto exacto.
              </p>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Serás redirigido para completar el pago con {method.name}.
          </p>
        </div>
      )
  }
}