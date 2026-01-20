'use client'
import { getPromotions } from '@/module/shared/helpers/utils'
import { useAuthModal } from '@/module/customers/providers'
import { useCartContext } from '@/module/cart/providers'
import { type PromotionVariants, type VariantAttributeOptions } from '@/types/domain'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ProductVariantButtonBuyNowProps {
  id: number
  name: string
  image: string
  price: number
  stock: number
  quantity: number
  promotionVariants?: Array<PromotionVariants | null> | null
  variantAttributeOptions?: Array<VariantAttributeOptions | null> | null
}

const ProductVariantButtonBuyNow: React.FC<ProductVariantButtonBuyNowProps> = ({
  id,
  quantity,
  image,
  name,
  price,
  stock,
  promotionVariants: pvs,
  variantAttributeOptions
}) => {
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const { addItem, items, updateQuantity } = useCartContext()
  const router = useRouter()

  const promotionVariants = getPromotions(pvs)

  // Verificaciones
  const isOutOfStock = stock === 0
  const exceedsStock = quantity > stock
  const isDisabled = isOutOfStock || exceedsStock

  const addToCartAndCheckout = () => {
    // Verificar si el item ya existe en el carrito
    const existingItem = items.find((item) => item.id === id)

    if (existingItem) {
      // Actualizar cantidad
      updateQuantity(id, quantity)
    } else {
      // Agregar al carrito
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
    }

    // Ir al checkout
    router.push('/checkout')
  }

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (isDisabled) return

    // Verificar si el usuario está autenticado
    if (!session?.user) {
      // Mostrar modal de login con callback para ir al checkout
      openLogin({
        onLoginSuccess: () => {
          addToCartAndCheckout()
        }
      })
    } else {
      // Usuario autenticado, agregar al carrito e ir al checkout
      addToCartAndCheckout()
    }
  }

  return (
    <button
      onClick={handleBuyNow}
      className="w-full bg-secondary px-4 py-3 font-medium text-white transition-colors hover:bg-secondary-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isDisabled}
    >
      {stock === 0 ? 'Sin stock' : 'Comprar'}
    </button>
  )
}

export default ProductVariantButtonBuyNow
