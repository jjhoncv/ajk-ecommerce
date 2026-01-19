'use client'
import { MiniCartEmpty } from './MiniCartEmpty'
import { MiniCartItem } from './MiniCartItem'
import { MiniCartPurchase } from './MiniCartPurchase'

import { type CartItem } from '@/module/cart/hooks/useCart/useCart'
import React, { type JSX } from 'react'

interface MiniCartContentProps {
  items: CartItem[]
  totalPrice: number
  updateQuantity: (id: number, quantity: number) => void
  onDelete: (id: number) => void
  onClose: () => void
}

export const MiniCartContent: React.FC<MiniCartContentProps> = ({
  items,
  totalPrice,
  updateQuantity,
  onDelete,
  onClose
}): JSX.Element => {
  const hasNotItems = items.length === 0

  if (hasNotItems) {
    return <MiniCartEmpty />
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <MiniCartPurchase onClose={onClose} totalPrice={totalPrice} />
      <div className="flex h-full max-h-[calc(100%-144px)] flex-col overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 gap-y-5">
          {items.map((item) => (
            <MiniCartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
