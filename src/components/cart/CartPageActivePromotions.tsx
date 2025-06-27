import { type CartItem } from '@/hooks/useCart/useCart'
import { Clock, Tag } from 'lucide-react'
import { type FC } from 'react'

// Helper para obtener promoción de un item
const getPromotionFromItem = (item: CartItem) => {
  return item.promotionVariants?.[0]
}

// Helper para formatear fecha de promoción
const formatPromotionEndDate = (endDate?: string | null): string => {
  if (!endDate) return 'Fail Date'
  const date = new Date(endDate)
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima'
  })
}

interface CartPageActivePromotionsProps {
  selectedItems: CartItem[]
}

export const CartPageActivePromotions: FC<CartPageActivePromotionsProps> = ({
  selectedItems
}) => {
  // Obtener promociones únicas de los items seleccionados que tienen promoción
  const activePromotions = selectedItems
    .filter((item) => getPromotionFromItem(item)) // Solo items con promoción
    .map((item) => getPromotionFromItem(item)) // Extraer la promoción
    .filter(
      (promo, index, self) =>
        // Eliminar duplicados por promotionId
        promo &&
        index === self.findIndex((p) => p?.promotionId === promo.promotionId)
    )

  // Si no hay promociones activas en los productos seleccionados, no mostrar nada
  if (activePromotions.length === 0) {
    return null
  }

  return (
    <div className="mb-4 space-y-3">
      {activePromotions.map((promotion) => {
        if (!promotion?.promotion) return null

        return (
          <div
            key={promotion.promotionId}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white"
          >
            <div className="flex items-start justify-between">
              {/* Lado izquierdo: Información de la promoción */}
              <div className="flex-1">
                <div>
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <h3 className="text-lg font-semibold">
                        Promoción {promotion.promotion.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs opacity-90">
                        Termina:{' '}
                        {formatPromotionEndDate(
                          promotion?.promotion?.endDate.toString()
                        )}{' '}
                        (GMT-5)
                      </span>
                    </div>
                  </div>

                  {/* <p className="text-sm opacity-90 mb-2">
                    {promotion.promotion.description}
                  </p> */}
                  {/* Badges de información */}
                  <div className="flex items-center gap-3 text-sm">
                    {/* <div className="bg-white/20 rounded px-2 py-1">
                      <span className="font-medium">
                        {promotion.promotion.discountType === 'percentage'
                          ? `${Number(promotion.promotion.discountValue)}% OFF`
                          : `${formatPrice(Number(promotion.promotion.discountValue))} OFF`}
                      </span>
                    </div> */}

                    {/* {promotion.stockLimit && (
                    <div className="bg-orange-500/80 rounded px-2 py-1">
                      <span className="text-xs font-medium">
                        Stock limitado: {promotion.stockLimit}
                      </span>
                    </div>
                  )} */}

                    {/* <div className="bg-green-500/80 rounded px-2 py-1">
                    <span className="text-xs font-medium">
                      {affectedItems.length} producto{affectedItems.length > 1 ? 's' : ''}
                    </span>
                  </div> */}
                  </div>
                </div>
              </div>

              {/* Lado derecho: Descuento aplicado */}
              {/* <CartPageSummaryPromotions /> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
