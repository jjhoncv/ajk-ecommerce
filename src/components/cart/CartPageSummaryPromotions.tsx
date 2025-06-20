import { calculateTotalsWithPromotions } from '@/components/cart/CartPageSummary.helpers'
import { getPriceIfHasPromotion } from '@/components/product/ProductVariant.helpers'
import { formatPrice } from '@/helpers/utils'
import useSummaryCart from '@/hooks/useSummaryCart'
import { useCartContext } from '@/providers/cart'

export const CartPageSummaryPromotions = () => {
  const { items } = useCartContext()

  // 🆕 Hook dedicado para el manejo de la selección del resumen
  const summaryCart = useSummaryCart(items)

  const totals = calculateTotalsWithPromotions(summaryCart.selectedItems)
  const totalDiscount = totals.originalTotal - totals.finalTotal
  const hasDiscounts = totalDiscount > 0

  return (
    <>
      {hasDiscounts && (
        <div className="mt-4 border-t pt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-900">
            Promociones aplicadas
          </h3>
          <div className="space-y-2">
            {summaryCart.selectedItems
              .filter((item) => getPriceIfHasPromotion(item).hasPromotion)
              .map((item) => {
                const { currentPromotion } = getPriceIfHasPromotion(item)
                const itemDiscount =
                  (Number(item.price) -
                    Number(currentPromotion?.promotionPrice || item.price)) *
                  item.quantity

                return (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-green-600">
                      {currentPromotion?.promotion?.name}
                    </span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(itemDiscount)}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </>
  )
}
