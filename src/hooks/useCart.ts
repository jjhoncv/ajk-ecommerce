// hooks/useCart.ts - Con sincronización de localStorage
'use client'
import { PromotionVariants } from '@/types/domain'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  stock: number
  promotionVariants?: (PromotionVariants | null)[] | null
}

// Tipos para delete confirmation
interface DeleteConfirmation {
  isOpen: boolean
  productId: number | null
  message?: string
  onConfirm: (() => void) | null
}

// 👈 CONFIGURACIÓN DE RUTAS SIMPLIFICADA
const ALLOWED_MINICART_ROUTES = [
  '/products', // Página de productos
  '/categories', // Página de categorías
  '/search', // Página de búsqueda
  '/product', // Página de producto individual
  '/category', // Página de categoría específica
  '/productos', // Base de productos
  '/productos/variante' // PDP con variantes
]

// 👈 RUTAS DONDE NO SE DEBE MOSTRAR EL MINICART (incluyendo home y cart)
const NO_MINICART_ROUTES = [
  // '/', // Homepage - NO abrir minicart
  '/cart', // Página del carrito - NO abrir minicart
  '/checkout', // Página de checkout
  '/login', // Página de login
  '/register', // Página de registro
  '/admin', // Panel admin
  '/profile', // Perfil de usuario
  '/orders' // Órdenes del usuario
]

// 👈 FUNCIÓN SIMPLIFICADA PARA VERIFICAR SI DEBE ABRIR MINICART
const shouldOpenMinicart = (currentPath: string): boolean => {
  // Verificar rutas donde NO se debe abrir minicart
  const shouldNotOpen = NO_MINICART_ROUTES.some((route) => {
    return currentPath === route || currentPath.startsWith(route + '/')
  })

  if (shouldNotOpen) {
    return false
  }

  // Verificar rutas permitidas para minicart
  const isAllowed = ALLOWED_MINICART_ROUTES.some((allowedRoute) => {
    return (
      currentPath === allowedRoute || currentPath.startsWith(allowedRoute + '/')
    )
  })

  return isAllowed
}

