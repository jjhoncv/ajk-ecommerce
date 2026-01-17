import { PlusMinusButton } from '@/components/ui/PlusMinusButton'
import { formatPrice } from '@/helpers/utils'
import { type CartItem } from '@/hooks/useCart/useCart'
import Image from 'next/image'
import { type FC } from 'react'

interface CartContentThinItemProps {
  item: CartItem
  updateQuantity: (id: number, quantity: number) => void
  onDelete: (id: number) => void // Nueva prop
}

export const CartContentThinItem: FC<CartContentThinItemProps> = ({
  item,
  updateQuantity,
  onDelete
}) => {
  // const variant: ProductVariants = item?.promotionVariants?.find(pv => pv?.variantId === item.id)

  // const getVariant = (promotionVariants?: (PromotionVariants | null)[] | null | undefined): ProductVariants | null => {

  //   const variant = item?.promotionVariants?.find(pv => pv?.variantId === item.id)
  //   return variant
  // }

  const getPrice = (): number => {
    // Calcular costos adicionales de los atributos
    const additionalCost = item.variantAttributeOptions?.reduce((total, vao) => {
      return total + (Number(vao?.additionalCost) || 0)
    }, 0) || 0

    // Precio base del item
    const basePrice = Number(item.price || 0)

    // Si no hay promoción, retornar precio base + adicionales
    if (!item?.promotionVariants) return basePrice + additionalCost

    const promotionPrice = item?.promotionVariants[0]?.promotionPrice

    // Si no hay precio de promoción, retornar precio base + adicionales
    if (!promotionPrice) return basePrice + additionalCost

    // Si hay promoción, retornar precio promocional + adicionales
    return Number(promotionPrice) + additionalCost
  }

  const price = getPrice()

  const handleQuantityChange = (quantity: number) => {
    updateQuantity(item.id, quantity)
  }

  const handleRemoveRequest = () => {
    onDelete(item.id)
  }

  return (
    <div key={item.id} className="flex flex-col items-center space-y-2">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <p className="text-sm font-bold text-primary">{formatPrice(price)}</p>
      <div className="mt-2 flex items-center">
        <PlusMinusButton
          allowRemove={true}
          stock={item.stock}
          initialQuantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          onRemoveRequest={handleRemoveRequest} // Nueva prop
          size="sm"
        />
      </div>
    </div>
  )
}
