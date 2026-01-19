'use client'
import { cn } from '@/lib/utils'
import { type ProductVariants } from '@/types/domain'
import { type FC, useEffect, useState } from 'react'

interface PlusMinusButtonProps {
  variant?: ProductVariants
  initialQuantity?: number
  maxQuantity?: number
  minQuantity?: number
  onQuantityChange?: (quantity: number) => void
  onRemoveRequest?: () => void
  disabled?: boolean
  forceEnabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  stock: number
  allowRemove?: boolean
  // 🆕 Nueva prop para preservar la cantidad del usuario
  preserveQuantity?: boolean
}

export const PlusMinusButton: FC<PlusMinusButtonProps> = ({
  stock,
  initialQuantity = 1,
  maxQuantity,
  minQuantity = 1,
  allowRemove = false,
  onQuantityChange,
  onRemoveRequest,
  disabled = false,
  forceEnabled = false,
  size = 'md',
  className,
  preserveQuantity = false // 🆕 Por defecto false (comportamiento original)
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)

  // Determinar la cantidad máxima
  const effectiveMaxQuantity = maxQuantity || stock || 999

  // Lógica simple: forceEnabled override disabled
  const effectiveDisabled = forceEnabled ? false : disabled

  // Sincronizar con initialQuantity cuando cambie
  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  // 🆕 Asegurar que la cantidad inicial esté en el rango válido
  // SOLO si preserveQuantity es false
  useEffect(() => {
    if (!preserveQuantity) {
      // ✅ Comportamiento original: ajustar automáticamente
      if (initialQuantity < minQuantity) {
        setQuantity(minQuantity)
      } else if (initialQuantity > effectiveMaxQuantity) {
        setQuantity(effectiveMaxQuantity)
      } else {
        setQuantity(initialQuantity)
      }
    } else {
      // ✅ Preservar cantidad: NO hacer ajustes automáticos
      setQuantity(initialQuantity)
      console.log(
        `🔒 Preserving user quantity: ${initialQuantity} (max available: ${effectiveMaxQuantity})`
      )
    }
  }, [initialQuantity, minQuantity, effectiveMaxQuantity, preserveQuantity])

  const increaseQuantity = () => {
    // ✅ Con preserveQuantity, permitir aumentar incluso si excede stock
    // El control se hace mediante advertencias visuales, no bloqueando la acción
    if (!effectiveDisabled) {
      if (preserveQuantity || quantity < effectiveMaxQuantity) {
        const newQuantity = quantity + 1
        console.log(
          `➕ Increasing quantity: ${quantity} → ${newQuantity} (max: ${effectiveMaxQuantity}, preserve: ${preserveQuantity})`
        )
        setQuantity(newQuantity)
        onQuantityChange?.(newQuantity)
      } else {
        console.log(
          `🚫 Cannot increase: ${quantity} >= ${effectiveMaxQuantity} (preserve: ${preserveQuantity})`
        )
      }
    }
  }

  const decreaseQuantity = () => {
    if (!effectiveDisabled) {
      // Si allowRemove es true y quantity es 1, mostrar confirmación
      if (allowRemove && quantity === 1) {
        onRemoveRequest?.()
        return
      }

      // Si allowRemove es false, no permitir bajar de minQuantity
      const minimumAllowed = allowRemove ? 0 : minQuantity

      if (quantity > minimumAllowed) {
        const newQuantity = quantity - 1
        console.log(
          `➖ Decreasing quantity: ${quantity} → ${newQuantity} (min: ${minimumAllowed})`
        )
        setQuantity(newQuantity)
        onQuantityChange?.(newQuantity)
      } else {
        console.log(`🚫 Cannot decrease: ${quantity} <= ${minimumAllowed}`)
      }
    }
  }

  // Determinar si el botón de disminuir debe estar deshabilitado
  const isDecreaseDisabled = () => {
    if (effectiveDisabled) return true

    // Si allowRemove es false, deshabilitar cuando llegue al mínimo
    if (!allowRemove) {
      return quantity <= minQuantity
    }

    // Si allowRemove es true, nunca deshabilitar
    return false
  }

  // 🆕 Determinar si el botón de aumentar debe estar deshabilitado
  const isIncreaseDisabled = () => {
    if (effectiveDisabled) return true

    // Si preserveQuantity es true, permitir aumentar libremente (advertencias se muestran visualmente)
    if (preserveQuantity) return false

    // Si preserveQuantity es false, comportamiento normal (respetar stock)
    return quantity >= effectiveMaxQuantity
  }

  // Variantes de tamaño
  const sizeStyles = {
    sm: {
      button: 'w-6 h-6 text-xs',
      display: 'w-8 h-6 text-sm',
      container: ''
    },
    md: {
      button: 'w-8 h-8 text-sm',
      display: 'w-12 h-8 text-sm',
      container: ''
    },
    lg: {
      button: 'w-10 h-10 text-base',
      display: 'w-16 h-10 text-base',
      container: ''
    }
  }

  const currentSize = sizeStyles[size]

  return (
    <div
      className={cn(
        'flex items-center',
        currentSize.container,
        effectiveDisabled && 'opacity-50',
        className
      )}
    >
      <button
        onClick={decreaseQuantity}
        disabled={isDecreaseDisabled()}
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
          currentSize.button
        )}
        aria-label="Disminuir cantidad"
      >
        −
      </button>

      <div
        className={cn(
          'flex items-center justify-center font-bold text-gray-900',
          currentSize.display,
          // 🆕 Indicador visual cuando la cantidad excede el stock disponible
          preserveQuantity &&
            quantity > effectiveMaxQuantity &&
            'text-orange-600'
        )}
      >
        {quantity}
      </div>

      <button
        onClick={increaseQuantity}
        disabled={isIncreaseDisabled()}
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
          currentSize.button
        )}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  )
}
