import { PlusMinusButton } from "@/components/ui/PlusMinusButton"
import { formatPrice } from "@/helpers/utils"
import { CartItem } from "@/hooks/useCart"
import Image from "next/image"
import { FC } from "react"

interface CartContentThinItemProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  onDelete: (id: number) => void; // Nueva prop
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
    updateQuantity(item.id, quantity);
  };

  const handleRemoveRequest = () => {
    onDelete(item.id);
  };

  return (
    <div key={item.id} className="flex flex-col space-y-2 items-center">
      <div className="w-20 h-20 relative flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <p className="text-primary font-bold text-sm">{formatPrice(price)}</p>
      <div className="flex items-center mt-2">
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
