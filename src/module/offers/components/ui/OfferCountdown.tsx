'use client'

import { Clock, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

interface OfferCountdownProps {
  endDate: Date | string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'descriptive' | 'flip' | 'banner'
  showIcon?: boolean
  onExpire?: () => void
  className?: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calculateTimeRemaining(endDate: Date): TimeRemaining {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, expired: false }
}

export function OfferCountdown({
  endDate,
  size = 'md',
  variant = 'default',
  showIcon = true,
  onExpire,
  className = ''
}: OfferCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(new Date(endDate))
  )

  useEffect(() => {
    const end = new Date(endDate)

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(end)
      setTimeRemaining(remaining)

      if (remaining.expired) {
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate, onExpire])

  if (timeRemaining.expired) {
    return (
      <div className={`flex items-center gap-1.5 text-red-600 ${className}`}>
        {showIcon && <Clock className="h-4 w-4" />}
        <span className="font-medium">Oferta terminada</span>
      </div>
    )
  }

  const { days, hours, minutes, seconds } = timeRemaining

  // Variante descriptiva: "3d 12h 35m 12s"
  if (variant === 'descriptive') {
    const sizeStyles = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }

    return (
      <div className={`flex items-center gap-1.5 ${sizeStyles[size]} ${className}`}>
        {showIcon && <Clock className="h-4 w-4 text-red-500" />}
        <span className="font-medium text-gray-700">
          Termina en:{' '}
          <span className="font-bold text-red-600">
            {days > 0 && `${days}d `}
            {hours}h {minutes}m {seconds}s
          </span>
        </span>
      </div>
    )
  }

  // Variante banner: "⏰ Termina en 3d 19h 35m 12s"
  if (variant === 'banner') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-gray-600 ${className}`}>
        <Clock className="h-3.5 w-3.5" />
        <span>
          Termina en{' '}
          <span className="font-semibold text-gray-800">
            {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
          </span>
        </span>
      </div>
    )
  }

  // Variante compacta: "02:10:33:50" con labels debajo
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <Clock className="h-4 w-4 text-red-500" />}
        <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
          {days > 0 && (
            <>
              <span>{days.toString().padStart(2, '0')}<span className="text-xs font-normal text-gray-500">d</span></span>
              <span className="text-gray-400">:</span>
            </>
          )}
          <span>{hours.toString().padStart(2, '0')}<span className="text-xs font-normal text-gray-500">h</span></span>
          <span className="text-gray-400">:</span>
          <span>{minutes.toString().padStart(2, '0')}<span className="text-xs font-normal text-gray-500">m</span></span>
          <span className="text-gray-400">:</span>
          <span>{seconds.toString().padStart(2, '0')}<span className="text-xs font-normal text-gray-500">s</span></span>
        </div>
      </div>
    )
  }

  // Variante flip: estilo flip clock moderno
  if (variant === 'flip') {
    const flipSizeClasses = {
      sm: {
        container: 'gap-1.5',
        padding: 'px-3 py-2',
        title: 'text-[10px]',
        value: 'text-base min-w-[24px]',
        label: 'text-[8px]',
        separator: 'text-sm pb-3'
      },
      md: {
        container: 'gap-2',
        padding: 'px-4 py-3',
        title: 'text-xs',
        value: 'text-xl min-w-[32px]',
        label: 'text-[9px]',
        separator: 'text-base pb-4'
      },
      lg: {
        container: 'gap-3',
        padding: 'px-5 py-4',
        title: 'text-sm',
        value: 'text-2xl min-w-[40px]',
        label: 'text-[10px]',
        separator: 'text-lg pb-5'
      }
    }

    const flipClasses = flipSizeClasses[size]

    const FlipUnit = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center">
        <span className={`font-mono font-bold text-gray-900 ${flipClasses.value}`}>
          {value.toString().padStart(2, '0')}
        </span>
        <span className={`font-medium uppercase tracking-wider text-gray-500 ${flipClasses.label}`}>
          {label}
        </span>
      </div>
    )

    return (
      <div className={`inline-flex flex-col items-center rounded-lg border border-red-100 bg-red-50 ${flipClasses.padding} ${className}`}>
        <div className={`mb-1 flex items-center gap-1 font-bold text-red-600 ${flipClasses.title}`}>
          <Flame className="h-3 w-3" />
          <span>OFERTA TERMINA EN</span>
        </div>
        <div className={`flex items-center ${flipClasses.container}`}>
          {days > 0 && (
            <>
              <FlipUnit value={days} label="días" />
              <span className={`text-gray-300 ${flipClasses.separator}`}>:</span>
            </>
          )}
          <FlipUnit value={hours} label="hrs" />
          <span className={`text-gray-300 ${flipClasses.separator}`}>:</span>
          <FlipUnit value={minutes} label="min" />
          <span className={`text-gray-300 ${flipClasses.separator}`}>:</span>
          <FlipUnit value={seconds} label="seg" />
        </div>
      </div>
    )
  }

  // Variante default: boxes con números
  const sizeClasses = {
    sm: { unit: 'min-w-[22px] px-1 py-0.5 text-xs', label: 'text-[9px]' },
    md: { unit: 'min-w-[28px] px-1.5 py-1 text-sm', label: 'text-[10px]' },
    lg: { unit: 'min-w-[36px] px-2 py-1.5 text-base', label: 'text-xs' }
  }

  const classes = sizeClasses[size]

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className={`rounded bg-gray-900 font-mono font-bold text-white ${classes.unit}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`mt-0.5 text-gray-500 ${classes.label}`}>{label}</span>
    </div>
  )

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Clock className="h-4 w-4 text-red-500" />}
      <div className="flex items-center gap-1">
        {days > 0 && (
          <>
            <TimeUnit value={days} label="días" />
            <span className="pb-4 text-gray-400">:</span>
          </>
        )}
        <TimeUnit value={hours} label="hrs" />
        <span className="pb-4 text-gray-400">:</span>
        <TimeUnit value={minutes} label="min" />
        <span className="pb-4 text-gray-400">:</span>
        <TimeUnit value={seconds} label="seg" />
      </div>
    </div>
  )
}