export function useCart() {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // FLAGS PARA CONTROLAR EL FLUJO
  const [isInitialized, setIsInitialized] = useState(false)
  const hasLoadedRef = useRef(false)
  const isMountedRef = useRef(true)

  // 🆕 ESTADO PARA DELETE CONFIRMATION
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      isOpen: false,
      productId: null,
      message: '',
      onConfirm: null
    })

  // 👈 FUNCIÓN PARA VERIFICAR SI LA RUTA PERMITE MINICART (para otros componentes)
  const isMinicartAllowedOnRoute = (currentPath: string): boolean => {
    return shouldOpenMinicart(currentPath)
  }

  // 🆕 FUNCIÓN PARA SINCRONIZAR CON LOCALSTORAGE
  const syncWithLocalStorage = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log('🔄 Syncing cart with localStorage:', parsedCart)
        setItems(parsedCart)
      }
    } catch (error) {
      console.error('❌ Error syncing with localStorage:', error)
    }
  }, [])

  // 🆕 LISTENER PARA EVENTOS DE ACTUALIZACIÓN DEL CARRITO
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('📡 Received cart update event')
      syncWithLocalStorage()
    }

    // Escuchar evento personalizado
    window.addEventListener('cartUpdated', handleCartUpdate)

    // También escuchar cambios en localStorage (para tabs múltiples)
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        console.log('📡 localStorage cart changed in another tab')
        syncWithLocalStorage()
      }
    })

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleCartUpdate)
    }
  }, [syncWithLocalStorage])

  // 👈 CERRAR MINICART AL CAMBIAR A RUTA BLOQUEADA
  useEffect(() => {
    console.log('🔄 Route changed to:', pathname)

    if (!isMinicartAllowedOnRoute(pathname)) {
      console.log('🔒 Closing minicart due to route restriction')
      setIsCartOpen(false)
    }
  }, [pathname])

  // EFECTO 1: CARGAR desde localStorage
  useEffect(() => {
    console.log('🔄 Initializing cart from localStorage...')

    if (hasLoadedRef.current) {
      console.log('⏭️ Already loaded, skipping...')
      return
    }

    const loadCart = async () => {
      try {
        const savedCart = localStorage.getItem('cart')
        console.log('📦 Raw localStorage data:', savedCart)

        if (savedCart && savedCart !== '[]' && savedCart !== 'null') {
          const parsedCart = JSON.parse(savedCart)
          console.log('✅ Parsed cart data:', parsedCart)

          if (isMountedRef.current) {
            setItems(parsedCart)
          }
        } else {
          console.log('📭 No cart data found, keeping empty array')
        }
      } catch (error) {
        console.error('❌ Error parsing cart from localStorage:', error)
      } finally {
        if (isMountedRef.current) {
          hasLoadedRef.current = true
          setIsInitialized(true)
          console.log('✅ Cart initialization complete')
        }
      }
    }

    loadCart()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  // EFECTO 2: GUARDAR en localStorage
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏭️ Skipping save - not initialized yet')
      return
    }

    console.log('💾 Saving to localStorage:', items)

    try {
      localStorage.setItem('cart', JSON.stringify(items))

      const itemCount = items.reduce((total, item) => total + item.quantity, 0)
      const priceTotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )

      setTotalItems(itemCount)
      setTotalPrice(priceTotal)

      console.log(
        '✅ Cart saved successfully. Items:',
        itemCount,
        'Total:',
        priceTotal
      )
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error)
    }
  }, [items, isInitialized])

  // EFECTO 3: Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const addItem = (
    item: Omit<CartItem, 'quantity'>,
    initialQuantity: number = 1
  ) => {
    console.log('➕ Adding item:', item.name, 'Qty:', initialQuantity)

    // Agregar el item al estado SIEMPRE
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += initialQuantity
        console.log(
          '📝 Updated existing item quantity:',
          updatedItems[existingItemIndex].quantity
        )
        return updatedItems
      } else {
        const newItems = [...prevItems, { ...item, quantity: initialQuantity }]
        console.log('🆕 Added new item. Total items:', newItems.length)
        return newItems
      }
    })

    // Mostrar toast SIEMPRE
    setToastMessage(`Añadido a la cesta!`)

    // Abrir minicart solo si la ruta lo permite
    if (shouldOpenMinicart(pathname)) {
      console.log('✨ Opening minicart after adding item on route:', pathname)
      setIsCartOpen(true)
    } else {
      console.log('🚫 Not opening minicart on route:', pathname)
    }
  }

  const removeItem = (id: number) => {
    console.log('🗑️ Removing item ID:', id)
    const itemToRemove = items.find((item) => item.id === id)

    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id)
      console.log('📝 Items after removal:', newItems.length)
      return newItems
    })

    if (itemToRemove) {
      setToastMessage(`Correctamente`)
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    console.log('🔄 Updating quantity - ID:', id, 'New qty:', quantity)

    if (quantity <= 0) {
      removeItem(id)
      return
    }

    // ✅ NUEVA LÓGICA: Leer desde localStorage para preservar stock actualizado
    setItems((prevItems) => {
      // 🔍 Obtener datos actuales de localStorage
      const currentCartData = localStorage.getItem('cart')
      let localStorageItems: CartItem[] = []

      if (currentCartData) {
        try {
          localStorageItems = JSON.parse(currentCartData)
          console.log('📦 Current localStorage cart:', localStorageItems)
        } catch (error) {
          console.error('❌ Error parsing localStorage cart:', error)
          // Fallback al estado actual si falla el parsing
          localStorageItems = prevItems
        }
      } else {
        // Fallback al estado actual si no hay localStorage
        localStorageItems = prevItems
      }

      // 🔄 Actualizar solo la cantidad, preservando otros datos de localStorage
      const updatedItems = localStorageItems.map((item) => {
        if (item.id === id) {
          const itemFromLocalStorage = localStorageItems.find(
            (lsItem) => lsItem.id === id
          )
          console.log('📝 Updating item:', {
            name: item.name,
            oldQuantity: item.quantity,
            newQuantity: quantity,
            stockFromLS: itemFromLocalStorage?.stock || item.stock,
            stockFromState: item.stock
          })

          // ✅ Preservar todos los datos de localStorage, solo cambiar quantity
          return {
            ...item, // Usar datos de localStorage (incluye stock actualizado)
            quantity // Solo actualizar la cantidad
          }
        }
        return item
      })

      console.log(
        '✅ Updated items with preserved localStorage data:',
        updatedItems
      )
      return updatedItems
    })

    // Mostrar toast SIEMPRE
    setToastMessage(`Cantidad actualizada`)

    // Abrir minicart solo si la ruta lo permite
    if (shouldOpenMinicart(pathname)) {
      console.log(
        '✨ Opening minicart after updating quantity on route:',
        pathname
      )
      setIsCartOpen(true)
    } else {
      console.log('🚫 Not opening minicart on route:', pathname)
    }
  }

  const incrementQuantity = (id: number) => {
    console.log('⬆️ Incrementing quantity for ID:', id)
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrementQuantity = (id: number) => {
    console.log('⬇️ Decrementing quantity for ID:', id)
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity - 1
            if (newQuantity <= 0) {
              console.log('🗑️ Quantity reached 0, will remove item')
              return null
            }
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const clearCart = () => {
    console.log('🧹 Clearing entire cart')
    setItems([])
    setToastMessage('Carrito vaciado')
  }

  // 👈 FUNCIÓN PRINCIPAL: ABRIR CARRITO CON VALIDACIÓN DE RUTA
  const openCart = () => {
    const currentPath = pathname
    console.log('👆 Attempting to open cart on route:', currentPath)

    if (!isMinicartAllowedOnRoute(currentPath)) {
      console.log('🚫 Minicart not allowed on this route, redirecting to /cart')
      // router.push('/cart')
      return
    }

    console.log('✅ Opening minicart')
    setIsCartOpen(true)
  }

  const closeCart = () => {
    console.log('👇 Closing cart')
    setIsCartOpen(false)
  }

  const toggleCart = () => {
    if (isCartOpen) {
      closeCart()
    } else {
      openCart()
    }
  }

  // 👈 FUNCIÓN HELPER PARA COMPONENTES
  const canShowMinicart = (): boolean => {
    return isMinicartAllowedOnRoute(pathname)
  }

  // 👈 FUNCIÓN PARA IR AL CARRITO COMPLETO
  const goToCartPage = () => {
    console.log('🛒 Navigating to full cart page')
    setIsCartOpen(false)
    router.push('/cart')
  }

  // 🆕 FUNCIONES DE DELETE CONFIRMATION
  const openDeleteConfirmation = useCallback(
    (id: number, message?: string, onConfirm?: () => void) => {
      console.log('🗑️ Opening delete confirmation:', { id })
      setDeleteConfirmation({
        isOpen: true,
        message,
        productId: id,
        onConfirm: onConfirm || (() => removeItem(id))
      })
    },
    []
  )

  const closeDeleteConfirmation = useCallback(() => {
    console.log('❌ Closing delete confirmation')
    setDeleteConfirmation({
      isOpen: false,
      productId: null,
      message: '',
      onConfirm: null
    })
  }, [])

  const confirmDelete = useCallback(() => {
    console.log('✅ Confirming delete')
    if (deleteConfirmation.onConfirm) {
      deleteConfirmation.onConfirm()
    }
    closeDeleteConfirmation()
  }, [deleteConfirmation.onConfirm, closeDeleteConfirmation])

  // DEBUG INFO
  useEffect(() => {
    console.log('📊 Cart State Summary:', {
      itemsCount: items.length,
      totalItems,
      totalPrice: totalPrice.toFixed(2),
      isInitialized,
      hasLoaded: hasLoadedRef.current,
      currentRoute: pathname,
      canShowMinicart: canShowMinicart()
    })
  }, [items, totalItems, totalPrice, isInitialized, pathname])

  return {
    // Funcionalidad principal del carrito
    items,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    goToCartPage,
    canShowMinicart,
    toastMessage,
    setToastMessage,
    isInitialized,

    // Funcionalidad de delete confirmation
    deleteConfirmation,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete
  }
}

// 👈 CONFIGURACIÓN EXPORTADA
export const CART_ROUTE_CONFIG = {
  ALLOWED_ROUTES: ALLOWED_MINICART_ROUTES,
  BLOCKED_ROUTES: NO_MINICART_ROUTES
}

export default useCart
