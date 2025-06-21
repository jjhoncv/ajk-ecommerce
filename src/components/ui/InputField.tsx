// components/InputField.tsx
'use client'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { type InputHTMLAttributes, type JSX } from 'react'

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
  ...inputProps
}: InputFieldProps): JSX.Element => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={`${error != null ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
        {...inputProps}
      />
      {error != null && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <span className="h-1 w-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  )
}
