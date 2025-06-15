import { PlusMinusButton } from "@/components/ui/PlusMinusButton"
import { formatPrice } from "@/helpers/utils"
import { CartItem } from "@/hooks/useCart"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { FC } from "react"

interface CartContentItemProps {
  item: CartItem
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void
}

export const CartContentItem: FC<CartContentItemProps> = ({ item, updateQuantity, removeItem }) => {
  return (
    <div key={item.id} className="flex border-b border-gray-100 py-4">
      <div className="w-20 h-20 relative flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
        <div className="flex items-center mt-2">
          <PlusMinusButton
            stock={item.stock}
            initialQuantity={item.quantity}
            onQuantityChange={(quantity: number) => updateQuantity(item.id, quantity)}
            size="sm"
          />
          <button
            onClick={() => removeItem(item.id)}
            className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-full"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
