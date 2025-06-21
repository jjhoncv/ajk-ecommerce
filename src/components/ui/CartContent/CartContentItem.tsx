import { PlusMinusButton } from '@/components/ui/PlusMinusButton'
import { formatPrice } from '@/helpers/utils'
import { type CartItem } from '@/hooks/useCart'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

interface CartContentItemProps {
  item: CartItem
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
}

export const CartContentItem: FC<CartContentItemProps> = ({
  item,
  updateQuantity,
  removeItem
}) => {
  return (
    <div key={item.id} className="flex border-b border-gray-100 py-4">
      <div className="relative h-20 w-20 flex-shrink-0">
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
        <p className="font-bold text-primary">{formatPrice(item.price)}</p>
        <div className="mt-2 flex items-center">
          <PlusMinusButton
            stock={item.stock}
            initialQuantity={item.quantity}
            onQuantityChange={(quantity: number) => { updateQuantity(item.id, quantity) }
            }
            size="sm"
          />
          <button
            onClick={() => { removeItem(item.id) }}
            className="ml-auto rounded-full p-1 text-red-500 hover:bg-red-50"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
