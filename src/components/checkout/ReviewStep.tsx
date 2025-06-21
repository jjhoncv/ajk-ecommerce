// 📄 app/checkout/components/ReviewStep.tsx
import { type CheckoutData, type CheckoutSummary, type CheckoutUser } from '@/types/checkout'
import { useState } from 'react'

interface ReviewStepProps {
  user: CheckoutUser
  summary: CheckoutSummary
  checkoutData?: Partial<CheckoutData>
  onProcess: () => void
  onPrev: () => void
  loading: boolean
}

export default function ReviewStep({
  user,
  summary,
  checkoutData,
  onProcess,
  onPrev,
  loading
}: ReviewStepProps) {
  const [couponCode, setCouponCode] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const selectedAddress = summary.selectedAddress
  const selectedShipping = summary.selectedShipping
  const selectedPayment = summary.selectedPayment

  const handleApplyCoupon = async () => {
    // TODO: Implementar aplicación de cupón
    console.log('Aplicar cupón:', couponCode)
  }

  const canProceed =
    acceptTerms && selectedAddress && selectedShipping && selectedPayment

  return (
    <div className="space-y-6">
      {/* Resumen del pedido */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Revisar pedido
        </h2>

        {/* Items del pedido */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Productos ({summary.itemCount})
          </h3>

          <div className="space-y-4">
            {summary.items.map((item) => {
              let displayPrice = item.price

              // Mostrar precio promocional si existe
              if (item.promotionVariants && item.promotionVariants.length > 0) {
                const activePromotion = item.promotionVariants.find(
                  (pv: any) =>
                    pv.promotion.isActive === 1 &&
                    new Date() >= new Date(pv.promotion.startDate) &&
                    new Date() <= new Date(pv.promotion.endDate)
                )

                if (activePromotion) {
                  displayPrice = parseFloat(activePromotion.promotionPrice)
                }
              }

              return (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="h-20 w-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2">
                      {displayPrice < item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          S/ {item.price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        S/ {displayPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      S/ {(displayPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Información de envío */}
        {selectedAddress && selectedShipping && (
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Información de envío
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Dirección de entrega
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedAddress.alias}</p>
                  <p>
                    {selectedAddress.streetName} {selectedAddress.streetNumber}
                    {selectedAddress.apartment &&
                      `, ${selectedAddress.apartment}`}
                  </p>
                  <p>
                    {selectedAddress.district}, {selectedAddress.province}
                  </p>
                  <p>{selectedAddress.department}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Método de envío
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedShipping.methodName}</p>
                  <p>
                    Entrega en {selectedShipping.estimatedDays.min}-
                    {selectedShipping.estimatedDays.max} días
                  </p>
                  <p className="font-medium">
                    {selectedShipping.isFree
                      ? 'Gratis'
                      : `S/ ${selectedShipping.cost.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de pago */}
        {selectedPayment && (
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Método de pago
            </h3>

            <div className="text-sm text-gray-600">
              <p className="font-medium">{selectedPayment.methodName}</p>
              {selectedPayment.processingFee > 0 && (
                <p className="text-orange-600">
                  Incluye comisión de S/{' '}
                  {Number(selectedPayment.processingFee).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cupón de descuento */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Cupón de descuento
          </h3>

          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value) }}
                placeholder="Ingresa tu código de cupón"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
              className="focus:outline-focus:ring-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Notas del cliente */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Notas del pedido (opcional)
          </h3>

          <textarea
            value={customerNotes}
            onChange={(e) => { setCustomerNotes(e.target.value) }}
            rows={3}
            placeholder="Instrucciones especiales para la entrega..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Resumen de totales */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>S/ {Number(summary.calculation.subtotal).toFixed(2)}</span>
            </div>

            {summary.calculation.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Descuento</span>
                <span className="text-green-600">
                  -S/ {Number(summary.calculation.discountAmount).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span>
                {summary.calculation.shippingCost === 0
                  ? 'Gratis'
                  : `S/ ${Number(summary.calculation.shippingCost).toFixed(2)}`}
              </span>
            </div>

            {selectedPayment?.processingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Comisión de pago</span>
                <span className="text-orange-600">
                  S/ {Number(selectedPayment.processingFee).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IGV (18%)</span>
              <span>S/ {Number(summary.calculation.taxAmount).toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  S/ {Number(summary.calculation.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <input
            id="accept-terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => { setAcceptTerms(e.target.checked) }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="accept-terms" className="ml-3 text-sm text-gray-600">
            Acepto los{' '}
            <a
              href="/terms"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a
              href="/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              política de privacidad
            </a>
          </label>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          Volver al pago
        </button>

        <button
          type="button"
          onClick={onProcess}
          disabled={!canProceed || loading}
          className="rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </div>
    </div>
  )
}
