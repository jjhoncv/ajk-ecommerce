import StockValidationModal from "@/components/checkout/StockValidationModal";
import { useCheckoutNavigation } from "@/components/checkout/useStockValidation";
import { formatPrice } from "@/helpers/utils";
import { CartItem } from "@/hooks/useCart";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

// Helper para obtener precio con promoción
const getPriceIfHasPromotion = (item: CartItem) => {
  const currentPromotion = item.promotionVariants?.[0];
  const originalPrice = Number(item.price);
  const promotionPrice = currentPromotion ? Number(currentPromotion.promotionPrice) : null;
  const finalPrice = promotionPrice || originalPrice;

  return {
    finalPrice,
    hasPromotion: Boolean(currentPromotion),
    originalPrice,
    currentPromotion
  };
};

interface CartPageSummaryProps {
  summaryCart: {
    selectedItems: CartItem[];
    selectedTotalItems: number;
    selectedTotalPrice: number;
    hasSelectedItems: () => boolean;
  };
  onCartUpdate?: (adjustedItems: Array<{ id: number; quantity: number }>) => void; // Callback para actualizar carrito
  onStockInfoReceived?: (stockInfo: Array<{ id: number; availableStock: number }>) => void; // 🆕 Callback para recibir stock info
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
        const { finalPrice, originalPrice } = getPriceIfHasPromotion(item);
        const itemOriginalTotal = originalPrice * item.quantity;
        const itemFinalTotal = finalPrice * item.quantity;

        acc.originalTotal += itemOriginalTotal;
        acc.finalTotal += itemFinalTotal;
        acc.totalItems += item.quantity;

        return acc;
      },
      { originalTotal: 0, finalTotal: 0, totalItems: 0 }
    );
  };

  const totals = calculateTotalsWithPromotions(summaryCart.selectedItems);
  const totalDiscount = totals.originalTotal - totals.finalTotal;
  const hasDiscounts = totalDiscount > 0;

  const [isNavigating, setIsNavigating] = useState(false)

  // 🆕 Hook para validación de stock
  const { proceedFromCart, isValidating, modal } = useCheckoutNavigation()

  // 🆕 Función actualizada con validación de stock
  const handleContinueToCheckout = async () => {
    if (!summaryCart.hasSelectedItems()) return

    setIsNavigating(true)

    try {
      // 🆕 Preparar items para validación
      const cartItems = summaryCart.selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity
      }))

      // 🆕 Callback para recibir información de stock (SOLO INFORMATIVO)
      const handleStockInfoReceived = (stockInfo: Array<{ id: number; availableStock: number }>) => {
        console.log('📦 Stock info received in CartPageSummary:', stockInfo);

        // 🆕 Enviar información de stock al padre para mostrar en CartPageItem
        if (onStockInfoReceived) {
          onStockInfoReceived(stockInfo);
        }
      };

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
        <div className="bg-white border border-gray-200 p-4 sticky top-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen</h2>

          {/* Total cuando no hay items seleccionados */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Estimación total</span>
              <span>{formatPrice(0)}</span>
            </div>
          </div>

          {/* Botón deshabilitado */}
          <button
            className="w-full bg-gray-400 text-white py-3 cursor-not-allowed font-medium mb-6"
            disabled
          >
            <div className="flex items-center justify-center gap-2">
              <span>Continuar (0)</span>
            </div>
            <div className="text-xs opacity-90">🚚 Envío gratis!</div>
          </button>

          {/* Métodos de pago */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-2">Paga con</p>
            <div className="flex gap-2">
              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">JCB</div>
              <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
            </div>
          </div>

          {/* Protección del comprador */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Protección del comprador</h3>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Recibe un reembolso de tu dinero si el artículo no llega o es diferente al de la descripción.
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

    );
  }

  return (
    <div className="bg-white border border-gray-200 p-4 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>

      {/* Imágenes pequeñas de productos seleccionados */}
      <div className="flex gap-2 mb-4">
        {summaryCart.selectedItems.slice(0, 3).map((item) => (
          <div key={item.id} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {summaryCart.selectedItems.length > 3 && (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
            +{summaryCart.selectedItems.length - 3}
          </div>
        )}
      </div>

      {/* Cálculos basados en productos seleccionados CON promociones */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total de artículos</span>
          <span className="font-medium">{formatPrice(totals.originalTotal)}</span>
        </div>

        {hasDiscounts && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento de artículos</span>
            <span className="text-red-600 font-medium">-{formatPrice(totalDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-green-600 font-medium">Gratis</span>
        </div>

        {hasDiscounts && (
          <div className="text-xs text-gray-500">
            ¡{formatPrice(totalDiscount)} ahorrado! Visita la página de pago
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Estimación total</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>
      </div>

      {/* 🆕 Botón actualizado con estados de validación */}
      <button
        onClick={handleContinueToCheckout}
        className="w-full font-bold bg-red-600 text-white py-3 hover:bg-red-700 transition-colors mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!summaryCart.hasSelectedItems() || isLoading}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
        <div className="text-xs text-center text-gray-600 mb-3">
          Verificando disponibilidad de productos...
        </div>
      )}

      {/* Métodos de pago */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">Paga con</p>
        <div className="flex gap-2">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
          <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">JCB</div>
          <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
        </div>
      </div>

      {/* Protección del comprador */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Protección del comprador</h3>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            Recibe un reembolso de tu dinero si el artículo no llega o es diferente al de la descripción.
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
  );
};