// hooks/useCart.ts - Refactored
'use client'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { type CartItem, type UseCartReturn } from './types/cart'
import { useCartStorage } from './useCartStorage'
import { useCartUI } from './useCartUI'
import {
  addItemToCart,
  decrementItemQuantity,
  incrementItemQuantity,
  removeItemFromCart,
  updateItemQuantity
} from './utils/cart-operations'
import { shouldOpenMinicart } from './utils/cart-routing'

export function useCart(): UseCartReturn {
  const pathname = usePathname()

  // Hooks separados
  const { items, setItems, totalItems, totalPrice, isInitialized } =
    useCartStorage()

  const {
    isCartOpen,
    toastMessage,
    setToastMessage,
    deleteConfirmation,
    openCart,
    closeCart,
    toggleCart,
    canShowMinicart,
    goToCartPage,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete
  } = useCartUI()

  // Operaciones del carrito
  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, initialQuantity: number = 1): void => {
      console.log('➕ Adding item:', item.name, 'Qty:', initialQuantity)

      setItems((prevItems) => addItemToCart(prevItems, item, initialQuantity))

      setToastMessage('Añadido a la cesta!')

      if (shouldOpenMinicart(pathname)) {
        console.log('✨ Opening minicart after adding item on route:', pathname)
        openCart()
      } else {
        console.log('🚫 Not opening minicart on route:', pathname)
      }
    },
    [pathname, setItems, setToastMessage, openCart]
  )

  const removeItem = useCallback(
    (id: number): void => {
      console.log('🗑️ Removing item ID:', id)
      setItems((prevItems) => removeItemFromCart(prevItems, id))
    },
    [setItems]
  )

  const updateQuantity = useCallback(
    (id: number, quantity: number): void => {
      console.log('🔄 Updating quantity - ID:', id, 'New qty:', quantity)

      if (quantity <= 0) {
        removeItem(id)
        return
      }

      setItems((prevItems) => updateItemQuantity(prevItems, id, quantity))

      setToastMessage('Cantidad actualizada')

      if (shouldOpenMinicart(pathname)) {
        console.log(
          '✨ Opening minicart after updating quantity on route:',
          pathname
        )
        openCart()
      } else {
        console.log('🚫 Not opening minicart on route:', pathname)
      }
    },
    [pathname, removeItem, setItems, setToastMessage, openCart]
  )

  const incrementQuantity = useCallback(
    (id: number): void => {
      console.log('⬆️ Incrementing quantity for ID:', id)
      setItems((prevItems) => incrementItemQuantity(prevItems, id))
    },
    [setItems]
  )

  const decrementQuantity = useCallback(
    (id: number): void => {
      console.log('⬇️ Decrementing quantity for ID:', id)
      setItems((prevItems) => decrementItemQuantity(prevItems, id))
    },
    [setItems]
  )

  const clearCart = useCallback((): void => {
    console.log('🧹 Clearing entire cart')
    setItems([])
    setToastMessage('Carrito vaciado')
  }, [setItems, setToastMessage])

  // Enhanced delete confirmation with removeItem integration
  const enhancedOpenDeleteConfirmation = useCallback(
    (id: number, message?: string, onConfirm?: () => void) => {
      const defaultOnConfirm = (): void => {
        removeItem(id)
        setToastMessage('Producto eliminado')
      }

      openDeleteConfirmation(id, message, onConfirm ?? defaultOnConfirm)
    },
    [removeItem, setToastMessage, openDeleteConfirmation]
  )

  // Debug info
  useEffect(() => {
    console.log('📊 Cart State Summary:', {
      itemsCount: items.length,
      totalItems,
      totalPrice: totalPrice.toFixed(2),
      isInitialized,
      currentRoute: pathname,
      canShowMinicart: canShowMinicart()
    })
  }, [
    items.length,
    totalItems,
    totalPrice,
    isInitialized,
    pathname,
    canShowMinicart
  ])

  return {
    // Cart data
    items,
    totalItems,
    totalPrice,
    isInitialized,

    // Cart operations
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,

    // UI state
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    goToCartPage,
    canShowMinicart,
    toastMessage,
    setToastMessage,

    // Delete confirmation
    deleteConfirmation,
    openDeleteConfirmation: enhancedOpenDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete
  }
}

export default useCart

// Re-export for convenience
export type { CartItem } from './types/cart'
export { CART_ROUTE_CONFIG } from './utils/cart-routing'
