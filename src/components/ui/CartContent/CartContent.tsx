'use client'
import { CartContentEmpty } from '@/components/ui/CartContent/CartContentEmpty'
import { CartContentItem } from '@/components/ui/CartContent/CartContentItem'
import { CartContentPurchase } from '@/components/ui/CartContent/CartContentPurchase'
import { CartItem } from '@/hooks/useCart'
import React, { JSX } from 'react'

interface CartContentProps {
  items: CartItem[]
  totalPrice: number
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  onClose: () => void
}

export const CartContent: React.FC<CartContentProps> = ({
  items,
  totalPrice,
  removeItem,
  updateQuantity,
  onClose
}): JSX.Element => {
  const hasNotItems = items.length === 0

  if (hasNotItems) {
    return <CartContentEmpty />
  }

  return (
    <div className="flex h-full flex-col">
      <CartContentPurchase onClose={onClose} totalPrice={totalPrice} />
      <div className="flex h-full max-h-[calc(100%-179px)] flex-col">
        <div className="flex-grow overflow-auto p-4">
          {items.map((item, key) => (
            <CartContentItem
              key={key}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
