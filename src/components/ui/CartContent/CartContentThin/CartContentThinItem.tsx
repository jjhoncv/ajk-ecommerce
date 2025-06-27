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
    // const variant = getVariant(item.promotionVariants);
    if (!item?.promotionVariants) return item.price
    const promotionPrice = item?.promotionVariants[0]?.promotionPrice
    if (!promotionPrice) return item.price
    return promotionPrice
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
