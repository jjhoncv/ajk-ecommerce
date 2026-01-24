import { Flame, TrendingDown } from 'lucide-react'

interface OfferStockIndicatorProps {
  remainingStock: number | null
  totalStock?: number | null
  showProgress?: boolean
  urgencyThreshold?: number
  variant?: 'default' | 'minimal' | 'badge'
  className?: string
}

export function OfferStockIndicator({
  remainingStock,
  totalStock,
  showProgress = true,
  urgencyThreshold = 5,
  variant = 'default',
  className = ''
}: OfferStockIndicatorProps) {
  if (remainingStock === null) return null

  const isLowStock = remainingStock <= urgencyThreshold
  const percentage = totalStock
    ? Math.round((remainingStock / totalStock) * 100)
    : null

  // Variante badge: chip compacto
  if (variant === 'badge') {
    if (remainingStock === 0) {
      return (
        <span className={`inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 ${className}`}>
          Agotado
        </span>
      )
    }

    return (
      <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
        isLowStock
          ? 'bg-orange-50 text-orange-700'
          : 'bg-gray-50 text-gray-600'
      } ${className}`}>
        {isLowStock && <Flame className="h-3 w-3" />}
        {isLowStock ? `¡Solo ${remainingStock}!` : `${remainingStock} disponibles`}
      </span>
    )
  }

  // Variante minimal: solo texto
  if (variant === 'minimal') {
    return (
      <span className={`text-xs ${isLowStock ? 'font-medium text-orange-600' : 'text-gray-500'} ${className}`}>
        {remainingStock === 0
          ? 'Agotado'
          : isLowStock
            ? `¡Últimas ${remainingStock} unidades!`
            : `${remainingStock} disponibles`
        }
      </span>
    )
  }

  // Variante default: con barra de progreso
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        {isLowStock && <TrendingDown className="h-3.5 w-3.5 text-orange-500" />}
        <span className={`text-xs ${isLowStock ? 'font-medium text-orange-600' : 'text-gray-600'}`}>
          {remainingStock === 0 ? (
            'Agotado'
          ) : isLowStock ? (
            `¡Últimas ${remainingStock} unidades!`
          ) : (
            `${remainingStock} disponibles`
          )}
        </span>
      </div>

      {showProgress && percentage !== null && remainingStock > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full transition-all duration-300 ${
              isLowStock ? 'bg-orange-400' : 'bg-gray-300'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}
