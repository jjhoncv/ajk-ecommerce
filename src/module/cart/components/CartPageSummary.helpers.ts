import { getPriceIfHasPromotion } from '@/module/products/components/ProductVariant.helpers'
import { type CartItem } from '@/module/cart/hooks/useCart/useCart'

// Calcular totales considerando promociones
export const calculateTotalsWithPromotions = (items: CartItem[]) => {
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
