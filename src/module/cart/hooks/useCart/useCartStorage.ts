// hooks/useCartStorage.ts
'use client'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { type CartItem } from './types/cart'
import {
  calculateCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
  syncWithLocalStorage
} from './utils/cart-storage'

interface UseCartStorageReturn {
  items: CartItem[]
  setItems: Dispatch<SetStateAction<CartItem[]>>
  totalItems: number
  totalPrice: number
  isInitialized: boolean
  syncItems: () => void
}

export function useCartStorage(): UseCartStorageReturn {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const hasLoadedRef = useRef(false)
  const isMountedRef = useRef(true)

  // Función para sincronizar con localStorage
  const syncItems = useCallback(() => {
    const syncedItems = syncWithLocalStorage()
    setItems(syncedItems)
  }, [])

  // Listener para eventos de actualización del carrito
  useEffect(() => {
    const handleCartUpdate = (): void => {
      console.log('📡 Received cart update event')
      syncItems()
    }

    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === 'cart') {
        console.log('📡 localStorage cart changed in another tab')
        syncItems()
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [syncItems])

  // Cargar carrito inicial desde localStorage
  useEffect(() => {
    if (hasLoadedRef.current) return

    const loadInitialCart = async (): Promise<void> => {
      try {
        const savedItems = loadCartFromStorage()

        if (isMountedRef.current) {
          setItems(savedItems)
        }
      } catch (error) {
        console.error('❌ Error loading initial cart:', error)
      } finally {
        if (isMountedRef.current) {
          hasLoadedRef.current = true
          setIsInitialized(true)
        }
      }
    }

    void loadInitialCart()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Guardar carrito y calcular totales
  useEffect(() => {
    if (!isInitialized) return

    saveCartToStorage(items)

    const { totalItems: newTotalItems, totalPrice: newTotalPrice } =
      calculateCartTotals(items)
    setTotalItems(newTotalItems)
    setTotalPrice(newTotalPrice)
  }, [items, isInitialized])

  return {
    items,
    setItems,
    totalItems,
    totalPrice,
    isInitialized,
    syncItems
  }
}
