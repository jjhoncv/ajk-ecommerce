import { PlusMinusButton } from "@/components/ui/PlusMinusButton"
import { formatPrice } from "@/helpers/utils"
import { CartItem } from "@/hooks/useCart"
import Image from "next/image"
import { FC } from "react"

interface CartContentThinItemProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  onDelete: (id: number, name: string) => void; // Nueva prop
}

export const CartContentThinItem: FC<CartContentThinItemProps> = ({
  item,
  updateQuantity,
  onDelete
}) => {

  const handleQuantityChange = (quantity: number) => {
    updateQuantity(item.id, quantity);
  };

  const handleRemoveRequest = () => {
    // Mostrar modal de confirmación
    onDelete(item.id, item.name);
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
      <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
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
