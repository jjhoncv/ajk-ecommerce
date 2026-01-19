// components/PasswordField.tsx
'use client'

import { Input, type InputProps } from '../Input'
import { Label } from '../Label'
import { Eye, EyeOff } from 'lucide-react'
import { type JSX } from 'react'
import { type PasswordCriterion } from './PasswordField.types'

interface PasswordFieldProps extends Omit<InputProps, 'type' | 'onChange'> {
  label: string
  onChange: (value: string) => void
  showPassword: boolean
  onToggleVisibility: () => void
  error?: string | null
  showRequirements?: boolean
  criteriaStatus?: (criteria: PasswordCriterion) => boolean
  confirmField?: boolean
  matchingPassword?: string
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
  className = '',
  ...inputProps
}: PasswordFieldProps): JSX.Element => {
  // Determinar clases de error
  const errorClasses =
    error != null
      ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error != null ? 'text-red-600' : ''}>
        {label}
        {(inputProps.required ?? false) && (
          <span className="text-red-500"> *</span>
        )}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          className={`${errorClasses} focus:ring-2 ${className}`}
          placeholder="••••••••"
          disabled={disabled}
          aria-invalid={!(error == null)}
          aria-describedby={error != null ? `${id}-error` : undefined}
          {...inputProps}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
          disabled={disabled}
          aria-label={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error != null && (
        <p
          id={`${id}-error`}
          className="mt-1 flex items-center gap-1 text-sm text-red-600"
        >
          <span className="h-1 w-1 rounded-full bg-red-600" />
          {error}
        </p>
      )}

      {confirmField &&
        Array.isArray(value) &&
        typeof value === 'string' &&
        value === matchingPassword && (
          <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
            <span className="h-1 w-1 rounded-full bg-green-600" />
            Las contraseñas coinciden
          </p>
        )}

      {showRequirements && criteriaStatus != null && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">
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
