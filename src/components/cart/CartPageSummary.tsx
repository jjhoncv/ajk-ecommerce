import StockValidationModal from '@/components/checkout/StockValidationModal'
import { useCheckoutNavigation } from '@/components/checkout/useStockValidation'
import { formatPrice } from '@/helpers/utils'
import { type CartItem } from '@/hooks/useCart/useCart'
import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { type FC, useState } from 'react'

// Helper para obtener precio con promoción
const getPriceIfHasPromotion = (item: CartItem) => {
  const currentPromotion = item.promotionVariants?.[0]
  const originalPrice = Number(item.price)
  const promotionPrice = currentPromotion
    ? Number(currentPromotion.promotionPrice)
    : null
  const finalPrice = promotionPrice || originalPrice

  return {
    finalPrice,
    hasPromotion: Boolean(currentPromotion),
    originalPrice,
    currentPromotion
  }
}

interface CartPageSummaryProps {
  summaryCart: {
    selectedItems: CartItem[]
    selectedTotalItems: number
    selectedTotalPrice: number
    hasSelectedItems: () => boolean
  }
  onCartUpdate?: (
    adjustedItems: Array<{ id: number; quantity: number }>
  ) => void // Callback para actualizar carrito
  onStockInfoReceived?: (
    stockInfo: Array<{ id: number; availableStock: number }>
  ) => void // 🆕 Callback para recibir stock info
}

