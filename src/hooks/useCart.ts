'use client'
import { useEffect, useState } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
      }
    }
  }, [])

  // Guardar el carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))

    // Calcular totales
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const priceTotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    setTotalItems(itemCount)
    setTotalPrice(priceTotal)
  }, [items])

  // Mostrar toast y ocultarlo después de un tiempo
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Agregar un item al carrito
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      // Verificar si el item ya existe en el carrito
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Si existe, incrementar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })

    // Mostrar mensaje toast
    setToastMessage(`¡${item.name} agregado al carrito!`)
  }

  // Eliminar un item del carrito
  const removeItem = (id: number) => {
    const itemToRemove = items.find((item) => item.id === id)
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    if (itemToRemove) {
      setToastMessage(`${itemToRemove.name} eliminado del carrito`)
    }
  }

  // Actualizar la cantidad de un item
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  // Incrementar cantidad
  const incrementQuantity = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  // Decrementar cantidad
  const decrementQuantity = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity - 1
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      })
    )

    // Si la cantidad llega a 0, eliminar el item
    const item = items.find((item) => item.id === id)
    if (item && item.quantity === 1) {
      removeItem(id)
    }
  }

  // Vaciar el carrito
  const clearCart = () => {
    setItems([])
    setToastMessage('Carrito vaciado')
  }

  // Abrir el carrito
  const openCart = () => {
    setIsCartOpen(true)
  }

  // Cerrar el carrito
  const closeCart = () => {
    setIsCartOpen(false)
  }

  // Alternar el estado del carrito
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

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
    toastMessage,
    setToastMessage
  }
}

export default useCart
