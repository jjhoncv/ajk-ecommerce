// hooks/useCart.ts - SIN AUTO-APERTURA, SOLO VALIDACIONES DE RUTA
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

// 👈 CONFIGURACIÓN DE RUTAS DONDE SE PERMITE EL MINICART
const ALLOWED_MINICART_ROUTES = [
  // '/', // Homepage
  '/products', // Página de productos
  '/categories', // Página de categorías
  '/search', // Página de búsqueda
  '/product', // Página de producto individual
  '/category', // Página de categoría específica
  '/productos', // Base de productos
  '/productos/variante' // PDP con variantes
  // Agregar más rutas según necesites
]

// 👈 RUTAS DONDE NO SE DEBE MOSTRAR EL MINICART
const BLOCKED_MINICART_ROUTES = [
  '/cart', // Página del carrito (ya estás ahí)
  '/checkout', // Página de checkout
  '/login', // Página de login
  '/register', // Página de registro
  '/admin', // Panel admin
  '/profile', // Perfil de usuario
  '/orders' // Órdenes del usuario
]

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

  // 👈 FUNCIÓN PARA VERIFICAR SI LA RUTA PERMITE MINICART
  const isMinicartAllowedOnRoute = (currentPath: string): boolean => {
    // Verificar rutas bloqueadas primero (más específicas)
    const isBlocked = BLOCKED_MINICART_ROUTES.some((blockedRoute) => {
      return (
        currentPath === blockedRoute ||
        currentPath.startsWith(blockedRoute + '/')
      )
    })

    if (isBlocked) {
      console.log('🚫 Minicart blocked on route:', currentPath)
      return false
    }

    // Verificar rutas permitidas
    const isAllowed = ALLOWED_MINICART_ROUTES.some((allowedRoute) => {
      return (
        currentPath === allowedRoute ||
        currentPath.startsWith(allowedRoute + '/')
      )
    })

    console.log(
      '✅ Minicart allowed on route:',
      currentPath,
      '- Allowed:',
      isAllowed
    )
    return isAllowed
  }

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

  // 👈 FUNCIONES DEL CARRITO
  const addItem = (
    item: Omit<CartItem, 'quantity'>,
    initialQuantity: number = 1
  ) => {
    console.log('➕ Adding item:', item.name, 'Qty:', initialQuantity)

    // 👈 LÓGICA ESPECIAL: Si estamos en ruta bloqueada, redirigir a /cart
    if (!isMinicartAllowedOnRoute(pathname)) {
      console.log(
        '🚫 Adding item on blocked route, will redirect to /cart after adding'
      )

      // Agregar el item primero
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += initialQuantity
          return updatedItems
        } else {
          return [...prevItems, { ...item, quantity: initialQuantity }]
        }
      })

      setToastMessage(`Producto añadido! Redirigiendo al carrito...`)
      setTimeout(() => {
        router.push('/cart')
      }, 1500)

      return
    }

    // Flujo normal para rutas permitidas
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

    setToastMessage(`Añadido a la cesta!`)

    // 👈 NUEVO: Abrir minicart después de agregar producto en ruta válida
    console.log('✨ Opening minicart after adding item')
    setIsCartOpen(true)
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
      setToastMessage(`Producto eliminado: ${itemToRemove.name}`)
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    console.log('🔄 Updating quantity - ID:', id, 'New qty:', quantity)

    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          console.log('📝 Updated item quantity:', item.name, quantity)
          return { ...item, quantity }
        }
        return item
      })
    )

    setToastMessage(`Cantidad actualizada`)

    // 👈 NUEVO: Abrir minicart después de actualizar cantidad en ruta válida
    if (isMinicartAllowedOnRoute(pathname)) {
      console.log('✨ Opening minicart after updating quantity')
      setIsCartOpen(true)
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
      router.push('/cart')
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
    isInitialized
  }
}

// 👈 CONFIGURACIÓN EXPORTADA
export const CART_ROUTE_CONFIG = {
  ALLOWED_ROUTES: ALLOWED_MINICART_ROUTES,
  BLOCKED_ROUTES: BLOCKED_MINICART_ROUTES
}

export default useCart
