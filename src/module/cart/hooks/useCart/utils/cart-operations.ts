// utils/cart-operations.ts
import { type CartItem } from './../types/cart'
import { syncWithLocalStorage } from './cart-storage'

/**
 * Agrega un item al carrito
 */
export const addItemToCart = (
  currentItems: CartItem[],
  newItem: Omit<CartItem, 'quantity'>,
  initialQuantity: number = 1
): CartItem[] => {
  const existingItemIndex = currentItems.findIndex((i) => i.id === newItem.id)

  if (existingItemIndex >= 0) {
    const updatedItems = [...currentItems]
    updatedItems[existingItemIndex].quantity += initialQuantity
    console.log(
      '📝 Updated existing item quantity:',
      updatedItems[existingItemIndex].quantity
    )
    return updatedItems
  } else {
    const newItems = [
      ...currentItems,
      { ...newItem, quantity: initialQuantity }
    ]
    console.log('🆕 Added new item. Total items:', newItems.length)
    return newItems
  }
}

/**
 * Remueve un item del carrito
 */
export const removeItemFromCart = (
  currentItems: CartItem[],
  itemId: number
): CartItem[] => {
  const itemToRemove = currentItems.find((item) => item.id === itemId)
  console.log('🗑️ Removing item:', itemToRemove?.name)

  return currentItems.filter((item) => item.id !== itemId)
}

/**
 * Actualiza la cantidad de un item (con preservación de datos de localStorage)
 */
export const updateItemQuantity = (
  currentItems: CartItem[],
  itemId: number,
  newQuantity: number
): CartItem[] => {
  // Obtener datos actuales de localStorage para preservar stock actualizado
  const localStorageItems = syncWithLocalStorage()
  const itemsToUpdate =
    localStorageItems.length > 0 ? localStorageItems : currentItems

  return itemsToUpdate.map((item) => {
    if (item.id === itemId) {
      console.log('📝 Updating item quantity:', {
        name: item.name,
        oldQuantity: item.quantity,
        newQuantity,
        stock: item.stock
      })

      return {
        ...item, // Preservar datos de localStorage
        quantity: newQuantity // Solo actualizar cantidad
      }
    }
    return item
  })
}

/**
 * Incrementa la cantidad de un item
 */
export const incrementItemQuantity = (
  currentItems: CartItem[],
  itemId: number
): CartItem[] => {
  return currentItems.map((item) =>
    item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
  )
}

/**
 * Decrementa la cantidad de un item (remueve si llega a 0)
 */
export const decrementItemQuantity = (
  currentItems: CartItem[],
  itemId: number
): CartItem[] => {
  return currentItems
    .map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity - 1
        if (newQuantity <= 0) {
          console.log('🗑️ Quantity reached 0, removing item')
          return null
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    .filter(Boolean) as CartItem[]
}
