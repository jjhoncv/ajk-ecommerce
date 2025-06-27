'use client'
import { useCart } from '@/hooks/useCart/useCart'
import { type JSX } from 'react'
import { CartContext } from './Cart.context'

export function CartProvider({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  const cartValue = useCart()

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  )
}