export const CartPageSummary: FC<CartPageSummaryProps> = ({
  summaryCart,
  onCartUpdate,
  onStockInfoReceived // 🆕 Nuevo callback
}) => {
  // Calcular totales considerando promociones
  const calculateTotalsWithPromotions = (items: CartItem[]) => {
    return items.reduce(
      (acc, item) => {
        const { finalPrice, originalPrice } = getPriceIfHasPromotion(item)
        const itemOriginalTotal = originalPrice * item.quantity
        const itemFinalTotal = finalPrice * item.quantity

        acc.originalTotal += itemOriginalTotal
        acc.finalTotal += itemFinalTotal
        acc.totalItems += item.quantity

        return acc
      },
      { originalTotal: 0, finalTotal: 0, totalItems: 0 }
    )
  }

  const totals = calculateTotalsWithPromotions(summaryCart.selectedItems)
  const totalDiscount = totals.originalTotal - totals.finalTotal
  const hasDiscounts = totalDiscount > 0

  const [isNavigating, setIsNavigating] = useState(false)

  // 🆕 Hook para validación de stock
  const { proceedFromCart, isValidating, modal } = useCheckoutNavigation()

  // 🆕 Función actualizada con validación de stock
  const handleContinueToCheckout = async () => {
    if (!summaryCart.hasSelectedItems()) return

    setIsNavigating(true)

    try {
      // 🆕 Preparar items para validación
      const cartItems = summaryCart.selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity
      }))

      // 🆕 Callback para recibir información de stock (SOLO INFORMATIVO)
      const handleStockInfoReceived = (
        stockInfo: Array<{ id: number; availableStock: number }>
      ) => {
        console.log('📦 Stock info received in CartPageSummary:', stockInfo)

        // 🆕 Enviar información de stock al padre para mostrar en CartPageItem
        if (onStockInfoReceived) {
          onStockInfoReceived(stockInfo)
        }
      }

      // 🆕 Validar stock y proceder al checkout
      const success = await proceedFromCart(cartItems, handleStockInfoReceived)

      // Si el usuario canceló la validación, restaurar el estado
      if (!success) {
        setIsNavigating(false)
      }
      // Si fue exitoso, el usuario ya está en /checkout (manejado por el hook)
    } catch (error) {
      console.error('Error navigating to checkout:', error)
      setIsNavigating(false)
    }
  }

  // 🆕 Estado combinado de loading
  const isLoading = isNavigating || isValidating

  if (!summaryCart.hasSelectedItems()) {
    return (
      <>
        <div className="sticky top-4 border border-gray-200 bg-white p-4">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Resumen</h2>

          {/* Total cuando no hay items seleccionados */}
          <div className="mb-6 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Estimación total</span>
              <span>{formatPrice(0)}</span>
            </div>
          </div>

          {/* Botón deshabilitado */}
          <button
            className="mb-6 w-full cursor-not-allowed bg-gray-400 py-3 font-medium text-white"
            disabled
          >
            <div className="flex items-center justify-center gap-2">
              <span>Continuar (0)</span>
            </div>
            <div className="text-xs opacity-90">🚚 Envío gratis!</div>
          </button>

          {/* Métodos de pago */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-gray-900">Paga con</p>
            <div className="flex gap-2">
              <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                VISA
              </div>
              <div className="flex h-5 w-8 items-center justify-center rounded bg-red-500 text-xs font-bold text-white">
                MC
              </div>
              <div className="flex h-5 w-8 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
                JCB
              </div>
              <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
                AMEX
              </div>
            </div>
          </div>

          {/* Protección del comprador */}
          <div className="border-t pt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              Protección del comprador
            </h3>
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <p className="text-xs text-gray-600">
                Recibe un reembolso de tu dinero si el artículo no llega o es
                diferente al de la descripción.
              </p>
            </div>
          </div>
        </div>
        <StockValidationModal
          isOpen={modal.isOpen}
          result={modal.result}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      </>
    )
  }

  return (
    <div className="sticky top-4 border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h2>

      {/* Imágenes pequeñas de productos seleccionados */}
      <div className="mb-4 flex gap-2">
        {summaryCart.selectedItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="h-12 w-12 overflow-hidden rounded bg-gray-100"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {summaryCart.selectedItems.length > 3 && (
          <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
            +{summaryCart.selectedItems.length - 3}
          </div>
        )}
      </div>

      {/* Cálculos basados en productos seleccionados CON promociones */}
      <div className="mb-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total de artículos</span>
          <span className="font-medium">
            {formatPrice(totals.originalTotal)}
          </span>
        </div>

        {hasDiscounts && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento de artículos</span>
            <span className="font-medium text-red-600">
              -{formatPrice(totalDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="font-medium text-green-600">Gratis</span>
        </div>

        {hasDiscounts && (
          <div className="text-xs text-gray-500">
            ¡{formatPrice(totalDiscount)} ahorrado! Visita la página de pago
          </div>
        )}
      </div>

      <div className="mb-4 border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Estimación total</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>
      </div>

      {/* 🆕 Botón actualizado con estados de validación */}
      <button
        onClick={handleContinueToCheckout}
        className="mb-3 w-full bg-red-600 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={!summaryCart.hasSelectedItems() || isLoading}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              <span>
                {isValidating ? 'Validando stock...' : 'Redirigiendo...'}
              </span>
            </>
          ) : (
            <span>Continuar ({totals.totalItems})</span>
          )}
        </div>
      </button>

      {/* 🆕 Mensaje informativo durante la validación */}
      {isValidating && (
        <div className="mb-3 text-center text-xs text-gray-600">
          Verificando disponibilidad de productos...
        </div>
      )}

      {/* Métodos de pago */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-900">Paga con</p>
        <div className="flex gap-2">
          <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
            VISA
          </div>
          <div className="flex h-5 w-8 items-center justify-center rounded bg-red-500 text-xs font-bold text-white">
            MC
          </div>
          <div className="flex h-5 w-8 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
            JCB
          </div>
          <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
            AMEX
          </div>
        </div>
      </div>

      {/* Protección del comprador */}
      <div className="border-t pt-4">
        <h3 className="mb-2 text-sm font-medium text-gray-900">
          Protección del comprador
        </h3>
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
          <p className="text-xs text-gray-600">
            Recibe un reembolso de tu dinero si el artículo no llega o es
            diferente al de la descripción.
          </p>
        </div>
      </div>

      {/* Resumen de promociones aplicadas (si las hay) */}
      {/* <CartPageSummaryPromotions /> */}

      <StockValidationModal
        isOpen={modal.isOpen}
        result={modal.result}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </div>
  )
}
