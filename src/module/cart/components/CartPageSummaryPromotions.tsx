import { calculateTotalsWithPromotions } from './CartPageSummary.helpers'
import { getPriceIfHasPromotion } from '@/module/products/components/ProductVariant.helpers'
import { formatPrice } from '@/module/shared/helpers/utils'
import useSummaryCart from '@/module/cart/hooks/useSummaryCart'
import { useCartContext } from '@/module/cart/providers'
import { type JSX } from 'react'

export const CartPageSummaryPromotions = (): JSX.Element => {
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
                let itemDiscount = 0
                if (currentPromotion != null) {
                  itemDiscount =
                    (Number(item.price) -
                      Number(currentPromotion.promotionPrice ?? item.price)) *
                    item.quantity
                } else {
                  itemDiscount = 0
                }

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
