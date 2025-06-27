// utils/cart-storage.ts
import { type CartItem } from './../types/cart'

export const CART_STORAGE_KEY = 'cart'

/**
 * Guarda el carrito en localStorage
 */
export const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    console.log('💾 Cart saved to localStorage:', items.length, 'items')
  } catch (error) {
    console.error('❌ Error saving cart to localStorage:', error)
  }
}

/**
 * Carga el carrito desde localStorage
 */
export const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (savedCart !== null && savedCart !== '[]' && savedCart !== 'null') {
      const parsedCart = JSON.parse(savedCart) as CartItem[]
      console.log(
        '📦 Cart loaded from localStorage:',
        parsedCart.length,
        'items'
      )
      return parsedCart
    }

    console.log('📭 No cart data found in localStorage')
    return []
  } catch (error) {
    console.error('❌ Error loading cart from localStorage:', error)
    return []
  }
}

/**
 * Sincroniza con localStorage (para usar en listeners)
 */
export const syncWithLocalStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart !== null) {
      const parsedCart = JSON.parse(savedCart) as CartItem[]
      console.log(
        '🔄 Syncing cart with localStorage:',
        parsedCart.length,
        'items'
      )
      return parsedCart
    }
    return []
  } catch (error) {
    console.error('❌ Error syncing with localStorage:', error)
    return []
  }
}

/**
 * Calcula totales del carrito
 */
export const calculateCartTotals = (
  items: CartItem[]
): {
  totalItems: number
  totalPrice: number
} => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return { totalItems, totalPrice }
}
