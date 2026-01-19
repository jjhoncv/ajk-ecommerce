'use client'
import { CartPageEmpty } from './CartPageEmpty'
import { CartPageItem } from './CartPageItem'
import { CartPageSummary } from './CartPageSummary'
import { CartPageSkeleton } from './Skeleton/CartPageSkeleton'
import { useSummaryCart } from '@/module/cart/hooks/useSummaryCart'
import { useCartContext } from '@/module/cart/providers'
import { useEffect, useState } from 'react'

export default function CartPageContent() {
  const {
    items,
    totalItems,
    isInitialized,
    openDeleteConfirmation,
    removeItem,
    updateQuantity
  } = useCartContext()

  // 🆕 Estado para almacenar información de stock actualizada desde validación
  const [stockInfo, setStockInfo] = useState<
    Array<{ id: number, availableStock: number }>
  >([])

  // 🆕 Hook dedicado para el manejo de la selección del resumen
  const summaryCart = useSummaryCart(items)

  // 🆕 CARGAR stockInfo desde localStorage al inicializar
  useEffect(() => {
    if (isInitialized) {
      try {
        const savedStockInfo = localStorage.getItem('stockValidationInfo')
        if (savedStockInfo) {
          const parsedStockInfo = JSON.parse(savedStockInfo)
          console.log(
            '📦 Restored stock validation info from localStorage:',
            parsedStockInfo
          )
          setStockInfo(parsedStockInfo)
        } else {
          console.log('📭 No stock validation info found in localStorage')
        }
      } catch (error) {
        console.error(
          '❌ Error loading stock validation info from localStorage:',
          error
        )
      }
    }
  }, [isInitialized])

  // Mostrar shimmer mientras carga
  if (!isInitialized) {
    return <CartPageSkeleton />
  }

  // Mostrar página vacía si no hay items
  if (items.length === 0) {
    return <CartPageEmpty />
  }

  const handleRemoveSelectedItems = () => {
    const selectedItems = summaryCart.selectedItems
    openDeleteConfirmation(
      -1,
      '¿Estás seguro de que quieres eliminar los artículo(s) de tu cesta?',
      () => {
        selectedItems.forEach((item) => {
          removeItem(item.id)
        })
      }
    )
  }

  // 🆕 Función para recibir actualizaciones de stock desde CartPageSummary
  const handleStockInfoUpdate = (
    newStockInfo: Array<{ id: number, availableStock: number }>
  ) => {
    console.log('📦 Stock info received in CartPageContent:', newStockInfo)
    setStockInfo(newStockInfo)

    // 🆕 GUARDAR stockInfo en localStorage para persistir después de recargas
    localStorage.setItem('stockValidationInfo', JSON.stringify(newStockInfo))
    console.log('💾 Stock validation info saved to localStorage')

    // 🆕 Actualizar SOLO el stock en localStorage, mantener quantity del usuario
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    console.log('📋 Current cart before stock update:', currentCart)

    const updatedCart = currentCart.map((cartItem: any) => {
      const stockUpdate = newStockInfo.find((info) => info.id === cartItem.id)
      if (stockUpdate) {
        console.log(`📦 Updating stock for ${cartItem.name}:`)
        console.log(
          `   Stock: ${cartItem.stock} → ${stockUpdate.availableStock}`
        )
        console.log(`   Quantity: ${cartItem.quantity} (unchanged)`)

        const updatedItem = {
          ...cartItem,
          stock: stockUpdate.availableStock // ✅ Solo actualizar stock
          // quantity se mantiene igual - es lo que eligió el usuario
        }

        console.log('📦 Updated item:', updatedItem)
        return updatedItem
      }
      return cartItem
    })

    // 🔍 Debug: verificar que los datos sean correctos antes de guardar
    console.log('💾 About to save updated cart:', updatedCart)

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    // 🔍 Verificar que se guardó correctamente
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    console.log('✅ Verified saved cart:', savedCart)
    console.log('💾 Updated cart with new stock info saved to localStorage')
    console.log('📋 User quantities preserved - no automatic changes made')

    // 🆕 Forzar actualización del contexto del carrito si es necesario
    setTimeout(() => {
      console.log('🔄 Triggering cart update event')
      window.dispatchEvent(new Event('cartUpdated'))
    }, 100)
  }

  // 🆕 Función para limpiar información de stock validado
  const clearStockValidationInfo = () => {
    console.log('🧹 Clearing stock validation info')
    setStockInfo([])
    localStorage.removeItem('stockValidationInfo')
  }

  // 🆕 Función para manejar actualizaciones del carrito (remover/ajustar cantidades)
  const handleCartUpdate = (
    adjustedItems: Array<{ id: number, quantity: number }>
  ) => {
    console.log('🔄 Processing cart updates in CartPageContent:', adjustedItems)

    adjustedItems.forEach((adjustment) => {
      if (adjustment.quantity === 0) {
        console.log(`❌ Removing item ${adjustment.id} from cart`)
        removeItem(adjustment.id)
      } else {
        console.log(
          `🔄 Updating item ${adjustment.id} quantity to ${adjustment.quantity}`
        )
        updateQuantity(adjustment.id, adjustment.quantity)
      }
    })
  }

  // 🆕 Función para obtener stock info para un item específico
  const getStockInfoForItem = (itemId: number) => {
    return stockInfo.find((info) => info.id === itemId)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pt-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Cesta ({totalItems})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Lista de productos */}
        <div className="xl:col-span-8">
          {/* Header con opciones de selección */}
          <div className="mb-4 border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={summaryCart.isAllSelected}
                  onChange={summaryCart.toggleSelectAll}
                />
                <span className="text-sm font-medium text-gray-900">
                  Seleccionar todos los artículos
                </span>
              </label>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
                onClick={handleRemoveSelectedItems}
                disabled={summaryCart.getSelectedCount() === 0}
              >
                Borrar artículos seleccionados ({summaryCart.getSelectedCount()}
                )
              </button>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            {items.map((item) => {
              const stockInfoForItem = getStockInfoForItem(item.id) // 🆕 Obtener stock info específico

              return (
                <CartPageItem
                  key={item.id}
                  item={item}
                  isSelected={summaryCart.isItemSelected(item.id)}
                  onToggleSelection={() => {
                    summaryCart.toggleItemSelection(item.id)
                  }}
                  stockInfo={stockInfoForItem} // 🆕 Pasar stock info al item
                />
              )
            })}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="xl:col-span-4">
          <CartPageSummary
            summaryCart={summaryCart}
            onCartUpdate={handleCartUpdate} // 🆕 Callback para manejar actualizaciones del carrito
            onStockInfoReceived={handleStockInfoUpdate} // 🆕 Callback para recibir info de stock
          />
        </div>
      </div>
    </div>
  )
}
