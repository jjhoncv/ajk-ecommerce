'use client'
import { getPromotions } from '@/helpers/utils'
import { useCartContext } from '@/providers/cart'
import { type PromotionVariants } from '@/types/domain'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

interface ProductCardButtonAddToCartProps {
  id: number
  name: string
  image: string
  price: number
  stock: number
  quantity: number
  promotionVariants?: Array<PromotionVariants | null> | null
}

const ProductCardButtonAddToCart: React.FC<ProductCardButtonAddToCartProps> = ({
  id,
  quantity,
  name,
  price,
  image,
  stock,
  promotionVariants: pvs
}) => {
  const { updateQuantity, items, addItem, openCart } = useCartContext()

  // Encontrar el item en el carrito si existe
  const existingItem = items.find((item) => item.id === id)
  // const currentCartQuantity = existingItem?.quantity || 0;

  // Verificaciones
  const isOutOfStock = stock === 0
  const exceedsStock = quantity > stock
  // const sameAsCart = existingItem && currentCartQuantity === quantity;

  // El botón se deshabilita si no hay stock, excede stock, o ya tiene esa cantidad
  const isDisabled = isOutOfStock || exceedsStock

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const promotionVariants = getPromotions(pvs)

    if (isDisabled) return

    if (existingItem) {
      // Establecer la cantidad total (no sumar)
      updateQuantity(id, quantity)
    } else {
      // Agregar nuevo item
      addItem(
        {
          id,
          image,
          name,
          price,
          stock,
          promotionVariants
        },
        quantity
      )
      openCart()
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      className="absolute bottom-2 right-2 mt-3 flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-secondary bg-secondary py-2 text-white transition-colors hover:border-2 hover:border-secondary hover:bg-secondary-200 hover:bg-transparent hover:text-secondary"
    >
      <ShoppingCart className="h-6 w-6" />
    </button>
  )
}

export default ProductCardButtonAddToCart
