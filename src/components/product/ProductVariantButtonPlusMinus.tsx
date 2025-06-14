import { cn } from "@/lib/utils"
import { ProductVariants } from "@/types/domain"
import { FC, useEffect, useState } from "react"

interface ProductVariantButtonPlusMinusProps {
  variant?: ProductVariants
  initialQuantity?: number
  maxQuantity?: number
  minQuantity?: number
  onQuantityChange?: (quantity: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProductVariantButtonPlusMinus: FC<ProductVariantButtonPlusMinusProps> = ({
  variant,
  initialQuantity = 1,
  maxQuantity,
  minQuantity = 1,
  onQuantityChange,
  disabled = false,
  size = 'md',
  className
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)

  // Determinar la cantidad máxima
  const effectiveMaxQuantity = maxQuantity || variant?.stock || 999

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
    if (quantity < effectiveMaxQuantity && !disabled) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > minQuantity && !disabled) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  // Variantes de tamaño
  const sizeVariants = {
    sm: {
      button: "w-6 h-6 text-xs",
      display: "w-8 h-6 text-xs",
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

  const currentSize = sizeVariants[size]

  return (
    <div className={cn(
      "flex items-center border border-gray-300",
      currentSize.container,
      disabled && "opacity-50",
      className
    )}>
      <button
        onClick={decreaseQuantity}
        disabled={quantity <= minQuantity || disabled}
        className={cn(
          "flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          currentSize.button
        )}
        aria-label="Disminuir cantidad"
      >
        −
      </button>

      <div className={cn(
        "flex items-center justify-center font-medium text-gray-900 border-x border-gray-300",
        currentSize.display
      )}>
        {quantity}
      </div>

      <button
        onClick={increaseQuantity}
        disabled={quantity >= effectiveMaxQuantity || disabled}
        className={cn(
          "flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          currentSize.button
        )}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  )
}