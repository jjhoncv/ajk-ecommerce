import { cn } from "@/lib/utils"
import { ProductVariants } from "@/types/domain"
import { FC, useEffect, useState } from "react"

interface PlusMinusButtonProps {
  variant?: ProductVariants
  initialQuantity?: number
  maxQuantity?: number
  minQuantity?: number
  onQuantityChange?: (quantity: number) => void
  onRemoveRequest?: () => void
  disabled?: boolean
  forceEnabled?: boolean // 👈 SOLO ESTA PROP ES NECESARIA
  size?: 'sm' | 'md' | 'lg'
  className?: string
  stock: number
  allowRemove?: boolean
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
  forceEnabled = false, // 👈 SIMPLE Y DIRECTO
  size = 'md',
  className
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)

  // Determinar la cantidad máxima
  const effectiveMaxQuantity = maxQuantity || stock || 999

  // 👈 LÓGICA SIMPLE: forceEnabled override disabled
  const effectiveDisabled = forceEnabled ? false : disabled

  // Sincronizar con initialQuantity cuando cambie
  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  // Asegurar que la cantidad inicial esté en el rango válido
  useEffect(() => {
    if (initialQuantity < minQuantity) {
      setQuantity(minQuantity)
    } else if (initialQuantity > effectiveMaxQuantity) {
      setQuantity(effectiveMaxQuantity)
    } else {
      setQuantity(initialQuantity)
    }
  }, [initialQuantity, minQuantity, effectiveMaxQuantity])

  const increaseQuantity = () => {
    if (quantity < effectiveMaxQuantity && !effectiveDisabled) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
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
        setQuantity(newQuantity)
        onQuantityChange?.(newQuantity)
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

  // Variantes de tamaño
  const sizeStyles = {
    sm: {
      button: "w-6 h-6 text-xs",
      display: "w-8 h-6 text-sm",
      container: ""
    },
    md: {
      button: "w-8 h-8 text-sm",
      display: "w-12 h-8 text-sm",
      container: ""
    },
    lg: {
      button: "w-10 h-10 text-base",
      display: "w-16 h-10 text-base",
      container: ""
    }
  }

  const currentSize = sizeStyles[size]

  return (
    <div className={cn(
      "flex items-center",
      currentSize.container,
      effectiveDisabled && "opacity-50",
      className
    )}>
      <button
        onClick={decreaseQuantity}
        disabled={isDecreaseDisabled()}
        className={cn(
          "flex items-center font-semibold rounded-full bg-gray-100 justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          currentSize.button
        )}
        aria-label="Disminuir cantidad"
      >
        −
      </button>

      <div className={cn(
        "flex items-center justify-center font-bold text-gray-900",
        currentSize.display
      )}>
        {quantity}
      </div>

      <button
        onClick={increaseQuantity}
        disabled={quantity >= effectiveMaxQuantity || effectiveDisabled}
        className={cn(
          "flex items-center justify-center font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          currentSize.button
        )}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  )
}
