import { Zap } from 'lucide-react'

interface OfferBadgeProps {
  text: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const colorMap: Record<string, { bg: string; text: string }> = {
  red: { bg: 'bg-red-500', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  green: { bg: 'bg-green-500', text: 'text-white' },
  blue: { bg: 'bg-blue-500', text: 'text-white' },
  purple: { bg: 'bg-purple-500', text: 'text-white' },
  pink: { bg: 'bg-pink-500', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-900' },
  indigo: { bg: 'bg-indigo-500', text: 'text-white' }
}

const sizeClasses = {
  sm: 'px-2 py-1 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
}

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4'
}

export function OfferBadge({
  text,
  color = 'red',
  size = 'md',
  showIcon = false,
  className = ''
}: OfferBadgeProps) {
  const colors = colorMap[color] || { bg: 'bg-red-500', text: 'text-white' }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wide shadow-sm ${colors.bg} ${colors.text} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Zap className={`${iconSizes[size]} fill-current`} />}
      {text}
    </span>
  )
}
