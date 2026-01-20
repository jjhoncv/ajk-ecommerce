// components/InputField.tsx
'use client'

import { type InputHTMLAttributes, type JSX, useState } from 'react'
import { cn } from '@/lib/utils'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  containerClassName?: string
}

export const InputField = ({
  id,
  label,
  error,
  containerClassName = '',
  value,
  onFocus,
  onBlur,
  ...inputProps
}: InputFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value != null && value !== ''
  const isFloating = isFocused || hasValue

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className={containerClassName}>
      <div className="relative">
        <input
          id={id}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'peer h-12 w-full border bg-white px-3 pt-4 pb-1 text-sm outline-none transition-colors',
            error != null
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-500',
            inputProps.disabled && 'cursor-not-allowed opacity-50'
          )}
          placeholder=" "
          {...inputProps}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-3 transition-all duration-200',
            isFloating
              ? 'top-1 text-xs'
              : 'top-1/2 -translate-y-1/2 text-sm',
            error != null
              ? 'text-red-500'
              : isFocused
                ? 'text-blue-500'
                : 'text-gray-500'
          )}
        >
          {label}
        </label>
      </div>
      {error != null && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
