import { type CartItem } from '@/hooks/useCart/useCart'
import {
  type OrderCalculation,
  type PaymentOption,
  type ShippingOption
} from '@/types/checkout'
import { type PromotionVariants } from '@/types/domain'

interface CartSummaryProps {
  items: CartItem[]
  calculation: OrderCalculation
  selectedShipping?: ShippingOption
  selectedPayment?: PaymentOption
}

export default function CartSummary({
  items,
  calculation,
  selectedShipping,
  selectedPayment
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-gray-900">
        Resumen del pedido
      </h2>

      {/* Items */}
      <div className="mb-6 space-y-4">
        {items.map((item) => {
          let displayPrice = item.price

          // Mostrar precio promocional si existe
          if (item.promotionVariants && item.promotionVariants.length > 0) {
            const activePromotion = item.promotionVariants
              .filter((pv) => !!pv)
              .find(
                (pv: PromotionVariants) =>
                  pv?.promotion?.isActive === 1 &&
                  new Date() >= new Date(pv.promotion.startDate) &&
                  new Date() <= new Date(pv.promotion.endDate)
              )

            if (activePromotion) {
              displayPrice = parseFloat(activePromotion.promotionPrice)
            }
          }

          return (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="h-16 w-16 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-md object-cover object-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  {displayPrice < item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      S/ {Number(item.price.toFixed(2))}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    S/ {Number(displayPrice.toFixed(2))}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Métodos seleccionados */}
      {selectedShipping && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Envío:</span>
            <span className="text-sm font-medium">
              {selectedShipping.methodName}
            </span>
          </div>
          {selectedShipping.isFree && (
            <p className="mt-1 text-xs text-green-600">¡Envío gratis!</p>
          )}
        </div>
      )}

      {selectedPayment && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Pago:</span>
            <span className="text-sm font-medium">
              {selectedPayment.methodName}
            </span>
          </div>
          {selectedPayment.processingFee > 0 && (
            <p className="mt-1 text-xs text-orange-600">
              Comisión: S/ {Number(selectedPayment.processingFee).toFixed(2)}
            </p>
          )}
        </div>
      )}

      {/* Totales */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>S/ {Number(calculation.subtotal).toFixed(2)}</span>
        </div>

        {calculation.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento</span>
            <span className="text-green-600">
              -S/ {Number(calculation.discountAmount).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span>
            {calculation.shippingCost === 0
              ? 'Gratis'
              : `S/ ${Number(calculation.shippingCost).toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IGV (18%)</span>
          <span>S/ {Number(calculation.taxAmount).toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>S/ {Number(calculation.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
