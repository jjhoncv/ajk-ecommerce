'use client'
import { getPromotions } from '@/helpers/utils'
import { useCartContext } from '@/providers/cart'
import { type PromotionVariants, type VariantAttributeOptions } from '@/types/domain'
import React from 'react'

interface ProductVariantButtonAddToCartProps {
  id: number
  name: string
  image: string
  price: number
  stock: number
  quantity: number
  promotionVariants?: Array<PromotionVariants | null> | null
  variantAttributeOptions?: Array<VariantAttributeOptions | null> | null
  onCartAction?: () => void
}

const ProductVariantButtonAddToCart: React.FC<
  ProductVariantButtonAddToCartProps
> = ({
  id,
  quantity,
  image,
  name,
  price,
  stock,
  promotionVariants: pvs,
  variantAttributeOptions,
  onCartAction
}) => {
  const { updateQuantity, items, addItem, openCart } = useCartContext()

  const promotionVariants = getPromotions(pvs)

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
          promotionVariants,
          variantAttributeOptions
        },
        quantity
      )
      openCart()
    }
    onCartAction?.()
  }

  return (
    <button
      onClick={handleAddToCart}
      className={'w-full border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'}
      disabled={isDisabled}
    >
      Agregar al carrito
    </button>
  )
}

export default ProductVariantButtonAddToCart
