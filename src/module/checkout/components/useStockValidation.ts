'use client'
import { useAuthModal } from '@/module/customers/providers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface StockError {
  variantId: number
  productName: string
  requestedQuantity: number
  availableStock: number
  message: string
}

interface ValidationResult {
  isValid: boolean
  errors: StockError[]
  hasOutOfStock: boolean
  hasReducedStock: boolean
}

interface StockValidationModal {
  isOpen: boolean
  result: ValidationResult | null
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

export function useStockValidation() {
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(false)
  const [modal, setModal] = useState<StockValidationModal>({
    isOpen: false,
    result: null,
    onConfirm: null,
    onCancel: null
  })

  // ✅ Función para validar stock (solo informativa)
  const validateAndProceedToCheckout = async (
    items: Array<{ id: number, name: string, quantity: number }>,
    onStockInfoReceived?: (
      stockInfo: Array<{ id: number, availableStock: number }>
    ) => void
  ): Promise<boolean> => {
    setIsValidating(true)

    try {
      console.log('🔍 Validating stock for cart items:', items)

      const response = await fetch('/api/checkout/validate-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      if (!response.ok) {
        throw new Error('Error validating stock')
      }

      const validation = await response.json()
      console.log('📊 Stock validation result:', validation)

      if (validation.isValid) {
        // ✅ Todo está bien, proceder al checkout
        console.log('✅ Stock validation passed, proceeding to checkout')
        router.push('/checkout')
        return true
      } else {
        // ✅ Hay problemas de stock - SOLO informar, no cambiar
        console.log('⚠️ Stock validation failed, showing informational modal')
        const result = processValidationErrors(validation.errors, items)

        // ✅ Enviar información de stock actualizada para mostrar en carrito
        if (onStockInfoReceived) {
          const stockInfo = validation.errors.map((error: any) => ({
            id: error.variantId,
            availableStock: error.availableStock
          }))
          console.log('📦 Sending stock info to cart:', stockInfo)
          onStockInfoReceived(stockInfo)
        }

        return new Promise((resolve) => {
          setModal({
            isOpen: true,
            result,
            onConfirm: () => {
              // ✅ Solo cerrar modal - NO hacer cambios automáticos
              console.log('✅ User acknowledged stock issues, closing modal')
              closeModal()
              resolve(false) // No proceder al checkout
            },
            onCancel: () => {
              console.log('❌ User cancelled stock validation')
              closeModal()
              resolve(false)
            }
          })
        })
      }
    } catch (error) {
      console.error('❌ Error validating stock:', error)
      // En caso de error de red, permitir continuar (fallback)
      router.push('/checkout')
      return true
    } finally {
      setIsValidating(false)
    }
  }

  // Procesar errores de validación
  const processValidationErrors = (
    errors: any[],
    originalItems: Array<{ id: number, name: string, quantity: number }>
  ): ValidationResult => {
    const stockErrors: StockError[] = errors.map((error) => {
      const originalItem = originalItems.find(
        (item) => item.id === error.variantId
      )
      return {
        variantId: error.variantId,
        productName: originalItem?.name || 'Producto desconocido',
        requestedQuantity: error.requestedQuantity,
        availableStock: error.availableStock,
        message: error.message
      }
    })

    const hasOutOfStock = stockErrors.some(
      (error) => error.availableStock === 0
    )
    const hasReducedStock = stockErrors.some(
      (error) =>
        error.availableStock > 0 &&
        error.availableStock < error.requestedQuantity
    )

    return {
      isValid: false,
      errors: stockErrors,
      hasOutOfStock,
      hasReducedStock
    }
  }

  const closeModal = () => {
    setModal({
      isOpen: false,
      result: null,
      onConfirm: null,
      onCancel: null
    })
  }

  return {
    isValidating,
    modal,
    validateAndProceedToCheckout,
    closeModal
  }
}

export function useCheckoutNavigation() {
  const { validateAndProceedToCheckout, ...rest } = useStockValidation()
  const { data: session, status } = useSession()
  const { openLogin } = useAuthModal()
  const [pendingCheckout, setPendingCheckout] = useState<{
    cartItems: Array<{ id: number; name: string; quantity: number }>
    onStockInfoReceived?: (
      stockInfo: Array<{ id: number; availableStock: number }>
    ) => void
  } | null>(null)

  // ✅ Verificar autenticación antes de proceder
  const checkAuthAndProceed = async (
    cartItems: Array<{ id: number; name: string; quantity: number }>,
    onStockInfoReceived?: (
      stockInfo: Array<{ id: number; availableStock: number }>
    ) => void
  ): Promise<boolean> => {
    // Si está cargando el estado de sesión, esperar
    if (status === 'loading') {
      return false
    }

    // Si no está autenticado, mostrar modal de login
    if (!session?.user) {
      console.log('🔐 User not authenticated, showing login modal')
      setPendingCheckout({ cartItems, onStockInfoReceived })

      openLogin({
        onLoginSuccess: () => {
          console.log('✅ Login successful, proceeding to checkout')
          // Después del login exitoso, proceder al checkout
          validateAndProceedToCheckout(cartItems, onStockInfoReceived)
        },
        onClose: () => {
          console.log('❌ Login modal closed without login')
          setPendingCheckout(null)
        }
      })

      return false
    }

    // Si está autenticado, proceder con la validación de stock
    return await validateAndProceedToCheckout(cartItems, onStockInfoReceived)
  }

  // ✅ Para usar desde el carrito (solo informativo)
  const proceedFromCart = async (
    cartItems: Array<{ id: number; name: string; quantity: number }>,
    onStockInfoReceived: (
      stockInfo: Array<{ id: number; availableStock: number }>
    ) => void
  ) => {
    return await checkAuthAndProceed(cartItems, onStockInfoReceived)
  }

  // Para usar desde PDP (compra directa)
  const proceedFromPDP = async (
    productId: number,
    productName: string,
    quantity: number
  ) => {
    return await checkAuthAndProceed([
      {
        id: productId,
        name: productName,
        quantity
      }
    ])
  }

  return {
    ...rest,
    proceedFromCart,
    proceedFromPDP,
    isAuthenticated: !!session?.user,
    isAuthLoading: status === 'loading'
  }
}
