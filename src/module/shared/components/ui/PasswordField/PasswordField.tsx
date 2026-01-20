// components/PasswordField.tsx
'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { type PasswordCriterion } from './PasswordField.types'

interface PasswordFieldProps {
  id?: string
  label: string
  value?: string | number | readonly string[]
  onChange: (value: string) => void
  showPassword: boolean
  onToggleVisibility: () => void
  error?: string | null
  disabled?: boolean
  showRequirements?: boolean
  criteriaStatus?: (criteria: PasswordCriterion) => boolean
  confirmField?: boolean
  matchingPassword?: string
  required?: boolean
  autoComplete?: string
}

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  error = null,
  disabled = false,
  showRequirements = false,
  criteriaStatus,
  confirmField = false,
  matchingPassword = '',
  required,
  autoComplete
}: PasswordFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value != null && value !== ''
  const isFloating = isFocused || hasValue

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'peer h-12 w-full border bg-white px-3 pt-4 pb-1 pr-10 text-sm outline-none transition-colors',
            error != null
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          placeholder=" "
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error != null}
          aria-describedby={error != null ? `${id}-error` : undefined}
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

        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          disabled={disabled}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error != null && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}

      {confirmField &&
        typeof value === 'string' &&
        value !== '' &&
        value === matchingPassword && (
          <p className="mt-1 text-xs text-green-600">
            Las contraseñas coinciden
          </p>
        )}

      {showRequirements && criteriaStatus != null && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-gray-700">
            Requisitos de la contraseña:
          </p>
          <div className="space-y-1">
            <PasswordCriterionItem
              met={criteriaStatus('length')}
              text="Al menos 8 caracteres"
            />
            <PasswordCriterionItem
              met={criteriaStatus('uppercase')}
              text="Una letra mayúscula"
            />
            <PasswordCriterionItem
              met={criteriaStatus('lowercase')}
              text="Una letra minúscula"
            />
            <PasswordCriterionItem
              met={criteriaStatus('number')}
              text="Un número"
            />
            <PasswordCriterionItem
              met={criteriaStatus('special')}
              text="Un carácter especial (!@#$%^&*)"
            />
          </div>
        </div>
      )}
    </div>
  )
}

const PasswordCriterionItem = ({
  met,
  text
}: {
  met: boolean
  text: string
}): JSX.Element => (
  <div
    className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}
  >
    <div
      className={`h-1.5 w-1.5 rounded-full ${met ? 'bg-green-600' : 'bg-gray-300'}`}
    />
    {text}
  </div>
)
