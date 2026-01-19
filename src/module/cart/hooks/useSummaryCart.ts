// hooks/useSummaryCart.ts - Hook dedicado para manejo de selección del resumen
'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type CartItem } from './useCart/useCart'

export function useSummaryCart(items: CartItem[]) {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])

  // 🆕 Ref para rastrear si la última acción fue manual (toggle)
  const lastActionWasManualRef = useRef(false)
  const previousItemsLengthRef = useRef(0)

  // Auto-seleccionar nuevos items SOLO cuando se agregan items al carrito
  useEffect(() => {
    const currentItemIds = items.map((item) => item.id)
    const currentItemsLength = items.length

    // Solo auto-seleccionar si:
    // 1. No fue una acción manual reciente
    // 2. Se agregaron nuevos items (aumentó la cantidad)
    if (
      !lastActionWasManualRef.current &&
      currentItemsLength > previousItemsLengthRef.current
    ) {
      const newItems = currentItemIds.filter(
        (id) => !selectedItemIds.includes(id)
      )

      if (newItems.length > 0) {
        console.log('📋 Auto-selecting new items for summary:', newItems)
        setSelectedItemIds((prev) => [...prev, ...newItems])
      }
    }

    // Siempre remover items que ya no existen en el carrito
    const existingSelectedIds = selectedItemIds.filter((id) =>
      currentItemIds.includes(id)
    )

    if (existingSelectedIds.length !== selectedItemIds.length) {
      console.log('📋 Removing non-existent items from summary selection')
      setSelectedItemIds(existingSelectedIds)
    }

    // Actualizar la referencia de longitud anterior
    previousItemsLengthRef.current = currentItemsLength

    // Reset del flag de acción manual después de un tiempo
    if (lastActionWasManualRef.current) {
      const timer = setTimeout(() => {
        lastActionWasManualRef.current = false
      }, 100) // 100ms es suficiente para evitar conflicts

      return () => {
        clearTimeout(timer)
      }
    }
  }, [items])

  // Verificar si un item está seleccionado
  const isItemSelected = useCallback(
    (id: number): boolean => {
      return selectedItemIds.includes(id)
    },
    [selectedItemIds]
  )

  // Toggle selección de un item individual
  const toggleItemSelection = useCallback((id: number) => {
    console.log('📋 Manual toggle for item:', id)

    // 🆕 Marcar que esta fue una acción manual
    lastActionWasManualRef.current = true

    setSelectedItemIds((prev) => {
      if (prev.includes(id)) {
        console.log('📋 Deselecting item:', id)
        return prev.filter((selectedId) => selectedId !== id)
      } else {
        console.log('📋 Selecting item:', id)
        return [...prev, id]
      }
    })
  }, [])

  // Verificar si todos los items están seleccionados
  const isAllSelected =
    items.length > 0 && selectedItemIds.length === items.length

  // Toggle selección de todos los items
  const toggleSelectAll = useCallback(() => {
    console.log('📋 Manual toggle all')

    // 🆕 Marcar que esta fue una acción manual
    lastActionWasManualRef.current = true

    if (isAllSelected) {
      console.log('📋 Deselecting all items from summary')
      setSelectedItemIds([])
    } else {
      console.log('📋 Selecting all items for summary')
      setSelectedItemIds(items.map((item) => item.id))
    }
  }, [isAllSelected, items])

  // Calcular items seleccionados y totales
  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(item.id)
  )
  const selectedTotalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Funciones para el resumen
  const getSelectedCount = () => selectedItems.length
  const hasSelectedItems = () => selectedItems.length > 0

  // Debug info
  useEffect(() => {
    console.log('📋 Summary Selection State:', {
      totalItems: items.length,
      selectedCount: selectedItems.length,
      selectedTotalItems,
      selectedTotalPrice: selectedTotalPrice.toFixed(2),
      isAllSelected,
      lastActionWasManual: lastActionWasManualRef.current
    })
  }, [
    items,
    selectedItems,
    selectedTotalItems,
    selectedTotalPrice,
    isAllSelected
  ])

  return {
    // Estados
    selectedItemIds,
    selectedItems,
    selectedTotalItems,
    selectedTotalPrice,
    isAllSelected,

    // Funciones
    isItemSelected,
    toggleItemSelection,
    toggleSelectAll,
    getSelectedCount,
    hasSelectedItems,

    // Setters (por si necesitas control directo)
    setSelectedItemIds
  }
}

export default useSummaryCart
