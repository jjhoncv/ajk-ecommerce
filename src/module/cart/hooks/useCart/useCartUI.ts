// hooks/useCartUI.ts
'use client'
import { usePathname, useRouter } from 'next/navigation'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { type DeleteConfirmation } from './types/cart'
import { shouldOpenMinicart } from './utils/cart-routing'

interface UseCartUIReturn {
  isCartOpen: boolean
  toastMessage: string | null
  setToastMessage: Dispatch<SetStateAction<string | null>>
  deleteConfirmation: DeleteConfirmation
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  canShowMinicart: () => boolean
  goToCartPage: () => void
  openDeleteConfirmation: (
    id: number,
    message?: string,
    onConfirm?: () => void
  ) => void
  closeDeleteConfirmation: () => void
  confirmDelete: () => void
}

export function useCartUI(): UseCartUIReturn {
  const router = useRouter()
  const pathname = usePathname()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      isOpen: false,
      productId: null,
      message: '',
      onConfirm: null
    })

  // Cerrar minicart al cambiar a ruta bloqueada
  useEffect(() => {
    console.log('🔄 Route changed to:', pathname)

    if (!shouldOpenMinicart(pathname)) {
      console.log('🔒 Closing minicart due to route restriction')
      setIsCartOpen(false)
    }
  }, [pathname])

  // Toast timer
  useEffect(() => {
    if (toastMessage !== null) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [toastMessage])

  // Funciones de UI
  const openCart = useCallback((): void => {
    console.log('👆 Attempting to open cart on route:', pathname)

    if (!shouldOpenMinicart(pathname)) {
      console.log('🚫 Minicart not allowed on this route')
      return
    }

    console.log('✅ Opening minicart')
    setIsCartOpen(true)
  }, [pathname])

  const closeCart = useCallback((): void => {
    console.log('👇 Closing cart')
    setIsCartOpen(false)
  }, [])

  const toggleCart = useCallback((): void => {
    if (isCartOpen) {
      closeCart()
    } else {
      openCart()
    }
  }, [isCartOpen, closeCart, openCart])

  const canShowMinicart = useCallback((): boolean => {
    return shouldOpenMinicart(pathname)
  }, [pathname])

  const goToCartPage = useCallback((): void => {
    console.log('🛒 Navigating to full cart page')
    setIsCartOpen(false)
    router.push('/cart')
  }, [router])

  // Delete confirmation functions
  const openDeleteConfirmation = useCallback(
    (id: number, message?: string, onConfirm?: () => void) => {
      console.log('🗑️ Opening delete confirmation:', { id })
      setDeleteConfirmation({
        isOpen: true,
        message,
        productId: id,
        onConfirm: onConfirm ?? null
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
    if (deleteConfirmation.onConfirm !== null) {
      deleteConfirmation.onConfirm()
    }
    closeDeleteConfirmation()
  }, [deleteConfirmation, closeDeleteConfirmation])

  return {
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
  }
}
