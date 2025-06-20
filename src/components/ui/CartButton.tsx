'use client'
import { useCartContext } from '@/providers/cart'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const CartButton: React.FC = () => {
  const { totalItems } = useCartContext() // 👈 Usar useCart directamente
  const router = useRouter()
  const handleGoToPageCart = () => {
    router.push('/cart')
  }

  return (
    <button
      className="relative flex flex-col items-center"
      onClick={handleGoToPageCart}
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="mt-1 text-xs">Carrito</span>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {totalItems}
        </span>
      )}
    </button>
  )
}

export default CartButton
