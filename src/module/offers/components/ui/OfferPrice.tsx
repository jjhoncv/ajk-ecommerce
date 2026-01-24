interface OfferPriceProps {
  originalPrice: number
  offerPrice: number
  showSavings?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
  className?: string
}

const sizeClasses = {
  sm: {
    original: 'text-xs',
    offer: 'text-lg',
    savings: 'text-[10px]'
  },
  md: {
    original: 'text-sm',
    offer: 'text-xl',
    savings: 'text-xs'
  },
  lg: {
    original: 'text-base',
    offer: 'text-2xl',
    savings: 'text-sm'
  }
}

export function OfferPrice({
  originalPrice,
  offerPrice,
  showSavings = true,
  size = 'md',
  layout = 'vertical',
  className = ''
}: OfferPriceProps) {
  const savings = originalPrice - offerPrice
  const savingsPercent = Math.round((savings / originalPrice) * 100)
  const classes = sizeClasses[size]

  const formatPrice = (price: number) => `S/${price.toFixed(2)}`

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-bold text-green-600 ${classes.offer}`}>
          {formatPrice(offerPrice)}
        </span>
        <span className={`text-gray-400 line-through ${classes.original}`}>
          {formatPrice(originalPrice)}
        </span>
        {showSavings && (
          <span className={`rounded bg-green-100 px-1.5 py-0.5 font-medium text-green-700 ${classes.savings}`}>
            -{savingsPercent}%
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-green-600 ${classes.offer}`}>
          {formatPrice(offerPrice)}
        </span>
        <span className={`text-gray-400 line-through ${classes.original}`}>
          {formatPrice(originalPrice)}
        </span>
      </div>
      {showSavings && (
        <span className={`text-green-600 ${classes.savings}`}>
          Ahorras {formatPrice(savings)} ({savingsPercent}% OFF)
        </span>
      )}
    </div>
  )
}
